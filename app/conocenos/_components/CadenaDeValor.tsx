"use client";

import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import { useLocale } from "@/context/LocaleContext";

const numeros = ["01", "02", "03", "04"];

export default function CadenaDeValor() {
  const { t } = useLocale();

  return (
    <section className="bg-brand-paper-2 py-[118px]">
      <div className="mx-auto max-w-[1180px] px-7">
        <Reveal>
          <SectionLabel
            eyebrow={t.conocenos.cadena.eyebrow}
            title={t.conocenos.cadena.titulo}
            description={t.conocenos.cadena.descripcion}
          />
        </Reveal>

        <Reveal className="grid grid-cols-2 gap-x-6 gap-y-[34px] text-center lg:grid-cols-4 lg:gap-[26px]">
          {t.conocenos.cadena.pasos.map((nombre, i) => (
            <div key={nombre}>
              <div className="mx-auto mb-[18px] flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-brand-orange font-accent text-[1.1rem] text-brand-orange">
                {numeros[i]}
              </div>
              <h4 className="text-[1.08rem] text-brand-green">{nombre}</h4>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
