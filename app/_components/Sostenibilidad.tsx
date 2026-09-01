"use client";

import Link from "next/link";
import { Truck, Sun, Leaf } from "lucide-react";
import Reveal from "@/components/Reveal";
import { useLocale } from "@/context/LocaleContext";

const iconosPuntos = [Truck, Sun, Leaf];

export default function Sostenibilidad() {
  const { t } = useLocale();

  return (
    <section className="bg-brand-paper py-[118px]">
      <div className="mx-auto max-w-[1180px] px-7">
        <Reveal
          className="relative grid grid-cols-1 items-center gap-[50px] overflow-hidden rounded-[28px] bg-brand-green px-6 py-11 text-white sm:px-16 sm:py-16 lg:grid-cols-[1.15fr_.85fr]"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-50"
            style={{ backgroundImage: "var(--doodle)", backgroundSize: "380px" }}
          />

          <div className="relative z-[2]">
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white">
              {t.home.sostenibilidad.eyebrow}
            </span>
            <h2 className="mb-4 mt-3 text-[clamp(1.7rem,3.2vw,2.5rem)]">
              {t.home.sostenibilidad.tituloPre}{" "}
              <em className="not-italic text-brand-orange">{t.home.sostenibilidad.tituloEm}</em>{" "}
              {t.home.sostenibilidad.tituloPost}
            </h2>
            <p className="mb-[22px] text-[#d7e8d8]">
              {t.home.sostenibilidad.parrafo}
            </p>
            <ul className="grid gap-3.5">
              {t.home.sostenibilidad.puntos.map((texto, i) => {
                const Icon = iconosPuntos[i];
                return (
                  <li key={texto} className="flex items-start gap-[.7rem] font-medium">
                    <Icon className="mt-0.5 h-[22px] w-[22px] shrink-0 stroke-[1.6] text-brand-orange" />
                    {texto}
                  </li>
                );
              })}
            </ul>
            <Link
              href="/sostenibilidad"
              className="mt-6 inline-flex items-center gap-1 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              {t.home.sostenibilidad.link}
            </Link>
          </div>

          <div className="relative z-[2] grid gap-4">
            {t.home.sostenibilidad.cifras.map(({ valor, texto }) => (
              <div
                key={texto}
                className="rounded-[18px] border border-white/[.14] bg-white/[.09] p-[26px] text-center"
              >
                <b className="block font-accent text-[2.6rem] leading-none text-white">
                  {valor}
                </b>
                <span className="text-[0.9rem] text-[#cfe6d1]">{texto}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
