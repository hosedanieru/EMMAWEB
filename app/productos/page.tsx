import { prisma } from "@/lib/prisma";
import FiltroProductos from "./_components/FiltroProductos";

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const productos = await prisma.producto.findMany({
    where: { activo: true },
    include: {
      categoria: true,
      presentaciones: {
        where: { activo: true },
        orderBy: { precio: "asc" },
        take: 1,
      },
    },
    orderBy: { nombre: "asc" },
  });

  const productosConPrecio = productos.map((producto) => {
    const { presentaciones, ...resto } = producto;
    return {
      ...resto,
      precioDesde: presentaciones[0] ? Number(presentaciones[0].precio) : null,
    };
  });

  return (
    <main className="bg-brand-paper py-[118px]">
      <div className="mx-auto max-w-[1180px] px-7">
        <FiltroProductos productos={productosConPrecio} busquedaInicial={q ?? ""} />
      </div>
    </main>
  );
}
