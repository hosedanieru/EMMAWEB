import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

// Crea (o actualiza) un usuario ADMIN desde la consola.
//
//   npm run crear-admin -- --email ana@empresa.com --password "MiClave123" --nombre "Ana"
//
// Existe porque el panel exige estar logueado para crear usuarios, así que el
// PRIMER administrador no se puede crear desde la interfaz: hay que meterlo a
// la base a mano. Después de ese, los demás se crean desde /admin/usuarios.
//
// También sirve para recuperar el acceso si alguien pierde la contraseña: al
// correr con un correo que ya existe, le cambia la clave y lo asciende a
// ADMIN en vez de fallar.
//
// Antes este archivo tenía el correo y la contraseña escritos en el código.
// Eso significaba que la clave quedaba en el repositorio y en cualquier copia
// del proyecto que se compartiera, y que todo el que lo ejecutara sin editarlo
// creaba un admin con una clave conocida.

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Lee --clave valor. Cae a la variable de entorno correspondiente, útil para
// servidores donde no conviene dejar la clave en el historial del shell.
function leerArgumento(nombre: string, variableEntorno: string) {
  const indice = process.argv.indexOf(`--${nombre}`);
  if (indice !== -1 && process.argv[indice + 1]) {
    return process.argv[indice + 1];
  }
  return process.env[variableEntorno];
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "Falta DATABASE_URL en el .env — sin eso no hay a qué base conectarse."
    );
  }

  const email = leerArgumento("email", "ADMIN_EMAIL")?.trim().toLowerCase();
  const password = leerArgumento("password", "ADMIN_PASSWORD");
  const nombre = leerArgumento("nombre", "ADMIN_NAME")?.trim() || "Administrador";

  if (!email || !password) {
    throw new Error(
      [
        "Faltan datos. Uso:",
        "",
        '  npm run crear-admin -- --email ana@empresa.com --password "MiClave123" --nombre "Ana"',
        "",
        "También puedes usar las variables ADMIN_EMAIL, ADMIN_PASSWORD y ADMIN_NAME.",
      ].join("\n")
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error(`"${email}" no parece un correo válido.`);
  }

  // 8 caracteres es el mínimo razonable para una cuenta que administra
  // pedidos, precios e inventario.
  if (password.length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres.");
  }

  const passwordHasheado = await bcrypt.hash(password, 10);

  // upsert y no create: si el correo ya existe, create fallaría con un error
  // de restricción única de Postgres bastante ilegible. Así la orden es
  // idempotente y sirve además para resetear la clave.
  const existente = await prisma.user.findUnique({ where: { email } });

  const admin = await prisma.user.upsert({
    where: { email },
    update: { password: passwordHasheado, role: "ADMIN", name: nombre },
    create: { name: nombre, email, password: passwordHasheado, role: "ADMIN" },
  });

  if (existente) {
    console.log(`Usuario actualizado: ${admin.email} (rol ADMIN, contraseña nueva)`);
  } else {
    console.log(`Usuario admin creado: ${admin.email}`);
  }
  console.log("Ya puedes entrar en /admin/login");
}

main()
  .catch((e) => {
    console.error(`\n${e instanceof Error ? e.message : e}\n`);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
