import Link from "next/link";
import type { ProductoWithCategoria } from "@/types/producto";

export default function ProductoCard({
  producto,
}: {
  producto: ProductoWithCategoria;
}) {
  return (
    <Link
      href={`/productos/${producto.slug}`}
      className="group block overflow-hidden rounded-lg border border-neutral-200 transition hover:shadow-lg"
    >
      {/* Espacio de imagen — placeholder limpio, se reemplaza cuando haya imagen real */}
      <div className="aspect-square w-full bg-neutral-100" />

      <div className="p-4">
        <span className="text-xs uppercase tracking-wide text-neutral-400">
          {producto.categoria.nombre}
        </span>
        <h3 className="mt-1 text-lg">{producto.nombre}</h3>

        {/* Espacio de precio — placeholder, formato real pendiente de definir */}
        <div className="mt-2 h-6 w-20 rounded bg-neutral-100" />
      </div>
    </Link>
  );
}