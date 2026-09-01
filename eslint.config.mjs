import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Cliente de Prisma generado: no es código nuestro y no se edita a mano.
    // Sin esta línea, `npm run lint` devolvía 917 problemas —356 de ellos
    // errores— todos de archivos generados y del prototipo HTML, y los 2
    // avisos reales del código fuente quedaban enterrados. Un lint que nadie
    // puede leer es un lint que nadie corre.
    "generated/**",
    "app/generated/**",
    // Prototipo estático heredado, 3,5 MB en una sola línea minificada.
    "Emma_web_v2_minimalista_SEO.html",
  ]),
]);

export default eslintConfig;
