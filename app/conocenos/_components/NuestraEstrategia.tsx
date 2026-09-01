"use client";

import { Target, Rocket } from 'lucide-react';
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import { useLocale } from '@/context/LocaleContext';

export default function NuestraEstrategia() {
  const { t } = useLocale();

  return (
    <section className="py-[118px]">
      <div className="mx-auto max-w-[1180px] px-7">
        <Reveal>
          <SectionLabel
            eyebrow={t.conocenos.estrategia.eyebrow}
            title={t.conocenos.estrategia.titulo}
          />
        </Reveal>

        <Reveal className="grid gap-[50px] md:grid-cols-2">
          <div>
            <Target className="h-8 w-8 stroke-[1.5] text-brand-green" />
            <h3 className="mb-3 mt-4 text-[1.3rem] text-brand-green">{t.conocenos.estrategia.mision.titulo}</h3>
            <p className="leading-relaxed text-brand-muted">
              {t.conocenos.estrategia.mision.parrafo}
            </p>
          </div>

          <div>
            <Rocket className="h-8 w-8 stroke-[1.5] text-brand-green" />
            <h3 className="mb-3 mt-4 text-[1.3rem] text-brand-green">{t.conocenos.estrategia.vision.titulo}</h3>
            <p className="leading-relaxed text-brand-muted">
              {t.conocenos.estrategia.vision.parrafo}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
