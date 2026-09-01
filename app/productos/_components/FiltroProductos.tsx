"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import ProductoCard from "./ProductoCard";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import { useLocale } from "@/context/LocaleContext";
import type { ProductoConPrecio } from "@/types/producto";

export default function FiltroProductos({
  productos,
  busquedaInicial = "",
}: {
  productos: ProductoConPrecio[];
  busquedaInicial?: string;
}) {
  const { t } = useLocale();
  const categorias = useMemo(
    () => Array.from(new Set(productos.map((p) => p.categoria.nombre))),
    [productos]
  );
  const [filtro, setFiltro] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState(busquedaInicial);

  // Si ya estábamos en /productos y se busca de nuevo desde la navbar (mismo
  // route segment, así que este componente no se vuelve a montar), React no
  // vuelve a leer useState(busquedaInicial) por sí solo: sin esto la caja de
  // búsqueda se queda "pegada" en el término anterior.
  //
  // El ajuste va en el cuerpo del render y no en un useEffect: es el patrón
  // que documenta React para "corregir estado cuando cambia una prop". React
  // reinicia el render de inmediato con el valor nuevo, sin llegar a pintar
  // el valor viejo ni provocar el segundo render en cascada que sí causa
  // hacerlo dentro de un efecto.
  const [busquedaPrevia, setBusquedaPrevia] = useState(busquedaInicial);
  if (busquedaInicial !== busquedaPrevia) {
    setBusquedaPrevia(busquedaInicial);
    setBusqueda(busquedaInicial);
  }

  const termino = busqueda.trim().toLowerCase();

  const productosFiltrados = productos.filter((p) => {
    const coincideCategoria = filtro === "todos" || p.categoria.nombre === filtro;
    const coincideBusqueda = termino === "" || p.nombre.toLowerCase().includes(termino);
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div>
      <Reveal>
        <SectionLabel
          eyebrow={t.productos.eyebrow}
          title={t.productos.titulo}
          description={t.productos.descripcion}
        />
      </Reveal>

      <Reveal>
        <div className="-mt-[30px] mb-[42px] flex justify-center">
          <div className="flex w-full max-w-[420px] items-center gap-2 rounded-full border-[1.5px] border-brand-line bg-white px-4 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-brand-muted" />
            <input
              type="text"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              placeholder={t.productos.buscarPlaceholder}
              className="w-full bg-transparent text-sm text-brand-ink placeholder:text-brand-muted outline-none"
            />
            {busqueda && (
              <button
                type="button"
                onClick={() => setBusqueda("")}
                aria-label={t.productos.limpiarBusquedaAria}
                className="shrink-0 text-brand-muted hover:text-brand-ink"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {categorias.length > 1 && (
          <div className="mb-[50px] flex flex-wrap justify-center gap-2">
            <Chip activo={filtro === "todos"} onClick={() => setFiltro("todos")}>
              {t.productos.todos}
            </Chip>
            {categorias.map((categoria) => (
              <Chip
                key={categoria}
                activo={filtro === categoria}
                onClick={() => setFiltro(categoria)}
              >
                {categoria}
              </Chip>
            ))}
          </div>
        )}

        {productosFiltrados.length === 0 ? (
          <p className="text-center text-brand-muted">
            {termino
              ? t.productos.sinResultadosBusqueda(busqueda)
              : t.productos.sinProductos}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
            {productosFiltrados.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        )}
      </Reveal>
    </div>
  );
}

function Chip({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border-[1.5px] px-5 py-2 text-sm font-medium transition-colors duration-200 ${
        activo
          ? "border-brand-green bg-brand-green text-white"
          : "border-brand-line bg-transparent text-brand-ink hover:border-brand-green hover:bg-brand-green hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
