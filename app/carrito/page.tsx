"use client";

import Link from "next/link";
import { useCarrito } from "@/context/CarritoContext";
import { useLocale } from "@/context/LocaleContext";

export default function CarritoPage() {
  const { items, actualizarCantidad, quitarItem, total, cantidadTotal } =
    useCarrito();
  const { t } = useLocale();

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-7 py-24 text-center">
        <h1 className="mb-4 text-brand-green">{t.carrito.titulo}</h1>
        <p className="text-brand-muted">{t.carrito.vacio}</p>
        <Link href="/productos" className="btn btn-primary mt-6 inline-flex">
          {t.carrito.verProductos}
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-7 py-24">
      <h1 className="mb-10 text-brand-green">{t.carrito.titulo}</h1>

      <div className="divide-y divide-brand-line-2 border-y border-brand-line-2">
        {items.map((item) => (
          <div key={item.presentacionId} className="flex items-center gap-4 py-6">
            {/* Espacio de imagen — placeholder limpio */}
            <div className="h-20 w-20 shrink-0 rounded-2xl bg-brand-paper-2" />

            <div className="flex-1">
              <p className="font-medium text-brand-ink">{item.productoNombre}</p>
              <p className="text-sm text-brand-muted">{item.etiqueta}</p>
              <p className="text-sm text-brand-muted">
                ${item.precio.toLocaleString("es-CO")}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  actualizarCantidad(item.presentacionId, item.cantidad - 1)
                }
                className="h-8 w-8 rounded-full border-[1.5px] border-brand-line text-brand-ink transition-colors duration-200 hover:border-brand-green hover:text-brand-green"
              >
                −
              </button>
              <span className="w-6 text-center text-brand-ink">{item.cantidad}</span>
              <button
                type="button"
                onClick={() =>
                  actualizarCantidad(item.presentacionId, item.cantidad + 1)
                }
                disabled={item.cantidad >= item.stockDisponible}
                className="h-8 w-8 rounded-full border-[1.5px] border-brand-line text-brand-ink transition-colors duration-200 hover:border-brand-green hover:text-brand-green disabled:opacity-30"
              >
                +
              </button>
            </div>

            <p className="w-24 text-right font-medium text-brand-ink">
              ${(item.precio * item.cantidad).toLocaleString("es-CO")}
            </p>

            <button
              type="button"
              onClick={() => quitarItem(item.presentacionId)}
              className="text-sm text-brand-muted transition hover:text-red-600"
            >
              {t.carrito.quitar}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-brand-muted">{cantidadTotal} {t.carrito.articulos}</p>
        <p className="text-xl font-medium text-brand-green">
          {t.carrito.total} ${total.toLocaleString("es-CO")}
        </p>
      </div>

      <div className="mt-8 text-right">
        <Link href="/checkout" className="btn btn-primary inline-flex">
          {t.carrito.continuar}
        </Link>
      </div>
    </main>
  );
}
