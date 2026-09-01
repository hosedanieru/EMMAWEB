"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Globe, Menu, Search, ShoppingCart, X } from "lucide-react";
import { useCarrito } from "@/context/CarritoContext";
import { useLocale } from "@/context/LocaleContext";
import type { Dictionary } from "@/lib/i18n/dictionary";

function secciones(t: Dictionary) {
  return [
    { nombre: t.nav.inicio, href: "/" },
    { nombre: t.nav.conocenos, href: "/conocenos" },
    { nombre: t.nav.productos, href: "/productos" },
    { nombre: t.nav.sostenibilidad, href: "/sostenibilidad" },
    // "Trabaja con nosotros" ya no está acá: ahora es una sección dentro de
    // /contacto, y tener dos entradas del menú llevando a la misma página
    // confunde más de lo que ayuda. El acceso a las vacantes se mantiene por
    // el enlace del pie de página y por los atajos del encabezado de
    // /contacto.
    { nombre: t.nav.contacto, href: "/contacto" },
  ];
}

// "/productos" también debe marcarse activo en "/productos/[slug]" (la
// página de detalle), no solo en el listado exacto.
function esActivo(href: string, pathname: string) {
  // Inicio es el único que se compara exacto: con la regla de abajo, "/"
  // sería prefijo de todas las rutas y el botón quedaría siempre marcado.
  if (href === "/") return pathname === "/";

  return pathname === href || pathname.startsWith(`${href}/`);
}

