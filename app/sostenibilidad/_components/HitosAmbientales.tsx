"use client";

import { Sun, Recycle, FileX } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

const iconos = [Sun, Recycle, FileX];

export default function HitosAmbientales() {
  const { t } = useLocale();

  return (
    <section className="mx-auto max-w-[1180px] px-7 py-[118px]">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-brand-orange-d">
          {t.sostenibilidadPage.hitosEyebrow}
        </span>
        <h2 className="mt-3 text-brand-green">{t.sostenibilidadPage.hitosTitulo}</h2>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {t.sostenibilidadPage.hitos.map(({ titulo, descripcion }, i) => {
          const Icon = iconos[i];
          return (
            <div
              key={titulo}
              className="rounded-brand border border-brand-line-2 bg-white p-8 text-center transition-[transform,box-shadow] duration-[.35s] ease-[cubic-bezier(.2,.7,.3,1)] hover:-translate-y-1.5 hover:shadow-[0_26px_50px_-24px_rgba(20,40,20,.4)]"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-paper-2">
                <Icon className="h-8 w-8 text-brand-green" />
              </div>
              <h3 className="mt-5 text-lg text-brand-green">{titulo}</h3>
              <p className="mt-3 text-sm text-brand-muted">{descripcion}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
