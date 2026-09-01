import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { tienePermiso, AccesoDenegado } from "./_lib/acceso";
import CambiarEstadoBoton from "./_components/CambiarEstadoBoton";

export default async function ProductosPage() {
  const session = await auth();
  if (!tienePermiso(session?.user?.role)) {
    return <AccesoDenegado />;
  }

  const productos = await prisma.producto.findMany({
    include: { categoria: true, presentaciones: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-brand-green">Productos</h1>
        <Link href="/admin/productos/nuevo" className="btn btn-primary">
          + Nuevo producto
        </Link>
      </div>

      {productos.length === 0 ? (
        <p className="text-brand-muted">Todavía no hay productos.</p>
      ) : (
        <div className="divide-y divide-brand-line-2 rounded-brand border border-brand-line-2 bg-white">
          {productos.map((producto) => (
            <div key={producto.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-medium text-brand-ink">
                  {producto.nombre}
                  {!producto.activo && (
                    <span className="ml-2 text-xs font-normal text-brand-muted">(inactivo)</span>
                  )}
                  {producto.destacado && (
                    <span className="ml-2 text-xs font-normal text-amber-600">★ destacado</span>
                  )}
                </p>
                <p className="text-sm text-brand-muted">
                  {producto.categoria.nombre} · {producto.presentaciones.length} presentación(es)
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/productos/${producto.id}/editar`}
                  className="text-sm text-brand-green-2 hover:text-brand-green hover:underline"
                >
                  Editar
                </Link>
                <CambiarEstadoBoton productoId={producto.id} activo={producto.activo} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
