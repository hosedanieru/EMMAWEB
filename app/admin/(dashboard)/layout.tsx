import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/auth";

// Refuerza el disallow de robots.ts con una directiva que el buscador no
// puede ignorar: robots.txt pide no rastrear, esto prohíbe indexar.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // proxy.ts ya bloquea si no hay sesión; esto es una segunda capa de
  // defensa. El chequeo de qué ROL puede entrar a cada sección vive en
  // el layout de esa sección específica (productos, pedidos, etc.), no acá.
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-brand-paper">
      <header className="border-b border-brand-line-2 bg-white">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-6 px-6 py-4">
          <nav className="flex items-center gap-2 text-sm font-medium">
            {(session.user.role === "ADMIN" || session.user.role === "FACTURACION") && (
              <Link
                href="/admin/pedidos"
                className="rounded-full px-3 py-1.5 text-brand-ink transition-colors duration-200 hover:bg-brand-paper-2 hover:text-brand-green"
              >
                Pedidos
              </Link>
            )}
            {session.user.role === "ADMIN" && (
              <>
                <Link
                  href="/admin/productos"
                  className="rounded-full px-3 py-1.5 text-brand-ink transition-colors duration-200 hover:bg-brand-paper-2 hover:text-brand-green"
                >
                  Productos
                </Link>
                <Link
                  href="/admin/vacantes"
                  className="rounded-full px-3 py-1.5 text-brand-ink transition-colors duration-200 hover:bg-brand-paper-2 hover:text-brand-green"
                >
                  Vacantes
                </Link>
                <Link
                  href="/admin/usuarios"
                  className="rounded-full px-3 py-1.5 text-brand-ink transition-colors duration-200 hover:bg-brand-paper-2 hover:text-brand-green"
                >
                  Usuarios
                </Link>
              </>
            )}
          </nav>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="text-sm text-brand-muted transition-colors duration-200 hover:text-brand-ink"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      <div>{children}</div>
    </div>
  );
}