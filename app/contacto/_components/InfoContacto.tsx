'use client';

import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { CONTACTO, linkWhatsApp } from '@/lib/contacto';
import { useLocale } from '@/context/LocaleContext';

export default function InfoContacto() {
  const { t } = useLocale();

  // Los datos salen de lib/contacto.ts, no de una lista suelta acá: así el
  // teléfono que se muestra y el número al que escriben los botones de
  // WhatsApp no se pueden desincronizar.
  //
  // El horario viene del diccionario y no de lib/contacto.ts porque es el
  // único de los cuatro que hay que traducir.
  const datos = [
    { icono: MapPin, etiqueta: t.contacto.direccion, valor: CONTACTO.direccion },
    {
      icono: Phone,
      etiqueta: t.contacto.telefono,
      valor: CONTACTO.telefonoVisible,
      href: linkWhatsApp(t.contacto.consultas.mensaje),
    },
    {
      icono: Mail,
      etiqueta: t.contacto.correo,
      valor: CONTACTO.correo || t.contacto.porDefinir,
      href: CONTACTO.correo ? `mailto:${CONTACTO.correo}` : undefined,
    },
    {
      icono: Clock,
      etiqueta: t.contacto.horario,
      valor: t.contacto.horarioValor,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {datos.map(({ icono: Icon, etiqueta, valor, href }) => {
        const contenido = (
          <>
            <Icon className="h-6 w-6 shrink-0 text-brand-green" />
            <div>
              <b className="block text-sm text-brand-green">{etiqueta}</b>
              <span className="text-sm text-brand-muted">{valor}</span>
            </div>
          </>
        );

        const clases =
          'flex items-start gap-3 rounded-2xl border border-brand-line-2 bg-white p-5 transition-colors duration-200 hover:border-brand-green';

        return href ? (
          <a
            key={etiqueta}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={clases}
          >
            {contenido}
          </a>
        ) : (
          <div key={etiqueta} className={clases}>
            {contenido}
          </div>
        );
      })}
    </div>
  );
}
