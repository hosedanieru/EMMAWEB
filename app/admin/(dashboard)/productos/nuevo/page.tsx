import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { tienePermiso, AccesoDenegado } from "../_lib/acceso";
import FormularioProducto from "../_components/FormularioProducto";
import { crearProducto } from "../../_actions/actions";

export default async function NuevoProductoPage() {
  const session = await auth();
  if (!tienePermiso(session?.user?.role)) {
    return <AccesoDenegado />;
  }

  const categorias = await prisma.categoria.findMany({ orderBy: { nombre: "asc" } });

  return (
    <div className="p-6">
      <h1 className="mb-6 text-lg font-semibold text-brand-green">Nuevo producto</h1>
      <div className="max-w-2xl">
        <FormularioProducto categorias={categorias} onSubmit={crearProducto} />
      </div>
    </div>
  );
}
