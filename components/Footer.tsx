import Link from "next/link";
import Image from "next/image";

const columnas = [
  {
    titulo: "Atención al cliente",
    links: [
      { texto: "Horarios de despacho", href: "#" },
      { texto: "Atención telefónica", href: "#" },
      { texto: "Escríbenos (PQRS)", href: "#" },
      { texto: "Línea corporativa", href: "#" },
    ],
  },
  {
    titulo: "Emma Colombia",
    links: [
      { texto: "Quiénes somos", href: "/conocenos" },
      { texto: "Trabaja con nosotros", href: "/trabaja-con-nosotros" },
      { texto: "Clientes institucionales", href: "#" },
      { texto: "Preguntas frecuentes", href: "#" },
    ],
  },
  {
    titulo: "Información legal",
    links: [
      { texto: "Términos y condiciones", href: "#" },
      { texto: "Tratamiento de datos", href: "#" },
      { texto: "Políticas de privacidad", href: "#" },
      { texto: "Transparencia y ética profesional", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-brand-green-500 px-6 py-16 text-white md:px-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
        {columnas.map((columna) => (
          <div key={columna.titulo}>
            <h4 className="mb-4 font-bold">{columna.titulo}</h4>
            <ul className="space-y-2">
              {columna.links.map((link) => (
                <li key={link.texto}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 hover:text-white"
                  >
                    {link.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="flex flex-col items-center justify-center">
          <Image
            src="/images/logoemma-transparente.png"
            alt="Logo Emma"
            width={180}
            height={60}
            className="mx-auto mb-4 h-auto w-auto"
          />
          <p className="mt-6 text-sm text-white/80">
            Síguenos en nuestras redes:
          </p>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-6xl border-t border-white/20 pt-6 text-center text-xs text-white/70">
        <p>
          Emma Colombia S.A.S &nbsp;|&nbsp; NIT  &nbsp;|&nbsp; Todos
          los derechos reservados
        </p>
      </div>
    </footer>
  );
}