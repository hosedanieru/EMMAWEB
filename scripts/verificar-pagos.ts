// Verificación de la lógica de cobro. Se corre con `npm run verificar`.
//
// Cubre las tres piezas donde un error se traduce en plata mal cobrada y que
// no se detectan compilando: el redondeo, el cálculo del envío y las dos
// firmas de Wompi. No pretende ser una suite de pruebas — es la comprobación
// mínima que conviene correr antes de desplegar y después de tocar cualquiera
// de estos archivos.
import "dotenv/config";
import crypto from "crypto";
import { pesosEnteros, aCentavos, formatearCOP } from "../lib/dinero";
import { calcularEnvio, zonaDeCiudad, CIUDADES_CON_COBERTURA } from "../lib/envio";
import { generarFirmaIntegridad, verificarFirmaEvento } from "../lib/wompi";
import { consumir, reiniciar } from "../lib/rate-limit";

let fallos = 0;
let pasadas = 0;

function comprobar(descripcion: string, condicion: boolean, detalle?: string) {
  if (condicion) {
    pasadas++;
    console.log(`  ok   ${descripcion}`);
  } else {
    fallos++;
    console.error(`  FALLA ${descripcion}${detalle ? ` — ${detalle}` : ""}`);
  }
}

function seccion(titulo: string) {
  console.log(`\n${titulo}`);
}

// ─── Redondeo ──────────────────────────────────────────────────────────────
seccion("Redondeo a peso entero");

comprobar("2047.5 redondea a 2048", pesosEnteros(2047.5) === 2048);
comprobar("3659.25 redondea a 3659", pesosEnteros(3659.25) === 3659);
comprobar("91481.25 redondea a 91481", pesosEnteros(91481.25) === 91481);
comprobar("un entero se queda igual", pesosEnteros(1600) === 1600);

// El caso que motivó todo: precio con fracción por cantidad, y el resultado
// tiene que ser un número de pesos que se pueda pagar en efectivo.
const subtotalEjemplo = pesosEnteros(2047.5) * 3;
comprobar(
  "3 × 2047.5 da 6144 (entero, factura verificable a mano)",
  subtotalEjemplo === 6144,
  `dio ${subtotalEjemplo}`
);
comprobar(
  "el monto en centavos es múltiplo de 100",
  aCentavos(subtotalEjemplo) % 100 === 0,
  `dio ${aCentavos(subtotalEjemplo)}`
);

// Coma flotante: sumar muchos precios puede dejar un .0000000001 colgando.
const sumaLarga = Array.from({ length: 97 }, () => pesosEnteros(2047.5)).reduce(
  (a, b) => a + b,
  0
);
comprobar(
  "sumar 97 líneas no deja residuo de coma flotante",
  Number.isInteger(sumaLarga) && aCentavos(sumaLarga) % 100 === 0
);

// ─── Envío ─────────────────────────────────────────────────────────────────
seccion("Cálculo de envío");

comprobar("hay ciudades con cobertura configuradas", CIUDADES_CON_COBERTURA.length > 0);
comprobar("Funza está en Sabana de Occidente", zonaDeCiudad("Funza")?.id === "sabana-occidente");
comprobar("Bogotá está en su propia zona", zonaDeCiudad("Bogotá")?.id === "bogota");
comprobar("la ciudad se reconoce sin importar mayúsculas", zonaDeCiudad("fUNZA") !== null);
comprobar("una ciudad sin cobertura devuelve null", zonaDeCiudad("Leticia") === null);

const bajoUmbral = calcularEnvio(30000, "Funza");
comprobar(
  "por debajo del umbral se cobra envío",
  bajoUmbral.cubierto && bajoUmbral.costo > 0 && !bajoUmbral.gratis
);

const sobreUmbral = calcularEnvio(50000, "Funza");
comprobar(
  "justo en el umbral el envío es gratis",
  sobreUmbral.cubierto && sobreUmbral.costo === 0 && sobreUmbral.gratis
);

const sinCobertura = calcularEnvio(200000, "Leticia");
comprobar(
  "una ciudad sin cobertura no queda cubierta ni siquiera con pedido grande",
  !sinCobertura.cubierto
);

// El agujero original: el sitio prometía envío gratis desde $50.000 pero no
// cobraba nada nunca. Esto confirma que un pedido pequeño ya suma costo.
const totalPequeño = 8000 + (calcularEnvio(8000, "Bogotá") as { costo: number }).costo;
comprobar(
  "un pedido de 8000 a Bogotá ya no sale con envío gratis",
  totalPequeño > 8000,
  `total ${formatearCOP(totalPequeño)}`
);

