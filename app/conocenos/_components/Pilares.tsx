"use client";

import { Target, Users, Heart, Zap, Eye } from 'lucide-react';
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import { useLocale } from '@/context/LocaleContext';

const iconos = [Target, Users, Heart, Zap, Eye];

export default function ValoresConocenos() {
  const { t } = useLocale();
  const valores = t.conocenos.pilares.valores.map((valor, i) => ({
    ...valor,
    icon: iconos[i],
  }));

  return (
    <section className="bg-brand-paper-2 py-[118px]">
      <div className="mx-auto max-w-[1180px] px-7">
        <Reveal>
          <SectionLabel
            eyebrow={t.conocenos.pilares.eyebrow}
            title={t.conocenos.pilares.titulo}
            description={t.conocenos.pilares.descripcion}
          />
        </Reveal>

        <Reveal className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {valores.map((valor) => {
            const Icon = valor.icon;
            return (
              <div
                key={valor.titulo}
                className="rounded-brand border border-brand-line-2 bg-white p-6 text-center transition-[transform,box-shadow] duration-[.35s] ease-[cubic-bezier(.2,.7,.3,1)] hover:-translate-y-1.5 hover:shadow-[0_26px_50px_-24px_rgba(20,40,20,.4)]"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-paper-2 text-brand-green">
                  <Icon size={26} />
                </div>
                <h3 className="mt-4 text-lg text-brand-green">{valor.titulo}</h3>
                <p className="mt-1.5 text-sm text-brand-muted">{valor.descripcion}</p>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
