import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { tienePermiso, AccesoDenegado } from "../../_lib/acceso";
import FormularioEditarUsuario from "../../_components/FormularioEditarUsuario";

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!tienePermiso(session?.user?.role)) {
    return <AccesoDenegado />;
  }

  const { id } = await params;
  const usuario = await prisma.user.findUnique({ where: { id } });

  if (!usuario) {
    notFound();
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-lg font-semibold text-brand-green">Editar {usuario.name}</h1>
      <div className="max-w-md">
        <FormularioEditarUsuario
          usuarioId={usuario.id}
          valoresIniciales={{ name: usuario.name, email: usuario.email, role: usuario.role }}
        />
      </div>
    </div>
  );
}
