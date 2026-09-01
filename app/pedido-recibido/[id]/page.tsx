import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PedidoRecibidoContenido from "./_components/PedidoRecibidoContenido";

// El comprobante muestra el nombre del cliente y el estado de su pago: no
// debe quedar indexado ni aparecer como referencia al salir del sitio.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PedidoRecibidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const pedido = await prisma.pedido.findUnique({
    where: { id },
    select: { id: true, nombreCliente: true, createdAt: true, pagadoEn: true },
  });

  if (!pedido) {
    notFound();
  }

  const numeroPedido = pedido.id.slice(-8).toUpperCase();

  return (
    <PedidoRecibidoContenido
      primerNombre={pedido.nombreCliente.split(" ")[0]}
      numeroPedido={numeroPedido}
      pagado={pedido.pagadoEn !== null}
    />
  );
}
