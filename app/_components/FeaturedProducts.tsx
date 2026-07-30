"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Producto } from "@/types/producto";

const productos: Producto[] = [
  { id: 1, nombre: "Arroz 500GR", imagen: "/images/products/arroz.png" },
  { id: 2, nombre: "Lenteja 500GR", imagen: "/images/products/lenteja.png" },
  { id: 3, nombre: "Frijol Radical 500GR", imagen: "/images/products/frijol.png" },
  { id: 4, nombre: "Garbanzo 500GR", imagen: "/images/products/garbanzo.png" },
  { id: 5, nombre: "Maíz Pira 500GR", imagen: "/images/products/maiz.png" },
];

export default function FeaturedProducts() {
  const carruselRef = useRef<HTMLDivElement>(null);

  function desplazar(direccion: "izquierda" | "derecha") {
    const contenedor = carruselRef.current;
    if (!contenedor) return;
    const distancia = contenedor.clientWidth * 0.7;
    contenedor.scrollBy({
      left: direccion === "derecha" ? distancia : -distancia,
      behavior: "smooth",
    });
  }

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-4xl font-extrabold text-brand-orange-400 sm:text-5xl">
          Lo más vendido
        </h2>
        <p className="mt-2 text-xl font-semibold text-brand-green-400">
          Descúbrelo ahora
        </p>
      </div>

      {/* Carrusel con flechas */}
      <div className="relative mt-10">
        <button
          onClick={() => desplazar("izquierda")}
          aria-label="Anterior"
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-brand-green-500 p-3 text-white shadow-lg transition hover:scale-110 hover:bg-brand-green-400 sm:left-6"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div
          ref={carruselRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-15 overflow-x-auto px-6 pb-4 pt-6 sm:justify-center sm:px-20"
        >
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>

        <button
          onClick={() => desplazar("derecha")}
          aria-label="Siguiente"
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-brand-green-500 p-3 text-white shadow-lg transition hover:scale-110 hover:bg-brand-green-400 sm:right-6"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/productos"
          className="text-lg font-bold text-brand-green-400 transition hover:text-brand-green-500 "
        >
          ¡CONOCE TODOS LOS PRODUCTOS!
        </Link>
      </div>
    </section>
  );
}