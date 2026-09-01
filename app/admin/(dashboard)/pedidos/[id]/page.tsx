import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { generarUrlPago } from "@/lib/wompi";
import { aCentavos, formatearCOP } from "@/lib/dinero";
import { tienePermiso, AccesoDenegado } from "../_lib/acceso";
import AccionesPedido from "./_components/AccionesPedido";
import LinkPago from "./_components/LinkPago";

export default async function DetallePedidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!tienePermiso(session?.user?.role)) {
    return <AccesoDenegado />;
  }

  const { id } = await params;

  const pedido = await prisma.pedido.findUnique({
    where: { id },
    include: {
      items: {
        include: { presentacion: true },
      },
    },
  });

  if (!pedido) {
    notFound();
  }

  const numeroPedido = pedido.id.slice(-8).toUpperCase();

  // El link se reconstruye acá, del lado del servidor, que es donde vive el
  // secreto de integridad. Solo tiene sentido mientras el pedido siga
  // esperando pago.
  const origen = process.env.APP_URL?.trim().replace(/\/$/, "") ?? "";
  const linkPago =
    !pedido.pagadoEn && pedido.estado === "APROBADO" && pedido.referencia
      ? generarUrlPago({
          referencia: pedido.referencia,
          montoEnCentavos: aCentavos(Number(pedido.total)),
          correoCliente: pedido.correoCliente,
          redirectUrl: origen ? `${origen}/pedido-recibido/${pedido.id}` : undefined,
        })
      : null;

  return (
    <div className="p-6">
      <Link href="/admin/pedidos" className="text-sm text-brand-muted hover:text-brand-green hover:underline">
        ← Volver a pedidos
      </Link>

      <h1 className="mb-6 mt-2 text-lg font-semibold text-brand-green">
        Pedido de {pedido.nombreCliente}{" "}
        <span className="font-mono text-sm font-normal text-brand-muted">
          #{numeroPedido}
        </span>
      </h1>

      {/* Sobreventa, pago sobre un pedido cancelado, o monto que no cuadra.
          Antes esto solo existía en el log del servidor. */}
      {pedido.requiereRevision && (
        <div className="mb-6 rounded-brand border-l-4 border-red-600 bg-red-50 p-4">
          <p className="font-semibold text-red-800">Este pedido necesita revisión</p>
          <p className="mt-1 text-sm text-red-700">{pedido.motivoRevision}</p>
        </div>
      )}

      <section className="mb-8 grid grid-cols-1 gap-4 rounded-brand border border-brand-line-2 bg-white p-4 sm:grid-cols-2">
        <div>
          <p className="text-sm text-brand-muted">Correo</p>
          <p className="text-brand-ink">{pedido.correoCliente}</p>
        </div>
        <div>
          <p className="text-sm text-brand-muted">Teléfono</p>
          <p className="text-brand-ink">{pedido.telefonoCliente}</p>
        </div>
        <div>
          <p className="text-sm text-brand-muted">Dirección</p>
          <p className="text-brand-ink">{pedido.direccion}</p>
        </div>
        <div>
          <p className="text-sm text-brand-muted">Ciudad</p>
          <p className="text-brand-ink">{pedido.ciudad}</p>
        </div>
        <div>
          <p className="text-sm text-brand-muted">Estado</p>
          <p className="text-brand-ink">{pedido.estado}</p>
        </div>
        <div>
          <p className="text-sm text-brand-muted">Fecha</p>
          <p className="text-brand-ink">
            {pedido.createdAt.toLocaleDateString("es-CO")}
          </p>
        </div>
        <div>
          <p className="text-sm text-brand-muted">Autorización de datos</p>
          <p className="text-brand-ink">
            {pedido.autorizaDatosEn
              ? pedido.autorizaDatosEn.toLocaleString("es-CO")
              : "—"}
          </p>
        </div>
      </section>

      <h2 className="mb-3 text-base font-medium text-brand-green">Productos</h2>
      <div className="divide-y divide-brand-line-2 rounded-brand border border-brand-line-2 bg-white">
        {pedido.items.map((item) => {
          const stockDisponible = item.presentacion.stock;
          const faltaStock = item.cantidad > stockDisponible;

          return (
            <div
              key={item.id}
              className={`flex items-center justify-between px-4 py-3 ${
                faltaStock ? "bg-red-50" : ""
              }`}
            >
              <div>
                <p className="font-medium text-brand-ink">{item.nombreProducto}</p>
                <p className="text-sm text-brand-muted">
                  {item.etiqueta} × {item.cantidad}
                </p>
                <p className="text-sm text-brand-muted">
                  Stock disponible: {stockDisponible}
                </p>
                {faltaStock && (
                  <p className="text-sm font-medium text-red-600">
                    Stock insuficiente
                  </p>
                )}
              </div>
              <p className="font-medium text-brand-ink">
                {formatearCOP(Number(item.precioUnitario))} c/u
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col items-end gap-1 text-sm">
        <div className="flex w-56 justify-between">
          <span className="text-brand-muted">Subtotal</span>
          <span className="text-brand-ink">
            {formatearCOP(Number(pedido.subtotal))}
          </span>
        </div>
        <div className="flex w-56 justify-between">
          <span className="text-brand-muted">Envío</span>
          <span className="text-brand-ink">
            {Number(pedido.costoEnvio) === 0
              ? "Gratis"
              : formatearCOP(Number(pedido.costoEnvio))}
          </span>
        </div>
        <div className="mt-1 flex w-56 justify-between border-t border-brand-line-2 pt-2">
          <span className="font-medium text-brand-green">Total</span>
          <span className="text-xl font-medium text-brand-green">
            {formatearCOP(Number(pedido.total))}
          </span>
        </div>
      </div>

      {/* La información de pago se muestra siempre que exista, sin importar el
          estado. Antes estaba envuelta en `estado === "APROBADO"`, así que un
          pedido cancelado que el cliente pagara igual ocultaba por completo la
          transacción: había dinero cobrado y en pantalla no aparecía nada. */}
      <section className="mt-8 rounded-brand border border-brand-line-2 bg-white p-4">
        <h2 className="mb-3 text-base font-medium text-brand-green">
          Información de pago
        </h2>

        {pedido.pagadoEn ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-brand-muted">Estado</p>
              <p className="font-medium text-green-700">Pagado</p>
            </div>
            <div>
              <p className="text-sm text-brand-muted">Fecha de pago</p>
              <p className="text-brand-ink">
                {pedido.pagadoEn.toLocaleString("es-CO")}
              </p>
            </div>
            <div>
              <p className="text-sm text-brand-muted">Método de pago</p>
              <p className="text-brand-ink">{pedido.metodoPago ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-brand-muted">ID de transacción Wompi</p>
              <p className="break-all text-brand-ink">
                {pedido.wompiTransactionId ?? "—"}
              </p>
            </div>
            {pedido.datosPago !== null && (
              <details className="sm:col-span-2">
                <summary className="cursor-pointer text-sm text-brand-muted hover:text-brand-green">
                  Datos completos de la transacción (para facturación)
                </summary>
                <pre className="mt-2 overflow-x-auto rounded-lg bg-brand-paper-2 p-3 text-xs text-brand-ink">
                  {JSON.stringify(pedido.datosPago, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ) : pedido.estado === "RECHAZADO" ? (
          <p className="text-sm text-brand-muted">
            Pedido cancelado antes de pagarse. No se cobró nada y no se descontó
            inventario.
          </p>
        ) : (
          <>
            <p className="text-sm text-brand-muted">
              Este pedido todavía no ha sido pagado. El cliente fue redirigido a
              pagar al confirmarlo
              {linkPago
                ? ", y desde acá se le puede reenviar el link."
                : ". No hay credenciales de Wompi configuradas, así que el pago se coordina a mano."}
            </p>
            {linkPago && (
              <LinkPago
                link={linkPago}
                telefonoCliente={pedido.telefonoCliente}
                nombreCliente={pedido.nombreCliente}
                numeroPedido={numeroPedido}
              />
            )}
          </>
        )}
      </section>

      {pedido.estado === "APROBADO" && !pedido.pagadoEn && (
        <AccionesPedido pedidoId={pedido.id} />
      )}
    </div>
  );
}
