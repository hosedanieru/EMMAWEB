"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Leaf } from "lucide-react";

const slides = [
  {
    id: 1,
    imagen: "/images/products/arroz.png",
    titulo: "Arroz",
    colorHex: "#19B5DC",
  },
  {
    id: 2,
    imagen: "/images/products/lenteja.png",
    titulo: "Lenteja",
    colorHex: "#A67C52",
  },
  {
    id: 3,
    imagen: "/images/products/frijol.png",
    titulo: "Frijol Radical",
    colorHex: "#8B1E3F",
  },
  {
    id: 4,
    imagen: "/images/products/garbanzo.png",
    titulo: "Garbanzos",
    colorHex: "#D2B48C",
  },
  {
    id: 5,
    imagen: "/images/products/maiz.png",
    titulo: "Maíz Pira",
    colorHex: "#F28C38",
  },
];

const DURACION_MS = 7000;

export default function Hero() {
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (pausado) return;
    const intervalo = window.setInterval(() => {
      setIndice((prev) => (prev + 1) % slides.length);
    }, DURACION_MS);
    return () => window.clearInterval(intervalo);
  }, [pausado]);

  const slideActual = slides[indice];

  function hexToRgba(hex: string, alpha: number) {
    const cleaned = hex.replace('#', '');
    const bigint = parseInt(cleaned, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function lightenHex(hex: string, amount = 0.6) {
    const cleaned = hex.replace('#', '');
    const num = parseInt(cleaned, 16);
    let r = (num >> 16) & 255;
    let g = (num >> 8) & 255;
    let b = num & 255;
    r = Math.round(r + (255 - r) * amount);
    g = Math.round(g + (255 - g) * amount);
    b = Math.round(b + (255 - b) * amount);
    const toHex = (v: number) => v.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function svgTextPattern(text: string, colorRgba: string) {
    const upper = text.toUpperCase();
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='1 1 1200 300'>` +
      Array.from({length:6}).map((_,i)=>
        `<text x='50%' y='${30 + i*50}' dominant-baseline='middle' text-anchor='middle' font-family='Inter, Arial, sans-serif' font-weight='800' font-size='80' fill='${colorRgba}'>${upper}</text>`
      ).join('') + `</svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  function irAnterior() {
    setIndice((prev) => (prev - 1 + slides.length) % slides.length);
  }
  function irSiguiente() {
    setIndice((prev) => (prev + 1) % slides.length);
  }

  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setPausado(true)}
        onMouseLeave={() => setPausado(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slideActual.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="relative"
          >
            {/* Fondo: ahora cubre TODA la sección (incluyendo el padding
                superior/inferior y la fila de indicadores), no solo el
                bloque del carrusel. Así no queda la franja verde de la
                página asomando arriba y abajo. */}
            {/* Top: color sólido más claro */}
            <div
              style={{ backgroundColor: lightenHex(slideActual.colorHex, 0.8) }}
              className={`absolute inset-x-0 top-0 h-1/2`}
            />

            {/* Patrón repetido con el nombre del producto */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url('${svgTextPattern(
                  slideActual.titulo,
                  hexToRgba(slideActual.colorHex, 0.14)
                )}')`,
                backgroundRepeat: 'repeat',
                backgroundSize: '420px 220px',
                backgroundPosition: '0 0',
                transform: 'rotate(-12deg)',
                opacity: 1,
              }}
            />

            {/* Bottom: color sólido */}
            <div
              style={{ backgroundColor: slideActual.colorHex }}
              className={`absolute inset-x-0 bottom-0 h-1/2`}
            />

            {/* Contenido: mismo padding vertical de antes, pero ahora
                vive DENTRO de la capa de color en lugar de encima de un
                fondo transparente */}
            <div className="relative py-10">
              <div className="relative h-[420px] w-full sm:h-[520px]">
                {/* Texto grande de fondo */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                  <span className="text-5xl font-black uppercase leading-[0.95] text-white/95 drop-shadow-sm sm:text-7xl">
                    {slideActual.titulo.split(" ")[0]}
                  </span>
                  <span className="text-5xl font-black uppercase leading-[0.95] text-white/95 drop-shadow-sm sm:text-7xl">
                    {slideActual.titulo.split(" ").slice(1).join(" ")}
                  </span>
                </div>

                {/* Imagen del producto, flotando sobre la transición de color */}
                <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
                  <div className="relative h-56 w-56 sm:h-72 sm:w-72">
                    <Image
                      src={slideActual.imagen}
                      alt={slideActual.titulo}
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority={indice === 0}
                    />
                  </div>
                </div>

                {/* Sellos inferiores (movidos a nivel de sección) */}

                {/* Flechas */}
                <button
                  onClick={irAnterior}
                  aria-label="Anterior"
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-700 shadow-md transition hover:scale-110 hover:bg-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={irSiguiente}
                  aria-label="Siguiente"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-700 shadow-md transition hover:scale-110 hover:bg-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

      {/* Sellos inferiores: fijos en las esquinas del Hero */}
      <div className="absolute left-4 bottom-4 z-40 flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow">
        <Leaf className="h-3.5 w-3.5 text-brand-green-400" />
        <span>Del campo a tu casa</span>
      </div>

      <div className="absolute right-4 bottom-4 z-40">
        <Image
          src="/images/logo-emma.png"
          alt="Emma"
          width={92}
          height={32}
          className="h-7 w-auto opacity-95"
        />
      </div>

      {/* Indicadores: ahora quedan sobre la misma capa de color
                  del slide, en vez de sobre el fondo transparente de la
                  página */}
              <div className="mt-4 flex justify-center gap-2">
                {slides.map((slide, i) => (
                  <button
                    key={slide.id}
                    onClick={() => setIndice(i)}
                    aria-label={`Ver ${slide.titulo}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === indice
                        ? "w-8 bg-white"
                        : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}