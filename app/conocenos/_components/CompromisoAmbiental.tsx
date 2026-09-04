"use client";

import Image from "next/image";
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

        {/* La proporción es la nativa de la foto (1190x803), no el 4/3 que
            tenía el marcador de posición. Es una foto de grupo con gente
            hasta los dos bordes: recortarla a 4/3 dejaría fuera del encuadre
            a las personas de los extremos.

            `sizes` describe el ancho real de esta columna —(1180 − 56 de
            padding − 70 de gap) / 2 = 527px— para que el optimizador no
            entregue una imagen del ancho de la pantalla pudiendo mandar una
            de la mitad. */}
        <div className="relative aspect-[1190/803] overflow-hidden rounded-brand bg-brand-paper-2">
          <Image
            src="/images/equipoemma.png"
            alt={t.conocenos.esencia.imagenAlt}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 527px, calc(100vw - 56px)"
          />
        </div>
      </Reveal>
    </section>
  );
}
