import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { tienePermiso, AccesoDenegado } from "../../_lib/acceso";
import FormularioVacante from "../../_components/FormularioVacante";
import { actualizarVacante } from "../../../_actions/vacantes-actions";
import type { VacanteFormValues } from "../../_components/schema";

export default async function EditarVacantePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!tienePermiso(session?.user?.role)) {
    return <AccesoDenegado />;
  }

  const { id } = await params;

  const vacante = await prisma.vacante.findUnique({ where: { id } });

  if (!vacante) {
    notFound();
  }

  const valoresIniciales: VacanteFormValues = {
    titulo: vacante.titulo,
    area: vacante.area,
    ubicacion: vacante.ubicacion,
    tipo: vacante.tipo,
    descripcion: vacante.descripcion,
    activa: vacante.activa,
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-lg font-semibold text-brand-green">Editar {vacante.titulo}</h1>
      <div className="max-w-2xl">
        <FormularioVacante
          valoresIniciales={valoresIniciales}
          onSubmit={actualizarVacante.bind(null, vacante.id)}
        />
      </div>
    </div>
  );
}
