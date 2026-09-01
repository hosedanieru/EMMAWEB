import Link from "next/link";
import { EMPRESA, nitVisible } from "@/lib/empresa";

// Envoltura común de los cuatro documentos legales. Centraliza el encabezado,
// la fecha de vigencia y el bloque de identificación del responsable, que la
// ley exige que aparezca en todos.

const DOCUMENTOS = [
  { href: "/legal/terminos", titulo: "Términos y condiciones" },
  { href: "/legal/tratamiento-datos", titulo: "Tratamiento de datos" },
  { href: "/legal/privacidad", titulo: "Política de privacidad" },
  { href: "/legal/etica", titulo: "Transparencia y ética" },
];

export function DocumentoLegal({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-7 py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-orange-d">
        Información legal
      </p>
      <h1 className="mt-2 text-brand-green">{titulo}</h1>
      <p className="mt-3 text-sm text-brand-muted">
        Vigente desde el {EMPRESA.vigenteDesde}
      </p>

      <div className="mt-6 rounded-brand border border-brand-line-2 bg-brand-paper-2 px-5 py-4 text-sm text-brand-muted">
        <p className="font-medium text-brand-ink">{EMPRESA.razonSocial}</p>
        <p>NIT {nitVisible()}</p>
        <p>{EMPRESA.domicilio}</p>
        <p>{EMPRESA.ciudad}</p>
        <p>
          {EMPRESA.correoContacto} · {EMPRESA.telefono}
        </p>
      </div>

      <div className="legal mt-10">{children}</div>

      <nav className="mt-16 border-t border-brand-line-2 pt-6">
        <p className="mb-3 text-sm font-medium text-brand-ink">Otros documentos</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {DOCUMENTOS.filter((d) => d.titulo !== titulo).map((d) => (
            <li key={d.href}>
              <Link
                href={d.href}
                className="text-brand-green-2 underline underline-offset-2 hover:text-brand-green"
              >
                {d.titulo}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}

/** Sección numerada dentro de un documento. */
export function Seccion({
  n,
  titulo,
  children,
}: {
  n: number;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-9">
      <h2 className="mb-2 text-lg font-semibold text-brand-green">
        {n}. {titulo}
      </h2>
      <div className="space-y-3 text-[0.97rem] leading-relaxed text-brand-ink/85">
        {children}
      </div>
    </section>
  );
}
