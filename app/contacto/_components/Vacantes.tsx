"use client";

import { GraduationCap, Heart, Mail, MapPin, MessageCircle, TrendingUp } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import BotonesContacto from "./BotonesContacto";
import { linkCorreo, linkWhatsApp } from "@/lib/contacto";
import { useLocale } from "@/context/LocaleContext";

export type VacantePublica = {
  id: string;
  titulo: string;
  area: string;
  ubicacion: string;
  tipo: string;
  descripcion: string;
};

const iconosBeneficios = [TrendingUp, Heart, GraduationCap];

export default function Vacantes({ vacantes }: { vacantes: VacantePublica[] }) {
  const { t } = useLocale();
  const v = t.trabajaConNosotros.vacantes;

  const tipoContrato = v.tipoContrato as Record<string, string>;

  return (
    <section id="trabaja" className="scroll-mt-24 py-[70px]">
      <Reveal>
        <SectionLabel
          eyebrow={v.eyebrow}
          title={v.titulo}
          description={v.descripcion}
        />
      </Reveal>

      <Reveal className="mb-10">
        {vacantes.length === 0 ? (
          <div className="rounded-brand border border-brand-line-2 bg-white px-6 py-10 text-center">
            <p className="font-medium text-brand-ink">{v.sinVacantesTitulo}</p>
            <p className="mt-1 text-sm text-brand-muted">{v.sinVacantesTexto}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {vacantes.map((vacante) => (
              <div
                key={vacante.id}
                className="flex flex-col rounded-brand border border-brand-line-2 bg-white p-6 transition-[transform,box-shadow] duration-[.35s] ease-[cubic-bezier(.2,.7,.3,1)] hover:-translate-y-1.5 hover:shadow-[0_26px_50px_-24px_rgba(20,40,20,.4)]"
              >
                <span className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-brand-orange-d">
                  {vacante.area} · {tipoContrato[vacante.tipo] ?? vacante.tipo}
                </span>
                <h3 className="mt-1.5 text-[1.1rem] text-brand-green">
                  {vacante.titulo}
                </h3>
                <div className="mt-1 flex items-center gap-1 text-sm text-brand-muted">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {vacante.ubicacion}
                </div>
                <p className="mt-3 flex-1 text-sm text-brand-muted line-clamp-3">
                  {vacante.descripcion}
                </p>

                {/* Los dos canales, no solo WhatsApp. El mensaje y el asunto
                    ya llevan el nombre de la vacante, así que quien recibe
                    sabe de entrada a cuál se están postulando.

                    El de correo faltaba: `asuntoVacante` llevaba tiempo
                    definido en el diccionario sin que nadie lo usara. Importa
                    porque la hoja de vida se adjunta mucho más cómodo desde
                    el cliente de correo que desde el chat. */}
                <div className="mt-4 flex flex-col gap-2 border-t border-brand-line-2 pt-3 text-[0.86rem] font-semibold">
                  <a
                    href={linkWhatsApp(v.mensajeVacante(vacante.titulo))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-[.35rem] text-brand-orange-d"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0" />
                    {v.postularme}
                  </a>

                  {/* linkCorreo devuelve null si no hay correo configurado en
                      lib/contacto.ts, y entonces esta línea no se pinta. */}
                  {(() => {
                    const correo = linkCorreo({
                      asunto: v.asuntoVacante(vacante.titulo),
                      cuerpo: v.mensajeVacante(vacante.titulo),
                    });
                    return correo ? (
                      <a
                        href={correo}
                        className="flex items-center gap-[.35rem] text-brand-green"
                      >
                        <Mail className="h-4 w-4 shrink-0" />
                        {t.contacto.escribirCorreo}
                      </a>
                    ) : null;
                  })()}
                </div>
              </div>
            ))}
          </div>
        )}
      </Reveal>

      {/* Este bloque va SIEMPRE, haya vacantes publicadas o no.
          Antes vivía dentro de la rama "no hay vacantes", así que publicar la
          primera vacante hacía desaparecer los únicos botones de contacto de
          toda la sección: quedaban solo los enlaces de WhatsApp de cada
          tarjeta, sin forma de escribir por correo ni de dejar una hoja de
          vida espontánea para un puesto que no estuviera en la lista.
          Justo al revés de lo que hace falta: cuando hay vacantes abiertas es
          cuando más gente quiere escribir. */}
      <Reveal className="mb-16">
        <div className="rounded-brand border border-brand-line-2 bg-white px-6 py-8 text-center">
          <p className="text-sm text-brand-muted">{v.notaHojaDeVida}</p>
          <div className="mt-5 flex justify-center">
            <BotonesContacto
              mensaje={v.mensajeGeneral}
              asunto={v.asuntoGeneral}
              variante="secundaria"
            />
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="grid gap-[18px] sm:grid-cols-3">
          {v.beneficios.map(({ titulo, texto }, i) => {
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
    </section>
  );
}
