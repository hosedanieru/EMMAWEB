import { prisma } from "@/lib/prisma";
import ProductoCard from "./_components/ProductoCard";

export default async function ProductosPage() {
  const productos = await prisma.producto.findMany({
    where: { activo: true },
    include: { categoria: true },
    orderBy: { nombre: "asc" },
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="mb-12 text-center">Nuestros Productos</h1>

      {productos.length === 0 ? (
        <p className="text-center text-neutral-500">
          Aún no hay productos disponibles.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </main>
  );
}