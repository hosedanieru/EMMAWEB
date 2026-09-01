import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DetalleProducto from "./_components/DetalleProducto";

export default async function ProductoDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const producto = await prisma.producto.findUnique({
    where: { slug },
    include: {
      categoria: true,
      presentaciones: {
        where: { activo: true },
        orderBy: [{ unidadesPorPaquete: "asc" }, { cantidad: "asc" }],
      },
    },
  });

  if (!producto || !producto.activo) {
    notFound();
  }

  // Los Decimal de Prisma no son serializables hacia un Client Component:
  // se convierten a number acá, en el límite servidor→cliente.
  const productoSerializado = {
    ...producto,
    presentaciones: producto.presentaciones.map((p) => ({
      ...p,
      cantidad: Number(p.cantidad),
      precio: Number(p.precio),
    })),
  };

  return <DetalleProducto producto={productoSerializado} />;
}