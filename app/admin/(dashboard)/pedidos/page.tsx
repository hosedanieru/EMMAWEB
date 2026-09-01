import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { formatearCOP } from "@/lib/dinero";
import { tienePermiso, AccesoDenegado } from "./_lib/acceso";

// Todo pedido nace ya aprobado (ver app/api/pedidos/route.ts) — así que la
// lista que de verdad importa revisar acá no es "pendientes de revisión",
// sino los que todavía no han completado el pago: son los que se pueden
// seguir a mano (reenviarles el link) o cancelar si quedaron abandonados.
export default async function PedidosPorPagarPage() {
  const session = await auth();
  if (!tienePermiso(session?.user?.role)) {
    return <AccesoDenegado />;
  }

  // Los dos se piden juntos para no encadenar viajes a la base.
  const [pedidos, enRevision] = await Promise.all([
    prisma.pedido.findMany({
      where: { estado: "APROBADO", pagadoEn: null },
      include: { items: true },
      orderBy: { createdAt: "asc" },
    }),
    // Sobreventa, pago sobre pedido cancelado o monto que no cuadra. Se
    // muestran arriba de todo y sin filtrar por estado, porque son los que
    // cuestan plata si nadie los mira.
    prisma.pedido.findMany({
      where: { requiereRevision: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-brand-green">
          Pedidos por pagar
        </h1>
        <Link
          href="/admin/pedidos/aprobados"
          className="text-sm text-brand-muted hover:text-brand-green hover:underline"
        >
          Ver pedidos pagados →
        </Link>
      </div>

      {enRevision.length > 0 && (
        <div className="mb-8 rounded-brand border-l-4 border-red-600 bg-red-50 p-4">
          <p className="mb-2 font-semibold text-red-800">
            {enRevision.length} pedido(s) necesitan revisión
          </p>
          <ul className="space-y-1.5">
            {enRevision.map((pedido) => (
              <li key={pedido.id}>
                <Link
                  href={`/admin/pedidos/${pedido.id}`}
                  className="text-sm text-red-700 underline underline-offset-2 hover:text-red-900"
                >
                  #{pedido.id.slice(-8).toUpperCase()} · {pedido.nombreCliente} ·{" "}
                  {formatearCOP(Number(pedido.total))}
                </Link>
                <p className="text-xs text-red-700/80">{pedido.motivoRevision}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {pedidos.length === 0 ? (
        <p className="text-brand-muted">No hay pedidos esperando pago.</p>
      ) : (
        <div className="divide-y divide-brand-line-2 rounded-brand border border-brand-line-2 bg-white">
          {pedidos.map((pedido) => (
            <Link
              key={pedido.id}
              href={`/admin/pedidos/${pedido.id}`}
              className="flex items-center justify-between px-4 py-3 transition-colors duration-200 hover:bg-brand-paper-2"
            >
              <div>
                <p className="font-medium text-brand-ink">{pedido.nombreCliente}</p>
                <p className="text-sm text-brand-muted">
                  {pedido.ciudad} · {pedido.items.length} producto(s) ·{" "}
                  {pedido.createdAt.toLocaleDateString("es-CO")}
                </p>
              </div>
              <p className="font-medium text-brand-ink">
                {formatearCOP(Number(pedido.total))}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
