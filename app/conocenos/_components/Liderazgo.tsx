"use client";

import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import { useLocale } from "@/context/LocaleContext";

export default function Liderazgo() {
  const { t } = useLocale();

  return (
    <section className="bg-brand-paper-2 py-[118px]">
      <div className="mx-auto max-w-[1180px] px-7">
        <Reveal>
          <SectionLabel
            eyebrow={t.conocenos.liderazgo.eyebrow}
            title={t.conocenos.liderazgo.titulo}
            description={t.conocenos.liderazgo.descripcion}
          />
        </Reveal>

        <Reveal className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
          {/* Columna Izquierda: Información de Salomón */}
          <div className="space-y-2 text-center md:text-right">
            <h3 className="text-2xl text-brand-green">Salomón Rodriguez</h3>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange-d">
              {t.conocenos.liderazgo.presidente}
            </p>
          </div>

          {/* Columna Central: Foto circular de ambos */}
          <div className="flex justify-center">
            <div className="relative h-64 w-64 overflow-hidden rounded-full border border-brand-line-2 md:h-72 md:w-72">
              <Image
                src="/images/Jefazos.png"
                alt="Salomón Rodriguez y Miguel Rodriguez"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Columna Derecha: Información de Miguel */}
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl text-brand-green">Miguel Rodriguez</h3>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange-d">
              {t.conocenos.liderazgo.ceo}
            </p>
          </div>
        </Reveal>

        {/* Cita o Manifiesto de los líderes */}
        <Reveal className="mx-auto mt-16 max-w-3xl border-t border-brand-line-2 pt-8 text-center">
          <p className="text-lg italic leading-relaxed text-brand-ink/80">
            {t.conocenos.liderazgo.cita}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
