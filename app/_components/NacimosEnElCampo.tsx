"use client";

import Image from "next/image";
import { Sprout, BadgeCheck, Leaf, Zap } from "lucide-react";
import Reveal from "@/components/Reveal";
import { useLocale } from "@/context/LocaleContext";

const iconos = [Sprout, BadgeCheck, Leaf, Zap];

export default function NacimosEnElCampo() {
  const { t } = useLocale();

  return (
    <section id="nosotros" className="bg-brand-paper-2 py-[118px]">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-[70px] px-7 lg:grid-cols-2">
        <Reveal
          className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-[26px] lg:min-h-[460px]"
          style={{
            background:
              "linear-gradient(160deg, #22582c, var(--color-brand-green) 60%, var(--color-brand-green-deep))",
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-50"
            style={{ backgroundImage: "var(--doodle)", backgroundSize: "360px" }}
          />
          <Image
            src="/images/delcampoatucasa.png"
            alt="Mujer campesina cosechando en el campo colombiano"
            width={340}
            height={370}
            className="relative z-[2] h-[280px] w-auto rounded-2xl object-cover drop-shadow-[0_30px_40px_rgba(0,0,0,.4)] lg:h-[400px]"
          />
        </Reveal>

        <Reveal>
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-brand-orange-d">
            {t.home.nosotros.eyebrow}
          </span>
          <h2 className="my-3.5 text-[clamp(1.8rem,3.4vw,2.7rem)] text-brand-green">
            {t.home.nosotros.tituloPre}{" "}
            <em className="not-italic text-brand-orange">{t.home.nosotros.tituloEm}</em>
          </h2>
          <p className="mb-3.5 text-[1.05rem] text-brand-muted">
            {t.home.nosotros.parrafo1}
          </p>
          <p className="mb-3.5 text-[1.05rem] text-brand-muted">
            {t.home.nosotros.parrafo2}
          </p>

          <div className="mt-[26px] grid grid-cols-1 gap-[18px] sm:grid-cols-2">
            {t.home.nosotros.miniFeatures.map(({ titulo, texto }, i) => {
              const Icon = iconos[i];
              return (
                <div key={titulo} className="flex items-start gap-[.8rem]">
                  <Icon className="h-[30px] w-[30px] shrink-0 stroke-[1.5] text-brand-green" />
                  <div>
                    <b className="block text-[0.98rem] text-brand-ink">
                      {titulo}
                    </b>
                    <span className="text-[0.86rem] text-brand-muted">
                      {texto}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
