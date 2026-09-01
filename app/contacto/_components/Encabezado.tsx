'use client';

import Link from 'next/link';
import Reveal from '@/components/Reveal';
import SectionLabel from '@/components/SectionLabel';
import { useLocale } from '@/context/LocaleContext';

// Encabezado de la página unificada de contacto. Los tres atajos existen
// porque ahora esta página cubre lo que antes eran dos (Contáctanos y
// Trabaja con Nosotros) y conviene que se vea de entrada que están las tres
// cosas, sin obligar a bajar hasta encontrarlas.
export default function Encabezado() {
  const { t } = useLocale();

  const atajos = [
    { href: '#consultas', texto: t.contacto.irConsultas },
    { href: '#trabaja', texto: t.contacto.irTrabaja },
    { href: '#proveedores', texto: t.contacto.irProveedores },
  ];

  return (
    <Reveal>
      <SectionLabel
        eyebrow={t.contacto.eyebrow}
        title={t.contacto.titulo}
        description={t.contacto.descripcion}
      />

      <div className="mb-16 flex flex-wrap justify-center gap-3">
        {atajos.map(({ href, texto }) => (
          <Link key={href} href={href} className="btn btn-outline">
            {texto}
          </Link>
        ))}
      </div>
    </Reveal>
  );
}
