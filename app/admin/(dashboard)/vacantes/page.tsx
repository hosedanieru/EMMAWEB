import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { tienePermiso, AccesoDenegado } from "./_lib/acceso";
import { ETIQUETAS_TIPO_CONTRATO } from "./_components/schema";
import CambiarEstadoBoton from "./_components/CambiarEstadoBoton";

export default async function VacantesPage() {
  const session = await auth();
  if (!tienePermiso(session?.user?.role)) {
    return <AccesoDenegado />;
  }

  const vacantes = await prisma.vacante.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-brand-green">Vacantes</h1>
        <Link href="/admin/vacantes/nueva" className="btn btn-primary">
          + Nueva vacante
        </Link>
      </div>

      {vacantes.length === 0 ? (
        <p className="text-brand-muted">Todavía no hay vacantes publicadas.</p>
      ) : (
        <div className="divide-y divide-brand-line-2 rounded-brand border border-brand-line-2 bg-white">
          {vacantes.map((vacante) => (
            <div key={vacante.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-medium text-brand-ink">
                  {vacante.titulo}
                  {!vacante.activa && (
                    <span className="ml-2 text-xs font-normal text-brand-muted">(inactiva)</span>
                  )}
                </p>
                <p className="text-sm text-brand-muted">
                  {vacante.area} · {vacante.ubicacion} · {ETIQUETAS_TIPO_CONTRATO[vacante.tipo]}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/vacantes/${vacante.id}/editar`}
                  className="text-sm text-brand-green-2 hover:text-brand-green hover:underline"
                >
                  Editar
                </Link>
                <CambiarEstadoBoton vacanteId={vacante.id} activa={vacante.activa} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