// ─── Firma de integridad ───────────────────────────────────────────────────
seccion("Firma de integridad (cobro)");

const SECRETO_INTEGRIDAD_PRUEBA = "test_integrity_secreto_de_prueba";
const secretoIntegridadOriginal = process.env.WOMPI_INTEGRITY_SECRET;
process.env.WOMPI_INTEGRITY_SECRET = SECRETO_INTEGRIDAD_PRUEBA;

const firma = generarFirmaIntegridad({
  referencia: "pedido-abc",
  montoEnCentavos: 614400,
});
const esperada = crypto
  .createHash("sha256")
  .update(`pedido-abc614400COP${SECRETO_INTEGRIDAD_PRUEBA}`)
  .digest("hex");

comprobar("la firma coincide con el algoritmo documentado por Wompi", firma === esperada);
comprobar(
  "cambiar el monto cambia la firma",
  generarFirmaIntegridad({ referencia: "pedido-abc", montoEnCentavos: 100 }) !== firma
);
comprobar(
  "cambiar la referencia cambia la firma",
  generarFirmaIntegridad({ referencia: "otro", montoEnCentavos: 614400 }) !== firma
);

process.env.WOMPI_INTEGRITY_SECRET = secretoIntegridadOriginal;

// ─── Firma de eventos (webhook) ────────────────────────────────────────────
seccion("Firma de eventos (webhook)");

const SECRETO_EVENTOS_PRUEBA = "test_events_secreto_de_prueba";
const secretoEventosOriginal = process.env.WOMPI_EVENTS_SECRET;
process.env.WOMPI_EVENTS_SECRET = SECRETO_EVENTOS_PRUEBA;

function armarEvento(opciones: {
  id?: string;
  status?: string;
  montoCentavos?: number;
  timestamp?: number;
  checksumRoto?: boolean;
}) {
  const id = opciones.id ?? "trx-123";
  const status = opciones.status ?? "APPROVED";
  const monto = opciones.montoCentavos ?? 614400;
  const timestamp = opciones.timestamp ?? Math.floor(Date.now() / 1000);

  const propiedades = [
    "transaction.id",
    "transaction.status",
    "transaction.amount_in_cents",
  ];
  const cadena = `${id}${status}${monto}${timestamp}${SECRETO_EVENTOS_PRUEBA}`;
  const checksum = crypto.createHash("sha256").update(cadena).digest("hex");

  return {
    data: {
      transaction: {
        id,
        status,
        amount_in_cents: monto,
        currency: "COP",
        reference: "pedido-abc",
      },
    },
    timestamp,
    signature: {
      properties: propiedades,
      checksum: opciones.checksumRoto ? checksum.replace(/.$/, "0") : checksum,
    },
  };
}

comprobar("un evento legítimo se acepta", verificarFirmaEvento(armarEvento({})));
comprobar(
  "un checksum alterado se rechaza",
  !verificarFirmaEvento(armarEvento({ checksumRoto: true }))
);
comprobar(
  "un evento con el monto cambiado después de firmar se rechaza",
  !verificarFirmaEvento({
    ...armarEvento({}),
    data: {
      transaction: {
        id: "trx-123",
        status: "APPROVED",
        amount_in_cents: 100,
        currency: "COP",
        reference: "pedido-abc",
      },
    },
  })
);
comprobar(
  "un evento viejo se rechaza (protección de reenvío)",
  !verificarFirmaEvento(
    armarEvento({ timestamp: Math.floor(Date.now() / 1000) - 60 * 60 })
  )
);
comprobar(
  "un evento reciente pero no instantáneo se acepta",
  verificarFirmaEvento(armarEvento({ timestamp: Math.floor(Date.now() / 1000) - 120 }))
);

process.env.WOMPI_EVENTS_SECRET = secretoEventosOriginal;

// ─── Límite de intentos ────────────────────────────────────────────────────
seccion("Límite de intentos");

reiniciar("prueba");
const intentos = Array.from({ length: 6 }, () => consumir("prueba", 5, 60));
comprobar("los primeros 5 intentos pasan", intentos.slice(0, 5).every((r) => r.permitido));
comprobar("el sexto se bloquea", !intentos[5].permitido);
reiniciar("prueba");
comprobar("reiniciar limpia el contador", consumir("prueba", 5, 60).permitido);

// ─── Resultado ─────────────────────────────────────────────────────────────
console.log(`\n${pasadas} comprobaciones pasaron, ${fallos} fallaron.`);
if (fallos > 0) process.exit(1);
