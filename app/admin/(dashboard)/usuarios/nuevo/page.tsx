import { auth } from "@/auth";
import { tienePermiso, AccesoDenegado } from "../_lib/acceso";
import FormularioCrearUsuario from "../_components/FormularioCrearUsuario";

export default async function NuevoUsuarioPage() {
  const session = await auth();
  if (!tienePermiso(session?.user?.role)) {
    return <AccesoDenegado />;
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-lg font-semibold text-brand-green">Nuevo usuario</h1>
      <div className="max-w-md">
        <FormularioCrearUsuario />
      </div>
    </div>
  );
}
