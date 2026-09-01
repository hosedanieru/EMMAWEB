import crypto from "crypto";

// Documentación: https://docs.wompi.co/docs/colombia/widget-checkout-web/
// La firma de integridad se calcula SIEMPRE en el servidor. Si esto se
// hiciera en el navegador, cualquiera podría alterar el monto antes de
// pagar y la firma seguiría "cuadrando".
export function generarFirmaIntegridad({
  referencia,
  montoEnCentavos,
  moneda = "COP",
}: {
  referencia: string;
  montoEnCentavos: number;
  moneda?: string;
}) {
  const secreto = process.env.WOMPI_INTEGRITY_SECRET;
  if (!secreto) {
    throw new Error("WOMPI_INTEGRITY_SECRET no está configurado en el .env");
  }

  const cadena = `${referencia}${montoEnCentavos}${moneda}${secreto}`;
  return crypto.createHash("sha256").update(cadena).digest("hex");
}

// El checkout de Wompi está detrás de CloudFront, y su WAF rechaza con un
// 403 ("Request blocked", ni siquiera llega a Wompi) cualquier link que
// lleve un redirect-url apuntando a una dirección local o privada:
// localhost, 127.0.0.1, 192.168.x.x, etc. Es una regla anti-SSRF del WAF,
// no una validación de Wompi — por eso el 403 aparece aunque las llaves
// estén perfectas. Verificado probando la URL real: con redirect-url
// público responde 200, y con localhost/127.0.0.1/192.168.x.x responde 403.
//
// Como en desarrollo el origen SIEMPRE es http://localhost:3000, mandar ese
// redirect-url rompía el checkout entero. Acá detectamos ese caso y lo
// omitimos: se pierde el retorno automático a la tienda (solo en local),
// pero el pago funciona. Para probar también el retorno, hay que exponer el
// sitio con un dominio público (ngrok, por ejemplo) y ponerlo en APP_URL.
function esHostPublico(url: string): boolean {
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase().replace(/^\[|\]$/g, "");
  } catch {
    return false;
  }

  if (host === "localhost" || host.endsWith(".localhost")) return false;
  if (host.endsWith(".local")) return false;
  if (host === "::1" || host === "0.0.0.0") return false;

  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [a, b] = [Number(ipv4[1]), Number(ipv4[2])];
    if (a === 127 || a === 10 || a === 0) return false; // loopback / privada
    if (a === 192 && b === 168) return false; // LAN doméstica
    if (a === 172 && b >= 16 && b <= 31) return false; // LAN privada
    if (a === 169 && b === 254) return false; // link-local
  }

  return true;
}

// Genera el link de pago (Web Checkout) para un pedido puntual. Devuelve
// null si todavía no tenemos las credenciales reales configuradas — así el
// resto del flujo (aprobar pedido, mandar correo) sigue funcionando sin
// romperse mientras llegan.
export function generarUrlPago({
  referencia,
  montoEnCentavos,
  correoCliente,
  redirectUrl,
}: {
  referencia: string;
  montoEnCentavos: number;
  correoCliente: string;
  // A dónde vuelve el navegador del cliente después de pagar en el
  // checkout de Wompi. Sin esto, el cliente queda "varado" en el sitio de
  // Wompi sin forma de volver a la tienda.
  redirectUrl?: string;
}): string | null {
  const publicKey = process.env.WOMPI_PUBLIC_KEY;
  if (!publicKey || !process.env.WOMPI_INTEGRITY_SECRET) {
    return null;
  }

  const firma = generarFirmaIntegridad({ referencia, montoEnCentavos });

  const params = new URLSearchParams({
    "public-key": publicKey,
    currency: "COP",
    "amount-in-cents": String(montoEnCentavos),
    reference: referencia,
    "signature:integrity": firma,
    "customer-data:email": correoCliente,
  });

  // Ver esHostPublico: un redirect-url local hace que CloudFront tumbe el
  // link con 403 antes de que Wompi lo vea. Preferimos un checkout sin
  // retorno automático a un checkout que no abre.
  if (redirectUrl && esHostPublico(redirectUrl)) {
    params.set("redirect-url", redirectUrl);
  }

  return `https://checkout.wompi.co/p/?${params.toString()}`;
}

type EventoWompi = {
  data: Record<string, unknown>;
  timestamp: number;
  signature: { properties: string[]; checksum: string };
};

// Margen para aceptar un evento. Cubre el desfase normal de relojes entre
// servidores y los reintentos de Wompi, que pueden tardar minutos. Demasiado
// estricto y se rechazarían pagos legítimos, que es mucho peor que aceptar un
// evento repetido (el webhook ya es idempotente).
const TOLERANCIA_TIMESTAMP_SEGUNDOS = 15 * 60;

// Lee un valor anidado a partir de una ruta tipo "transaction.id".
function leerRuta(objeto: Record<string, unknown>, ruta: string): unknown {
  return ruta
    .split(".")
    .reduce<unknown>(
      (valor, parte) => (valor as Record<string, unknown> | undefined)?.[parte],
      objeto
    );
}

// Verifica que un webhook realmente venga de Wompi. Importante: Wompi indica
// en signature.properties CUÁLES campos entran en el checksum y EN QUÉ ORDEN.
// Esa lista puede variar entre eventos, así que nunca se hardcodea acá —
// siempre se lee dinámicamente del evento recibido (advertencia explícita de
// la documentación de Wompi).
export function verificarFirmaEvento(evento: EventoWompi): boolean {
  const secreto = process.env.WOMPI_EVENTS_SECRET;
  if (!secreto) return false;
  if (!evento?.signature?.properties || !evento.signature.checksum) return false;

  // Un evento capturado y reenviado más tarde no puede hacer daño, porque el
  // filtro pagadoEn: null del webhook lo hace idempotente. Pero descartar los
  // eventos viejos cierra la categoría entera por dos líneas, y el timestamp
  // ya viene firmado — falsificarlo invalida el checksum.
  if (typeof evento.timestamp !== "number") return false;
  const desfaseSegundos = Math.abs(Date.now() / 1000 - evento.timestamp);
  if (desfaseSegundos > TOLERANCIA_TIMESTAMP_SEGUNDOS) {
    console.error(
      `Webhook de Wompi con timestamp fuera de rango (${Math.round(desfaseSegundos)}s de desfase), se ignora.`
    );
    return false;
  }

  const valores = evento.signature.properties.map((ruta) =>
    String(leerRuta(evento.data, ruta))
  );

  const cadena = valores.join("") + evento.timestamp + secreto;
  const checksumCalculado = crypto
    .createHash("sha256")
    .update(cadena)
    .digest("hex");

  return (
    checksumCalculado.toUpperCase() === evento.signature.checksum.toUpperCase()
  );
}
