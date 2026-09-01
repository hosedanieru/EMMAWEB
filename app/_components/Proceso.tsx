"use client";

import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import { useLocale } from "@/context/LocaleContext";

const numeros = ["01", "02", "03", "04"];

export default function Proceso() {
  const { t } = useLocale();

  return (
    <section id="proceso" className="py-[118px]">
      <div className="mx-auto max-w-[1180px] px-7">
        <Reveal>
          <SectionLabel
            eyebrow={t.home.proceso.eyebrow}
            title={t.home.proceso.titulo}
            description={t.home.proceso.descripcion}
          />
        </Reveal>

        <Reveal className="grid grid-cols-2 gap-x-6 gap-y-[34px] text-center lg:grid-cols-4 lg:gap-[26px]">
          {t.home.proceso.pasos.map((paso, i) => (
            <div key={paso.titulo}>
              <div className="mx-auto mb-[18px] flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-brand-orange font-accent text-[1.1rem] text-brand-orange">
                {numeros[i]}
              </div>
              <h4 className="mb-[.4rem] text-[1.08rem] text-brand-green">
                {paso.titulo}
              </h4>
              <p className="text-[0.92rem] text-brand-muted">{paso.texto}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
