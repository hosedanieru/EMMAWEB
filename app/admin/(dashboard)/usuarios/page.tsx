import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { tienePermiso, AccesoDenegado } from "./_lib/acceso";
import EliminarUsuarioBoton from "./_components/EliminarUsuarioBoton";

export default async function UsuariosPage() {
  const session = await auth();
  if (!tienePermiso(session?.user?.role)) {
    return <AccesoDenegado />;
  }

  const usuarios = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-brand-green">Usuarios</h1>
        <Link href="/admin/usuarios/nuevo" className="btn btn-primary">
          + Nuevo usuario
        </Link>
      </div>

      <div className="divide-y divide-brand-line-2 rounded-brand border border-brand-line-2 bg-white">
        {usuarios.map((usuario) => (
          <div key={usuario.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium text-brand-ink">
                {usuario.name}
                {usuario.id === session?.user?.id && (
                  <span className="ml-2 text-xs font-normal text-brand-muted">(vos)</span>
                )}
              </p>
              <p className="text-sm text-brand-muted">
                {usuario.email} · {usuario.role}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/admin/usuarios/${usuario.id}/editar`}
                className="text-sm text-brand-green-2 hover:text-brand-green hover:underline"
              >
                Editar
              </Link>
              {usuario.id !== session?.user?.id && <EliminarUsuarioBoton id={usuario.id} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
