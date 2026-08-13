"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCarrito } from "@/context/CarritoContext";

function formatoPrecio(valor: number) {
  return valor.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

export default function CarritoPage() {
  const { items, actualizarCantidad, quitarItem, totalPrecio } = useCarrito();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-300" />
        <h1 className="mt-6 text-2xl font-semibold text-gray-800">
          Tu carrito está vacío
        </h1>
        <p className="mt-2 text-gray-500">
          Explora nuestro catálogo y agrega productos para verlos aquí.
        </p>
        <Link
          href="/productos"
          className="mt-8 rounded-full bg-brand-green-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-green-400"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-gray-900">Tu carrito</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        {/* Lista de items */}
        <div className="lg:col-span-2">
          <ul className="divide-y divide-gray-200 border-y border-gray-200">
            {items.map((item) => (
              <li
                key={item.presentacionId}
                className="flex gap-4 py-5"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {item.productoImagen ? (
                    <Image
                      src={item.productoImagen}
                      alt={item.productoNombre}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/productos/${item.productoSlug}`}
                        className="font-medium text-gray-900 hover:text-brand-green-500"
                      >
                        {item.productoNombre}
                      </Link>
                      <p className="text-sm text-gray-500">{item.etiqueta}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => quitarItem(item.presentacionId)}
                      aria-label="Quitar del carrito"
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    {/* Stepper de cantidad */}
                    <div className="flex items-center gap-3 rounded-full border border-gray-200 px-3 py-1">
                      <button
                        type="button"
                        onClick={() =>
                          actualizarCantidad(
                            item.presentacionId,
                            item.cantidad - 1
                          )
                        }
                        disabled={item.cantidad <= 1}
                        aria-label="Disminuir cantidad"
                        className="text-gray-500 hover:text-brand-green-500 disabled:opacity-30"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm font-medium">
                        {item.cantidad}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          actualizarCantidad(
                            item.presentacionId,
                            item.cantidad + 1
                          )
                        }
                        disabled={item.cantidad >= item.stockDisponible}
                        aria-label="Aumentar cantidad"
                        className="text-gray-500 hover:text-brand-green-500 disabled:opacity-30"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <p className="font-semibold text-gray-900">
                      {formatoPrecio(item.precio * item.cantidad)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Resumen */}
        <aside className="h-fit rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">Resumen</h2>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>{formatoPrecio(totalPrecio)}</span>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Domicilio calculado en el siguiente paso
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-base font-semibold text-gray-900">
            <span>Total</span>
            <span>{formatoPrecio(totalPrecio)}</span>
          </div>

          <Link
            href="/checkout"
            className="mt-6 block w-full rounded-full bg-brand-green-500 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-green-400"
          >
            Proceder al pago
          </Link>
        </aside>
      </div>
    </div>
  );
}