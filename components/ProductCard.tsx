"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Minus, Plus } from "lucide-react";
import type { Producto } from "@/types/producto";

export default function ProductCard({ producto }: { producto: Producto }) {
  const [cantidad, setCantidad] = useState(1);
  const [favorito, setFavorito] = useState(false);

  return (
    <div className="group relative w-64 shrink-0 snap-start rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 ease-out hover:z-10 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl">
            <div
            className="relative h-48 rounded-t-2xl bg-brand-green-500 bg-cover bg-center p-4"
            style={{ backgroundImage: "url('/images/textura1.png')" }}
            >
            <button
                onClick={() => setFavorito((f) => !f)}
                aria-label="Favorito"
                className="absolute right-3 top-3 rounded-full bg-white p-1.5 shadow"
            >
          <Heart
            className={`h-4 w-4 ${
              favorito ? "fill-red-500 text-red-500" : "text-red-200"
            }`}
          />
        </button>
        <div className="relative h-full w-full">
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            fill
            className="object-contain p-2"
          />
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-black">
          {producto.nombre}
        </h3>

        <div className="mt-3 flex items-center justify-center gap-4">
          <button
            onClick={() => setCantidad((c) => Math.max(1, c - 1))}
            aria-label="Restar"
            className="rounded-full border border-black p-1 text-black hover:bg-brand-green-100"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-4 text-center text-black font-semibold">
            {cantidad}
          </span>
          <button
            onClick={() => setCantidad((c) => c + 1)}
            aria-label="Sumar"
            className="rounded-full border border-black p-1 text-black hover:bg-brand-green-100"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <button className="mt-3 w-full rounded-full bg-brand-green-400 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-brand-green-500">
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}