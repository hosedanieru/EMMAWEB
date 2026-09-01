'use client';

import Reveal from '@/components/Reveal';
import SectionLabel from '@/components/SectionLabel';
import BotonesContacto from './BotonesContacto';
import { useLocale } from '@/context/LocaleContext';

export default function Consultas() {
  const { t } = useLocale();

  return (
    <section id="consultas" className="scroll-mt-24 py-[70px]">
      <Reveal>
        <SectionLabel
          eyebrow={t.contacto.consultas.eyebrow}
          title={t.contacto.consultas.titulo}
          description={t.contacto.consultas.descripcion}
        />
      </Reveal>

      <Reveal className="flex justify-center">
        <BotonesContacto
          mensaje={t.contacto.consultas.mensaje}
          asunto={t.contacto.consultas.asunto}
        />
      </Reveal>
    </section>
  );
}
