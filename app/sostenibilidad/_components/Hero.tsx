"use client";

import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";

export default function HeroSostenibilidad() {
  const { t } = useLocale();

  return (
    <section className="relative overflow-hidden bg-brand-green px-6 py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-50"
        style={{ backgroundImage: "var(--doodle)", backgroundSize: "380px" }}
      />

      <div className="relative z-[2] mx-auto max-w-3xl text-center">
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white">
          {t.sostenibilidadPage.eyebrow}
        </span>
        <h1 className="mt-3 text-white">
          <span className="block text-4xl md:text-5xl">{t.sostenibilidadPage.tituloPre}</span>
          <span className="mt-1 block text-2xl font-normal tracking-wide text-white/80 md:text-3xl">
            {t.sostenibilidadPage.tituloPost}
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-white/90">
          {t.sostenibilidadPage.parrafo}
        </p>

        <div className="relative mx-auto mt-10 max-w-xl overflow-hidden rounded-brand shadow-lg">
          <Image
            src="/images/flotacarroselectricos.png"
            alt="Flota eléctrica de Emma en carretera"
            width={1000}
            height={600}
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}
