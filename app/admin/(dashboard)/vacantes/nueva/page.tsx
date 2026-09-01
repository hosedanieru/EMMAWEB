import { tienePermiso, AccesoDenegado } from "../_lib/acceso";
import { auth } from "@/auth";
import FormularioVacante from "../_components/FormularioVacante";
import { crearVacante } from "../../_actions/vacantes-actions";

export default async function NuevaVacantePage() {
  const session = await auth();
  if (!tienePermiso(session?.user?.role)) {
    return <AccesoDenegado />;
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-lg font-semibold text-brand-green">Nueva vacante</h1>
      <div className="max-w-2xl">
        <FormularioVacante onSubmit={crearVacante} />
      </div>
    </div>
  );
}
