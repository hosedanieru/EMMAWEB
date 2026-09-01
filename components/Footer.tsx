"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";
import type { Dictionary } from "@/lib/i18n/dictionary";

function columnas(t: Dictionary) {
  return [
    {
      titulo: t.footer.columnas.atencion.titulo,
      links: [
        { texto: t.footer.columnas.atencion.horarios, href: "#" },
        { texto: t.footer.columnas.atencion.telefonica, href: "#" },
        { texto: t.footer.columnas.atencion.pqrs, href: "#" },
        { texto: t.footer.columnas.atencion.lineaCorporativa, href: "#" },
      ],
    },
    {
      titulo: t.footer.columnas.empresa.titulo,
      links: [
        { texto: t.footer.columnas.empresa.quienesSomos, href: "/conocenos" },
        { texto: t.footer.columnas.empresa.trabajaConNosotros, href: "/contacto#trabaja" },
        { texto: t.footer.columnas.empresa.clientesInstitucionales, href: "#" },
        { texto: t.footer.columnas.empresa.preguntasFrecuentes, href: "#" },
      ],
    },
    {
      titulo: t.footer.columnas.legal.titulo,
      links: [
        { texto: t.footer.columnas.legal.terminos, href: "/legal/terminos" },
        { texto: t.footer.columnas.legal.datos, href: "/legal/tratamiento-datos" },
        { texto: t.footer.columnas.legal.privacidad, href: "/legal/privacidad" },
        { texto: t.footer.columnas.legal.etica, href: "/legal/etica" },
      ],
    },
  ];
}

const redes = [
  {
    nombre: "Instagram",
    href: "https://instagram.com/emmacolombia.co",
    path: "M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.1.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.1-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.1-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.1 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.2A6.6 6.6 0 1012 18.6 6.6 6.6 0 0012 5.4zm0 10.9a4.3 4.3 0 110-8.6 4.3 4.3 0 010 8.6zm6.8-11.2a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z",
  },
  {
    nombre: "Facebook",
    href: "https://facebook.com/emmalegumbres",
    path: "M14 9h3V6h-3c-2 0-3.5 1.5-3.5 3.5V11H8v3h2.5v7h3v-7H16l.5-3h-3V9.8c0-.5.3-.8.8-.8z",
  },
  {
    nombre: "TikTok",
    href: "https://tiktok.com/@emmacolombia.co",
    path: "M16 3c.3 2 1.6 3.6 3.6 3.9v3c-1.4 0-2.7-.4-3.6-1.1V15a5.5 5.5 0 11-5.5-5.5c.3 0 .6 0 .9.1v3.1a2.5 2.5 0 101.7 2.3V3H16z",
  },
  {
    nombre: "LinkedIn",
    href: "https://linkedin.com/company/emma-colombia",
    path: "M6.9 8.4H4V20h2.9V8.4zM5.4 4a1.7 1.7 0 100 3.4 1.7 1.7 0 000-3.4zM20 20h-2.9v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V20H10.2V8.4H13v1.6h.1c.4-.7 1.3-1.5 2.8-1.5 3 0 3.6 2 3.6 4.5V20z",
  },
];

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="bg-brand-green-deep px-6 py-16 text-[#bcd0bc] md:px-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <Image
            src="/images/logoemma-transparente.png"
            alt="Logo Emma"
            width={150}
            height={50}
            className="h-9 w-auto"
          />
          <p className="mt-5 max-w-[26ch] text-sm text-[#a9c3a9]">
            {t.footer.descripcion}
          </p>
          <div className="mt-5 flex gap-2">
            {redes.map((red) => (
              <a
                key={red.nombre}
                href={red.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={red.nombre}
                className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-white/8 transition-colors duration-200 hover:bg-brand-orange"
              >
                <svg viewBox="0 0 24 24" width={18} height={18} fill="#fff">
                  <path d={red.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {columnas(t).map((columna) => (
          <div key={columna.titulo}>
            <h5 className="mb-4 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-white">
              {columna.titulo}
            </h5>
            <ul>
              {columna.links.map((link) => (
                <li key={link.texto}>
                  <Link
                    href={link.href}
                    className="block py-[5px] text-sm text-[#a9c3a9] transition-colors duration-200 hover:text-brand-orange"
                  >
                    {link.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-11 max-w-6xl border-t border-white/12 pt-[22px] text-center text-[0.82rem] text-[#8aa48a]">
        <p>© {new Date().getFullYear()} {t.footer.copyright}</p>
      </div>
    </footer>
  );
}
