import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { formatearCOP } from "@/lib/dinero";
import { tienePermiso, AccesoDenegado } from "../_lib/acceso";

// Pedidos con pago ya confirmado por el webhook de Wompi — listos para
// despachar. (Los que todavía no han pagado viven en /admin/pedidos.)
export default async function PedidosPagadosPage() {
  const session = await auth();
  if (!tienePermiso(session?.user?.role)) {
    return <AccesoDenegado />;
  }

  const pedidos = await prisma.pedido.findMany({
    where: { pagadoEn: { not: null } },
    orderBy: { pagadoEn: "desc" },
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-brand-green">Pedidos pagados</h1>
        <Link
          href="/admin/pedidos"
          className="text-sm text-brand-muted hover:text-brand-green hover:underline"
        >
          ← Ver pedidos por pagar
        </Link>
      </div>

      {pedidos.length === 0 ? (
        <p className="text-brand-muted">Todavía no hay pedidos pagados.</p>
      ) : (
        <div className="divide-y divide-brand-line-2 rounded-brand border border-brand-line-2 bg-white">
          {pedidos.map((pedido) => (
            <Link
              key={pedido.id}
              href={`/admin/pedidos/${pedido.id}`}
              className="flex items-center justify-between px-4 py-3 transition-colors duration-200 hover:bg-brand-paper-2"
            >
              <div>
                <p className="font-medium text-brand-ink">
                  {pedido.nombreCliente}
                  {pedido.requiereRevision && (
                    <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                      Revisar
                    </span>
                  )}
                </p>
                <p className="text-sm text-brand-muted">
                  {pedido.ciudad} ·{" "}
                  {pedido.pagadoEn?.toLocaleDateString("es-CO")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-brand-ink">
                  {formatearCOP(Number(pedido.total))}
                </p>
                <p className="text-sm font-medium text-green-700">Pagado</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
