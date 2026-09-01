"use client";

import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import { useLocale } from "@/context/LocaleContext";

export default function Faq() {
  const { t } = useLocale();

  return (
    <section id="faq" className="bg-brand-paper-2 py-[118px]">
      <div className="mx-auto max-w-[1180px] px-7">
        <Reveal>
          <SectionLabel
            eyebrow={t.home.faq.eyebrow}
            title={t.home.faq.titulo}
          />
        </Reveal>

        <Reveal className="mx-auto grid max-w-[820px] gap-3.5">
          {t.home.faq.preguntas.map((faq) => (
            <details
              key={faq.pregunta}
              className="group overflow-hidden rounded-2xl border border-brand-line-2 bg-white"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-[26px] py-[22px] text-[1.02rem] font-semibold text-brand-green [&::-webkit-details-marker]:hidden">
                {faq.pregunta}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1.5px] border-brand-orange text-[1.1rem] text-brand-orange transition-[transform,background-color,color] duration-300 group-open:rotate-45 group-open:bg-brand-orange group-open:text-white">
                  +
                </span>
              </summary>
              <div className="px-[26px] pb-6 text-[0.98rem] text-brand-muted">
                {faq.respuesta}
              </div>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
