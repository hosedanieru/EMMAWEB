"use client";

import { Handshake, Truck, Leaf } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import BotonesContacto from "./BotonesContacto";
import { useLocale } from "@/context/LocaleContext";

const iconosBeneficios = [Handshake, Truck, Leaf];

export default function Proveedores() {
  const { t } = useLocale();
  const p = t.trabajaConNosotros.proveedores;

  return (
    <section id="proveedores" className="scroll-mt-24 py-[70px]">
      <Reveal>
        <SectionLabel
          eyebrow={p.eyebrow}
          title={p.titulo}
          description={p.descripcion}
        />
      </Reveal>

      <Reveal className="mb-12">
        <div className="grid gap-[18px] sm:grid-cols-3">
          {p.beneficios.map(({ titulo, texto }, i) => {
            const Icon = iconosBeneficios[i];
            return (
              <div key={titulo} className="flex items-start gap-[.8rem]">
                <Icon className="h-[30px] w-[30px] shrink-0 stroke-[1.5] text-brand-green" />
                <div>
                  <b className="block text-[0.98rem] text-brand-ink">{titulo}</b>
                  <span className="text-[0.86rem] text-brand-muted">{texto}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>

      {/* El mensaje termina en "...ofrezco: " a propósito, para que la persona
          lo complete y llegue ya con el dato que sirve para responderle. */}
      <Reveal className="flex justify-center">
        <BotonesContacto mensaje={p.mensaje} asunto={p.asunto} />
      </Reveal>
    </section>
  );
}
