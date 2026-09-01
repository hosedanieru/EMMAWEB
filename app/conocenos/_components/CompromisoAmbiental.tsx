"use client";

import Reveal from "@/components/Reveal";
import { useLocale } from "@/context/LocaleContext";

export default function NuestraEsencia() {
  const { t } = useLocale();

  return (
    <section className="py-[118px]">
      <Reveal className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-[70px] px-7 md:grid-cols-2">
        <div>
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-brand-orange-d">
            {t.conocenos.esencia.eyebrow}
          </span>
          <h2 className="my-3.5 text-[clamp(1.8rem,3.4vw,2.7rem)] text-brand-green">
            {t.conocenos.esencia.titulo}
          </h2>
          <p className="mb-3.5 text-[1.05rem] text-brand-muted">
            {t.conocenos.esencia.parrafo1}
          </p>
          <p className="text-[1.05rem] text-brand-muted">
            {t.conocenos.esencia.parrafo2}
          </p>
        </div>

        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-brand bg-brand-paper-2">
          <span className="text-sm text-brand-muted">
            {t.conocenos.esencia.imagenPlaceholder}
          </span>
        </div>
      </Reveal>
    </section>
  );
}