function BuscadorNavbar({ t }: { t: Dictionary }) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [consulta, setConsulta] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (abierto) inputRef.current?.focus();
  }, [abierto]);

  useEffect(() => {
    function manejarClicAfuera(evento: MouseEvent) {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(evento.target as Node)
      ) {
        setAbierto(false);
      }
    }
    document.addEventListener("mousedown", manejarClicAfuera);
    return () => document.removeEventListener("mousedown", manejarClicAfuera);
  }, []);

  function cerrarBusqueda() {
    setAbierto(false);
    setConsulta("");
  }

  function manejarEnvio(evento: React.FormEvent) {
    evento.preventDefault();
    const termino = consulta.trim();
    if (!termino) return;
    router.push(`/productos?q=${encodeURIComponent(termino)}`);
    cerrarBusqueda();
  }

  function manejarTecla(evento: React.KeyboardEvent) {
    if (evento.key === "Escape") cerrarBusqueda();
  }

  return (
    <div ref={contenedorRef} className="relative flex items-center">
      {/* Escritorio: barra visible y proporcionada */}
      <form
        onSubmit={manejarEnvio}
        className="hidden items-center gap-2 rounded-full bg-brand-paper-2 px-3 py-1.5 md:flex md:w-[220px] lg:w-[260px]"
      >
        <Search className="h-4 w-4 shrink-0 text-brand-muted" />
        <input
          ref={inputRef}
          type="text"
          value={consulta}
          onChange={(evento) => setConsulta(evento.target.value)}
          onKeyDown={manejarTecla}
          placeholder={t.nav.buscarPlaceholder}
          className="w-full bg-transparent text-sm text-brand-ink placeholder:text-brand-muted outline-none"
        />
        {consulta ? (
          <button
            type="button"
            onClick={() => {
              setConsulta("");
              inputRef.current?.focus();
            }}
            aria-label={t.nav.limpiarBusquedaAria}
            className="shrink-0 text-brand-muted hover:text-brand-ink"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </form>

      {/* Móvil: se expande desde el ícono */}
      <form
        onSubmit={manejarEnvio}
        className={`absolute right-0 top-1/2 flex -translate-y-1/2 items-center overflow-hidden rounded-full border bg-white shadow-sm transition-all duration-300 ease-out md:hidden ${
          abierto ? "w-56 border-brand-line opacity-100" : "w-0 border-transparent opacity-0"
        }`}
      >
        <input
          ref={inputRef}
          type="text"
          value={consulta}
          onChange={(evento) => setConsulta(evento.target.value)}
          onKeyDown={manejarTecla}
          placeholder={t.nav.buscarPlaceholder}
          className="w-full bg-transparent px-4 py-2 text-sm text-brand-ink outline-none placeholder:text-brand-muted"
        />
        {abierto && (
          <button
            type="button"
            onClick={cerrarBusqueda}
            aria-label={t.nav.cerrarBusquedaAria}
            className="mr-2 shrink-0 text-brand-muted hover:text-brand-ink"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      <button
        type="button"
        onClick={() => setAbierto((prev) => !prev)}
        aria-label={t.nav.buscarAria}
        className={`text-brand-ink/80 transition hover:text-brand-green md:hidden ${
          abierto ? "invisible" : "visible"
        }`}
      >
        <Search className="h-5 w-5" />
      </button>
    </div>
  );
}

function BotonIdioma({
  locale,
  toggleLocale,
  t,
  className,
}: {
  locale: "es" | "en";
  toggleLocale: () => void;
  t: Dictionary;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={t.nav.cambiarIdiomaAria}
      className={
        className ??
        "inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-brand-line px-4 py-2 text-sm font-semibold text-brand-ink transition-colors duration-200 hover:border-brand-green hover:text-brand-green"
      }
    >
      <Globe className="h-4 w-4" />
      {locale === "es" ? "EN" : "ES"}
    </button>
  );
}

export default function Navbar() {
  const { cantidadTotal } = useCarrito();
  const { locale, toggleLocale, t } = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 30);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Franja de anuncio */}
      <div className="w-full bg-brand-green py-2 text-center text-sm text-white">
        {t.nav.promo}
      </div>

      <header
        className={`sticky top-0 z-[70] w-full border-b transition-[background-color,box-shadow,border-color,backdrop-filter] duration-[.35s] ${
          scrolled
            ? "border-brand-line-2 bg-brand-paper/90 shadow-[0_20px_40px_-28px_rgba(20,40,20,.5)] backdrop-blur-md"
            : "border-transparent bg-brand-paper"
        }`}
      >
        <div className="mx-auto flex h-[78px] max-w-[1180px] items-center justify-between gap-6 px-7">
          <Link href="/" aria-label={t.nav.inicio} className="shrink-0">
            <Image
              src="/images/logowebcolorverde.png"
              alt="Emma"
              width={140}
              height={44}
              className="h-9 w-auto object-contain"
            />
          </Link>

          <nav
            aria-label="Principal"
            className="hidden flex-1 items-center justify-center gap-1 sm:flex"
          >
            {secciones(t).map((seccion) => {
              const activo = esActivo(seccion.href, pathname);
              return (
                <Link
                  key={seccion.href}
                  href={seccion.href}
                  aria-current={activo ? "page" : undefined}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition duration-200 ${
                    activo
                      ? "bg-brand-green/8 text-brand-green"
                      : "text-brand-ink/85 opacity-85 hover:bg-brand-green/5 hover:opacity-100"
                  }`}
                >
                  {seccion.nombre}
                  {activo && (
                    <span className="absolute left-1/2 -bottom-[3px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-brand-orange" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-4">
            <BuscadorNavbar t={t} />

            <Link
              href="/carrito"
              aria-label={t.nav.carritoAria}
              className="relative text-brand-ink/80 transition hover:text-brand-green"
            >
              <ShoppingCart className="h-5 w-5" />
              {cantidadTotal > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange text-[10px] font-semibold text-white">
                  {cantidadTotal}
                </span>
              )}
            </Link>

            <div className="hidden sm:block">
              <BotonIdioma locale={locale} toggleLocale={toggleLocale} t={t} />
            </div>

            <button
              type="button"
              onClick={() => setMenuAbierto((v) => !v)}
              aria-label={t.nav.menuAria}
              className="p-1 text-brand-green sm:hidden"
            >
              {menuAbierto ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        <nav
          aria-label="Principal móvil"
          className={`grid overflow-hidden border-t border-brand-line-2 bg-brand-paper transition-[grid-template-rows] duration-[.35s] sm:hidden ${
            menuAbierto ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="flex flex-col gap-1 px-6 py-4">
              {secciones(t).map((seccion) => {
                const activo = esActivo(seccion.href, pathname);
                return (
                  <Link
                    key={seccion.href}
                    href={seccion.href}
                    onClick={() => setMenuAbierto(false)}
                    aria-current={activo ? "page" : undefined}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                      activo
                        ? "bg-brand-paper-2 text-brand-green"
                        : "text-brand-ink hover:bg-brand-paper-2"
                    }`}
                  >
                    {activo && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
                    )}
                    {seccion.nombre}
                  </Link>
                );
              })}
              <BotonIdioma
                locale={locale}
                toggleLocale={toggleLocale}
                t={t}
                className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full border-[1.5px] border-brand-line px-4 py-2.5 text-sm font-semibold text-brand-ink transition-colors duration-200 hover:border-brand-green hover:text-brand-green"
              />
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
