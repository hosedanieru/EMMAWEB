"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import type { ProductoConPrecio } from "@/types/producto";

export default function ProductoCard({
  producto,
}: {
  producto: ProductoConPrecio;
}) {
  const { t } = useLocale();

  return (
    <Link
      href={`/productos/${producto.slug}`}
      className="group relative block rounded-brand border border-brand-line-2 bg-white px-[22px] pb-6 pt-[26px] text-center transition-[transform,box-shadow,border-color] duration-[.35s] ease-[cubic-bezier(.2,.7,.3,1)] hover:-translate-y-1.5 hover:border-brand-line hover:shadow-[0_26px_50px_-24px_rgba(20,40,20,.4)]"
    >
      <div className="relative h-[216px]">
        {producto.imagen ? (
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            fill
            sizes="(max-width: 640px) 45vw, 216px"
            className="object-contain object-bottom drop-shadow-[0_16px_20px_rgba(20,40,20,.2)] transition-transform duration-[.35s] ease-[cubic-bezier(.2,.7,.3,1)] group-hover:-translate-y-1.5 group-hover:scale-[1.04]"
          />
        ) : null}
      </div>

      <span className="mt-[18px] mb-1.5 block text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-brand-orange-d">
        {producto.categoria.nombre}
      </span>
      <h3 className="text-[1.18rem] font-semibold tracking-[-0.01em] text-brand-green">
        {producto.nombre}
      </h3>
      <p className="mt-[3px] text-[0.85rem] text-brand-muted">
        {producto.precioDesde !== null
          ? `${t.productos.desde} $${producto.precioDesde.toLocaleString("es-CO")}`
          : t.productos.consultarPrecio}
      </p>

      <div className="mt-[14px] flex items-center justify-center gap-[.35rem] border-t border-brand-line-2 pt-[14px] text-[0.86rem] font-semibold text-brand-orange-d">
        {t.productos.verYPedir}
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-[.35s] ease-[cubic-bezier(.2,.7,.3,1)] group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
