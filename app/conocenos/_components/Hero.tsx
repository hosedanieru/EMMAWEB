"use client";

import { useLocale } from "@/context/LocaleContext";

export default function HeroConocenos() {
  const { t } = useLocale();

  return (
    <section className="relative flex items-center justify-center px-4 py-24 text-center md:py-32">
      <div className="relative z-10 max-w-3xl">
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-brand-orange-d">
          {t.conocenos.hero.eyebrow}
        </span>
        <h1 className="mt-3 text-4xl text-brand-green md:text-5xl">
          {t.conocenos.hero.titulo}
        </h1>
        <p className="mt-4 text-lg text-brand-ink/80 md:text-xl">
          {t.conocenos.hero.parrafo}
        </p>
      </div>
    </section>
  );
}
