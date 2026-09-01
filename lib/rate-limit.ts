// Límite de intentos por ventana de tiempo.
//
// Cubre dos agujeros que estaban abiertos:
//
//   - /admin/login aceptaba intentos ilimitados de contraseña. bcrypt impone
//     un techo natural de unos pocos por segundo, pero eso no detiene un
//     ataque paciente y además cada intento fallido gasta CPU del servidor,
//     así que el mismo endpoint servía para tumbar el sitio.
//   - /api/pedidos es público y sin autenticar (como debe ser en una compra
//     sin registro), y el campo trampa solo detiene bots que rellenan
//     formularios — no a un script que hable directo con la API.
//
// LIMITACIÓN IMPORTANTE: el contador vive en memoria del proceso. Si algún día
// el sitio corre en más de una instancia, cada una lleva su propia cuenta y el
// límite efectivo se multiplica por el número de instancias. Para el tamaño
// actual (una instancia) alcanza y no agrega infraestructura. Si se escala
// horizontalmente, esto se reemplaza por Redis o por una tabla en Postgres
// sin tocar a quien lo llama: la firma de `consumir` se mantiene.

type Registro = { conteo: number; expiraEn: number };

const registros = new Map<string, Registro>();

// Sin esto el Map crece sin límite: cada IP nueva deja una entrada para
// siempre. Se limpia de forma perezosa, aprovechando las llamadas que ya
// están ocurriendo, para no dejar un setInterval colgado en el proceso.
let ultimaLimpieza = Date.now();
const INTERVALO_LIMPIEZA_MS = 5 * 60 * 1000;

function limpiarSiHaceFalta(ahora: number) {
  if (ahora - ultimaLimpieza < INTERVALO_LIMPIEZA_MS) return;
  ultimaLimpieza = ahora;
  for (const [clave, registro] of registros) {
    if (registro.expiraEn <= ahora) registros.delete(clave);
  }
}

export type ResultadoLimite = {
  permitido: boolean;
  restantes: number;
  /** Segundos que faltan para que la ventana se reinicie. */
  reintentarEn: number;
};

/**
 * Registra un intento contra `clave` y dice si se pasó del límite.
 *
 * La ventana es fija, no deslizante: al primer intento se abre una ventana de
 * `ventanaSegundos` y al vencer se reinicia el conteo. Es menos preciso que
 * una ventana deslizante en el borde, pero cuesta una entrada por clave en vez
 * de una lista de marcas de tiempo, y para frenar fuerza bruta la diferencia
 * no importa.
 */
export function consumir(
  clave: string,
  limite: number,
  ventanaSegundos: number
): ResultadoLimite {
  const ahora = Date.now();
  limpiarSiHaceFalta(ahora);

  const registro = registros.get(clave);

  if (!registro || registro.expiraEn <= ahora) {
    registros.set(clave, { conteo: 1, expiraEn: ahora + ventanaSegundos * 1000 });
    return { permitido: true, restantes: limite - 1, reintentarEn: ventanaSegundos };
  }

  registro.conteo += 1;
  const reintentarEn = Math.ceil((registro.expiraEn - ahora) / 1000);

  return {
    permitido: registro.conteo <= limite,
    restantes: Math.max(0, limite - registro.conteo),
    reintentarEn,
  };
}

/** Borra el contador de una clave. Se usa tras un login exitoso. */
export function reiniciar(clave: string) {
  registros.delete(clave);
}

/**
 * IP del cliente a partir de las cabeceras del proxy.
 *
 * En producción el sitio va detrás de un proxy o CDN, así que la IP real llega
 * en x-forwarded-for (el primer valor de la lista: los siguientes son los
 * proxies intermedios y los puede falsificar el cliente). Si no hay ninguna
 * cabecera se devuelve "desconocida", que hace que todos esos casos compartan
 * un mismo contador — conservador a propósito: preferimos limitar de más a
 * dejar un hueco por el que se cuele todo.
 */
export function ipDePeticion(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip")?.trim() || "desconocida";
}
