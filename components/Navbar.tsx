"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, ShoppingCart, ChevronDown, X } from "lucide-react";

const secciones = [
  { nombre: "Inicio", href: "/", descripcion: "Vuelve a la página principal" },
  { nombre: "Conócenos", href: "/conocenos", descripcion: "" },
  { nombre: "Productos", href: "/productos", descripcion: "Catálogo completo de granos" },
  { nombre: "Novedades", href: "/novedades", descripcion: "Campañas, ofertas y noticias" },
  { nombre: "Sostenibilidad", href: "/sostenibilidad", descripcion: "Nuestro compromiso ambiental" },
  { nombre: "Trabaja con Nosotros", href: "/trabaja-con-nosotros", descripcion: "Vacantes y registro de proveedores" },
  { nombre: "Contacto", href: "/contacto", descripcion: "Escríbenos o encuéntranos" },
];

function NavItem({ nombre, href, descripcion }: (typeof secciones)[number]) {
  return (
    <div className="group py-6">
      <Link
        href={href}
        className="flex items-center gap-1 text-sm font-semibold text-gray-800 hover:text-brand-green-400"
      >
        {nombre}
        <ChevronDown className="h-3.5 w-3.5 transition duration-300 group-hover:rotate-180" />
      </Link>

      {/* Panel individual, aparece justo debajo de ESTE item */}
      <div className="invisible absolute left-0 top-full z-50 w-full origin-top scale-y-95 border-t border-gray-100 bg-white opacity-0 shadow-xl transition-all duration-300 ease-out group-hover:visible group-hover:scale-y-100 group-hover:opacity-100">
        <div className="mx-auto max-w-7xl px-10 py-8">
          <p className="text-base font-semibold text-gray-900">{nombre}</p>
          <p className="mt-1 text-sm text-gray-500">{descripcion}</p>
        </div>
      </div>
    </div>
  );
}

function BuscadorNavbar() {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [consulta, setConsulta] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const contenedorRef = useRef<HTMLDivElement>(null);

  // Enfoca el input apenas se abre la barra
  useEffect(() => {
    if (abierto) inputRef.current?.focus();
  }, [abierto]);

  // Cierra la barra si el usuario hace clic afuera
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
      {/* Barra de texto: se expande hacia la izquierda del ícono */}
      <form
        onSubmit={manejarEnvio}
        className={`absolute right-0 top-1/2 flex -translate-y-1/2 items-center overflow-hidden rounded-full border bg-white shadow-sm transition-all duration-300 ease-out ${
          abierto
            ? "w-64 border-gray-200 opacity-100 sm:w-80"
            : "w-0 border-transparent opacity-0"
        }`}
      >
        <input
          ref={inputRef}
          type="text"
          value={consulta}
          onChange={(evento) => setConsulta(evento.target.value)}
          onKeyDown={manejarTecla}
          placeholder="Buscar productos..."
          className="w-full bg-transparent px-4 py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400"
        />
        {abierto && (
          <button
            type="button"
            onClick={cerrarBusqueda}
            aria-label="Cerrar búsqueda"
            className="mr-2 shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Ícono que abre/cierra la barra; queda invisible pero ocupa
          espacio para no mover el resto del layout cuando la barra se abre */}
      <button
        type="button"
        onClick={() => setAbierto((prev) => !prev)}
        aria-label="Buscar"
        className={`text-gray-600 transition hover:text-brand-green-400 ${
          abierto ? "invisible" : "visible"
        }`}
      >
        <Search className="h-5 w-5" />
      </button>
    </div>
  );
}

export default function Navbar() {
  return (
    <>
      {/* Barra de anuncio */}
      <div className="w-full bg-brand-green-500 py-2 text-center text-sm text-white">
        🚚 Domicilios gratis en la sabana occidente por compras desde $50.000 🚚
      </div>

      {/* Navbar principal, estilo PepsiCo: limpio, en fila horizontal */}
      <header className="relative w-full border-b border-gray-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-8">
          <Link href="/" className="shrink-0 py-4">
            <Image
              src="/images/logowebcolorverde.png"
              alt="Emma logo"
              width={140}
              height={44}
              className="h-9 w-auto object-contain"
            />
          </Link>

          <div className="flex flex-1 items-center gap-7">
            {secciones.map((seccion) => (
              <NavItem key={seccion.href} {...seccion} />
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-5">
            <BuscadorNavbar />
            <button aria-label="Carrito" className="text-gray-600 hover:text-brand-green-400">
              <ShoppingCart className="h-5 w-5" />
            </button>
            <button className="rounded-full bg-brand-green-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-400">
              Contactar un asesor
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}