"use client";

import Link from "next/link";
import ProductoCard from "@/app/productos/_components/ProductoCard";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import { useLocale } from "@/context/LocaleContext";
import type { ProductoConPrecio } from "@/types/producto";

export default function FeaturedProducts({
  productos,
}: {
  productos: ProductoConPrecio[];
}) {
  const { t } = useLocale();

  if (productos.length === 0) {
    return null;
  }

  return (
    <section id="productos" className="bg-white py-[118px]">
      <div className="mx-auto max-w-[1180px] px-7">
        <Reveal>
          <SectionLabel
            eyebrow={t.home.destacados.eyebrow}
            title={t.home.destacados.titulo}
            description={t.home.destacados.descripcion}
          />
        </Reveal>

        <Reveal>
          <div className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2">
            {productos.map((producto) => (
              <div key={producto.id} className="w-64 shrink-0 snap-start">
                <ProductoCard producto={producto} />
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 text-center">
          <Link
            href="/productos"
            className="text-[0.95rem] font-semibold text-brand-orange-d transition hover:text-brand-orange"
          >
            {t.home.destacados.verTodos}
          </Link>
        </div>
      </div>
    </section>
  );
}
