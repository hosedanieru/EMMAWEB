"use client";

import Image from "next/image";
import { useState } from "react";
import { useCarrito } from "@/context/CarritoContext";
import { useLocale } from "@/context/LocaleContext";
import { etiquetaPresentacion } from "@/lib/presentacion";
import type { Producto, Categoria } from "@/generated/prisma";

type PresentacionSerializada = {
  id: string;
  cantidad: number;
  unidad: string;
  unidadesPorPaquete: number;
  precio: number;
  stock: number;
  activo: boolean;
  productoId: string;
};

type ProductoConDetalle = Producto & {
  categoria: Categoria;
  presentaciones: PresentacionSerializada[];
};

export default function DetalleProducto({
  producto,
}: {
  producto: ProductoConDetalle;
}) {
  const { agregarItem } = useCarrito();
  const { t } = useLocale();
  const [seleccionada, setSeleccionada] = useState<PresentacionSerializada | null>(
    producto.presentaciones[0] ?? null
  );
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  function handleAgregar() {
    if (!seleccionada) return;

    agregarItem({
      presentacionId: seleccionada.id,
      productoId: producto.id,
      productoNombre: producto.nombre,
      productoSlug: producto.slug,
      productoImagen: producto.imagen,
      etiqueta: etiquetaPresentacion(seleccionada),
      precio: seleccionada.precio,
      cantidad,
      stockDisponible: seleccionada.stock,
    });

    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  }

  if (producto.presentaciones.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-7 py-24">
        <h1 className="text-brand-green">{producto.nombre}</h1>
        <p className="mt-4 text-brand-muted">
          {t.detalleProducto.sinPresentaciones}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-5xl grid-cols-1 gap-12 px-7 py-24 md:grid-cols-2">
      <div className="relative aspect-square w-full rounded-brand bg-brand-paper-2">
        {producto.imagen ? (
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            fill
            className="object-contain p-8 drop-shadow-[0_16px_20px_rgba(20,40,20,.2)]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : null}
      </div>

      <div>
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-orange-d">
          {producto.categoria.nombre}
        </span>
        <h1 className="mt-1 text-brand-green">{producto.nombre}</h1>
        <p className="mt-4 text-brand-muted">{producto.descripcion}</p>

        <div className="mt-8">
          <p className="mb-2 text-sm font-medium text-brand-ink">{t.detalleProducto.presentacion}</p>
          <div className="flex flex-wrap gap-2">
            {producto.presentaciones.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSeleccionada(p);
                  setCantidad(1);
                }}
                disabled={p.stock === 0}
                className={`rounded-full border-[1.5px] px-4 py-2 text-sm transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
                  seleccionada?.id === p.id
                    ? "border-brand-green bg-brand-green text-white"
                    : "border-brand-line text-brand-ink hover:border-brand-green"
                }`}
              >
                {etiquetaPresentacion(p)}
                {p.stock === 0 && ` ${t.detalleProducto.agotado}`}
              </button>
            ))}
          </div>
        </div>

        {seleccionada && (
          <>
            <p className="mt-6 text-3xl font-semibold text-brand-orange-d">
              ${seleccionada.precio.toLocaleString("es-CO")}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                className="h-9 w-9 rounded-full border-[1.5px] border-brand-line text-brand-ink transition-colors duration-200 hover:border-brand-green hover:text-brand-green"
              >
                −
              </button>
              <span className="w-8 text-center text-brand-ink">{cantidad}</span>
              <button
                type="button"
                onClick={() =>
                  setCantidad((c) => Math.min(seleccionada.stock, c + 1))
                }
                disabled={cantidad >= seleccionada.stock}
                className="h-9 w-9 rounded-full border-[1.5px] border-brand-line text-brand-ink transition-colors duration-200 hover:border-brand-green hover:text-brand-green disabled:opacity-30"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAgregar}
              disabled={seleccionada.stock === 0}
              className="btn btn-primary mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-40"
            >
              {agregado ? t.detalleProducto.agregado : t.detalleProducto.agregarAlCarrito}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
