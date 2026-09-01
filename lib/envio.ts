// Costo de envío y cobertura.
//
// Por qué existe este archivo: el sitio ya prometía "Domicilios gratis en la
// sabana occidente por compras desde $50.000" en la barra promocional y
// "entregas a domicilio con flota eléctrica" en el FAQ, pero el checkout
// sumaba únicamente el precio de los productos. Es decir: se prometía una
// política de envío que no se cobraba ni se validaba, y `ciudad` era un campo
// de texto libre — un pedido de $8.000 a Leticia salía con envío gratis.
//
// El cálculo vive acá, en un módulo puro sin dependencias, para poder usarse
// en los dos lados: el checkout lo llama para mostrarle el costo al cliente
// antes de confirmar, y /api/pedidos lo vuelve a llamar para calcular el total
// de verdad. El del servidor es el que manda — el del navegador es solo para
// que la pantalla no mienta.
//
// ─────────────────────────────────────────────────────────────────────────
// TARIFAS: los números de acá los define el negocio, no el código.
// Están puestos según lo que el sitio ya promete públicamente. Confirmarlos
// con Emma antes de abrir; cambiarlos es editar esta tabla y nada más.
// ─────────────────────────────────────────────────────────────────────────

export type ZonaEnvio = {
  id: string;
  nombre: string;
  /** Municipios que pertenecen a la zona, tal como se le muestran al cliente. */
  ciudades: string[];
  /** Lo que se cobra cuando el pedido no llega al umbral de envío gratis. */
  costo: number;
  /** Desde este subtotal (solo productos) el envío no se cobra. */
  envioGratisDesde: number;
};

export const ZONAS_ENVIO: ZonaEnvio[] = [
  {
    id: "sabana-occidente",
    nombre: "Sabana de Occidente",
    // Es la zona de la planta (Parque Industrial Santo Domingo) y la que la
    // barra promocional del sitio nombra explícitamente.
    ciudades: [
      "Bojacá",
      "El Rosal",
      "Facatativá",
      "Funza",
      "Madrid",
      "Mosquera",
      "Subachoque",
      "Zipacón",
    ],
    costo: 6000,
    envioGratisDesde: 50000,
  },
  {
    id: "bogota",
    nombre: "Bogotá D.C.",
    ciudades: ["Bogotá"],
    costo: 12000,
    envioGratisDesde: 120000,
  },
];

/** Todas las ciudades con cobertura, ordenadas, para armar el desplegable. */
export const CIUDADES_CON_COBERTURA: string[] = ZONAS_ENVIO.flatMap(
  (z) => z.ciudades
).sort((a, b) => a.localeCompare(b, "es"));

export function zonaDeCiudad(ciudad: string): ZonaEnvio | null {
  const normalizada = ciudad.trim().toLowerCase();
  return (
    ZONAS_ENVIO.find((z) =>
      z.ciudades.some((c) => c.toLowerCase() === normalizada)
    ) ?? null
  );
}

export type ResultadoEnvio =
  | { cubierto: true; costo: number; zona: ZonaEnvio; gratis: boolean }
  | { cubierto: false };

/**
 * Calcula el envío para un subtotal de productos y una ciudad.
 *
 * Devuelve `cubierto: false` si la ciudad no está en ninguna zona. El checkout
 * solo ofrece ciudades cubiertas en el desplegable, así que ese caso solo se
 * alcanza si alguien manda la petición a mano — y ahí /api/pedidos la rechaza
 * en vez de despachar a donde la flota no llega.
 */
export function calcularEnvio(
  subtotalProductos: number,
  ciudad: string
): ResultadoEnvio {
  const zona = zonaDeCiudad(ciudad);
  if (!zona) return { cubierto: false };

  const gratis = subtotalProductos >= zona.envioGratisDesde;
  return { cubierto: true, costo: gratis ? 0 : zona.costo, zona, gratis };
}
