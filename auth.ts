import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { consumir, reiniciar, ipDePeticion } from "@/lib/rate-limit";

// Sin esto, quedarse sin intentos daba exactamente el mismo mensaje que una
// contraseña equivocada: "Correo o contraseña incorrectos". La persona seguía
// probando claves buenas sin entender por qué ninguna servía. Auth.js
// normaliza cualquier error de authorize a CredentialsSignin para no filtrar
// información, pero respeta el `code` de las subclases — que es justo lo que
// hace falta para distinguir estos dos casos sin revelar si el correo existe.
export class LimiteIntentosError extends CredentialsSignin {
  code = "limite_intentos";
}

// Hash de una contraseña que no le sirve a nadie. Existe para poder correr un
// bcrypt.compare cuando el correo NO existe: sin esto, la respuesta a un
// correo inexistente vuelve de inmediato y la de uno real tarda los ~100ms de
// bcrypt, y esa diferencia es medible desde afuera. Con el hash falso las dos
// ramas tardan lo mismo y no se puede averiguar qué correos están registrados.
const HASH_SEÑUELO = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

// Cada cuánto se vuelve a consultar el rol contra la base. El rol viaja en el
// JWT para no consultar en cada request, pero antes NUNCA se revalidaba: si a
// alguien se le quitaba el rol ADMIN —o se le borraba el usuario— su sesión
// abierta conservaba los permisos hasta que el token expirara. Con esto, un
// cambio de rol o una eliminación surten efecto en 5 minutos como máximo.
const REVALIDAR_CADA_MS = 5 * 60 * 1000;

// Intentos de login permitidos por ventana. Se cuenta por IP y por correo:
// la IP frena a quien prueba muchas contraseñas contra muchas cuentas, y el
// correo frena a quien reparte el ataque entre varias IPs contra una cuenta.
//
// El tope por IP es más alto que el de correo a propósito: en una oficina
// varias personas del equipo salen por la misma IP, y 5 en total entre todas
// dejaba a gente honesta afuera. El que de verdad protege una cuenta es el de
// correo, y ese sí es estricto.
const LIMITE_POR_IP = 20;
const LIMITE_POR_CORREO = 5;
const VENTANA_SEGUNDOS = 15 * 60;

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    // 8 horas: una jornada. El valor por defecto de Auth.js son 30 días, que
    // para un panel que maneja pedidos, precios e inventario es demasiado —
    // un equipo desatendido queda con la sesión viva por un mes.
    maxAge: 8 * 60 * 60,
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = (credentials.email as string).trim().toLowerCase();
        const ip = ipDePeticion(request.headers);

        // Si cualquiera de los dos contadores se pasó, no se consulta la base
        // ni se corre bcrypt: el intento se descarta antes de gastar nada.
        const porIp = consumir(`login:ip:${ip}`, LIMITE_POR_IP, VENTANA_SEGUNDOS);
        const porCorreo = consumir(
          `login:correo:${email}`,
          LIMITE_POR_CORREO,
          VENTANA_SEGUNDOS
        );
        if (!porIp.permitido || !porCorreo.permitido) {
          throw new LimiteIntentosError();
        }

        const user = await prisma.user.findUnique({ where: { email } });

        // Ver HASH_SEÑUELO: la rama del usuario inexistente también paga el
        // costo de bcrypt para que las dos tarden igual.
        const passwordValida = user
          ? await bcrypt.compare(credentials.password as string, user.password)
          : await bcrypt
              .compare(credentials.password as string, HASH_SEÑUELO)
              .then(() => false);

        if (!user || !passwordValida) {
          return null;
        }

        // Login correcto: se limpian los contadores para que a quien sí sabe
        // su contraseña no lo penalicen los intentos fallidos previos.
        reiniciar(`login:ip:${ip}`);
        reiniciar(`login:correo:${email}`);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Al momento del login, "user" viene del authorize() de arriba.
      if (user) {
        token.role = user.role;
        token.revalidadoEn = Date.now();
        return token;
      }

      // En los requests siguientes se revalida cada tanto contra la base.
      const ultima = typeof token.revalidadoEn === "number" ? token.revalidadoEn : 0;
      if (Date.now() - ultima < REVALIDAR_CADA_MS) {
        return token;
      }

      if (!token.sub) return null;

      const actual = await prisma.user.findUnique({
        where: { id: token.sub },
        select: { role: true },
      });

      // Devolver null destruye la sesión: es lo que hace que eliminar un
      // usuario lo saque del panel de verdad, y no solo en apariencia.
      if (!actual) return null;

      token.role = actual.role;
      token.revalidadoEn = Date.now();
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        // token.sub es el id del usuario (lo asigna Auth.js automáticamente
        // a partir del id devuelto por authorize()). Se necesita en la sesión
        // para poder comparar "¿esta acción la estoy haciendo sobre mí mismo?".
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
});
