import type { NextConfig } from "next";

// Política de seguridad de contenido.
//
// Va en modo SOLO REPORTE a propósito. Next inyecta scripts y estilos en
// línea propios, y una CSP estricta activada de golpe puede romper páginas de
// forma silenciosa — justo lo que no se quiere el día del lanzamiento. En
// modo reporte el navegador no bloquea nada pero registra las violaciones en
// su consola: hay que abrir el sitio, recorrer el checkout completo y el
// panel, revisar qué se reporta, y recién entonces cambiar la cabecera a
// `Content-Security-Policy` a secas.
//
// Lo que sí se aplica desde ya es todo lo de la lista de abajo, que no rompe
// nada: el bloqueo de iframes, HSTS, y el resto.
const cspSoloReporte = [
  "default-src 'self'",
  // 'unsafe-inline' y 'unsafe-eval' son los que habría que quitar migrando a
  // nonces. Se dejan por ahora para que el reporte muestre problemas reales y
  // no un muro de ruido del propio framework.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  // Google Fonts: la hoja de estilos sale de fonts.googleapis.com y los
  // archivos de fuente de fonts.gstatic.com (ver app/layout.tsx).
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  // El checkout de Wompi se abre con una navegación de página completa, no
  // dentro de un iframe, así que no hace falta permitirlo como frame-src.
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const cabecerasSeguridad = [
  // Clickjacking. Es la que más pesa acá: sin ella el panel se puede embeber
  // en un sitio ajeno y a alguien con sesión abierta se le puede inducir un
  // clic en "Cancelar pedido" sin que se dé cuenta.
  { key: "X-Frame-Options", value: "DENY" },

  // Obliga HTTPS en las visitas siguientes. Los navegadores la ignoran sobre
  // HTTP, así que mandarla siempre es inocuo. Sin `preload` a propósito:
  // entrar a la lista de precarga es difícil de revertir y conviene esperar a
  // que el dominio lleve un tiempo estable en HTTPS.
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },

  // Evita que el navegador adivine el tipo de un archivo y lo ejecute como
  // algo que no es.
  { key: "X-Content-Type-Options", value: "nosniff" },

  // No filtrar la ruta completa al salir del sitio — incluye la del
  // comprobante, que lleva el id del pedido.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

  // El sitio no usa ninguna de estas.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },

  { key: "Content-Security-Policy-Report-Only", value: cspSoloReporte },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: cabecerasSeguridad }];
  },

  // /trabaja-con-nosotros se fusionó dentro de /contacto: las dos páginas
  // resolvían lo mismo (hablar con la empresa). El redirect es permanente
  // (308) para que los buscadores trasladen el posicionamiento en vez de
  // dejar la URL vieja indexada apuntando a un 404.
  async redirects() {
    return [
      {
        source: "/trabaja-con-nosotros",
        destination: "/contacto#trabaja",
        permanent: true,
      },
    ];
  },

  // El `experimental.serverActions.bodySizeLimit: "6mb"` que estaba acá se
  // quitó: se había puesto para el adjunto de hoja de vida del formulario de
  // contacto, que ya no existe (hoy la postulación va por WhatsApp). Sin ese
  // formulario, lo único que hacía era subirle el tamaño máximo de cuerpo a
  // TODAS las Server Actions sin que nadie lo necesitara.
};

export default nextConfig;
