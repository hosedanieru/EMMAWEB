import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'npx tsx prisma/seed.ts',
  },
  datasource: {
    // Antes acá iba env('DATABASE_URL'), el ayudante de Prisma. El problema
    // es que env() aborta la carga del archivo de configuración ENTERO si la
    // variable no está, y eso tumbaba el despliegue en Netlify con un
    // "PrismaConfigEnvError: Cannot resolve environment variable" durante
    // `prisma generate`.
    //
    // Y generate no necesita ninguna base de datos: solo lee el schema para
    // escribir el cliente. Exigirle una cadena de conexión era un accidente
    // de tener el datasource acá, no un requisito real. En local no se notaba
    // porque el `import 'dotenv/config'` de arriba carga el .env, que sí la
    // tiene; en el servidor de build no hay .env que cargar.
    //
    // Con process.env, generate pasa sin DATABASE_URL y los comandos que sí
    // necesitan conexión —migrate, db— siguen fallando cuando falta, solo que
    // al intentar conectarse en vez de al abrir el archivo.
    url: process.env.DATABASE_URL ?? '',
  },
})
