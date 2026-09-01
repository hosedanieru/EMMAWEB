"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

export default function CalidadQueSeSiente() {
  const { t } = useLocale();

  return (
    <section className="relative bg-brand-green pt-24 pb-20 px-6 md:px-16">
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none -translate-y-1">
        <svg
          viewBox="0 0 1440 100"
          className="w-full h-20 fill-brand-paper"
          preserveAspectRatio="none"
        >
          <path d="M0,40 C360,100 1080,0 1440,40 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl text-white">{t.home.calidad.titulo}</h2>

        <h3 className="text-2xl font-normal text-white/80">
          {t.home.calidad.subtitulo}
        </h3>

        <p className="mt-4 text-white/90">{t.home.calidad.parrafo}</p>

        {/* Link y no <a>: con <a> el navegador recarga la página entera, lo
            que hace la navegación notablemente más lenta y descarta el
            precargado que hace Next del destino. */}
        <Link href="/productos" className="mt-4 inline-block font-semibold text-brand-orange">
          {t.home.calidad.link}
        </Link>
      </div>

      <div className="mt-10 flex justify-center">
        <Image
          src="/images/completodeproductos.png"
          alt="Productos Emma: arroz, frijol, lenteja, maíz y garbanzo"
          width={2500}
          height={1000}
          className="w-full max-w-6xl h-auto"
        />
      </div>
    </section>
  );
}
