"use client";

import Link from 'next/link';
import Reveal from "@/components/Reveal";
import { useLocale } from '@/context/LocaleContext';

export default function CtaConocenos() {
  const { t } = useLocale();

  return (
    <section className="bg-brand-paper py-[118px]">
      <Reveal
        className="relative mx-auto max-w-4xl overflow-hidden rounded-brand bg-brand-green px-6 py-16 text-center"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-50"
          style={{ backgroundImage: "var(--doodle)", backgroundSize: "380px" }}
        />
        <div className="relative z-[2]">
          <h2 className="mb-4 text-2xl text-white md:text-3xl">
            {t.conocenos.cta.titulo}
          </h2>
          <p className="mb-8 text-white/90">
            {t.conocenos.cta.parrafo}
          </p>
          <Link href="/productos" className="btn btn-primary">
            {t.conocenos.cta.boton}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
