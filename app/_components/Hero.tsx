"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Leaf } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

// Estas rutas apuntan a los mismos archivos que usa el catálogo. Antes había
// una segunda copia en /images/products/ que era byte a byte idéntica: cinco
// PNG de más de 20 MB duplicados, 113 MB de más en el repositorio y en cada
// despliegue. Peor que el peso: eran dos copias que podían quedar desfasadas,
// y el home habría seguido mostrando la foto vieja de un producto ya
// actualizado sin que nadie entendiera por qué.
const slidesBase = [
  { id: 1, imagen: "/images/arroz-500g-frontal.png", colorHex: "#19B5DC" },
  { id: 2, imagen: "/images/lenteja-500g-frontal.png", colorHex: "#A67C52" },
  { id: 3, imagen: "/images/frijolradical-500g-frontal.png", colorHex: "#8B1E3F" },
  { id: 4, imagen: "/images/garbanzo-500g-frontal.png", colorHex: "#D2B48C" },
  { id: 5, imagen: "/images/maiz-500g-frontal.png", colorHex: "#F28C38" },
];

const DURACION_MS = 7000;

export default function Hero() {
  const { t } = useLocale();
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);

  const slides = slidesBase.map((slide, i) => ({
    ...slide,
    titulo: t.home.heroSlides[i].titulo,
  }));

  useEffect(() => {
    if (pausado) return;
    // slidesBase y no slides: son la misma longitud, pero slides se
    // reconstruye en cada render (depende del idioma) mientras que slidesBase
    // es una constante del módulo. Usar la constante deja claro que el
    // intervalo no necesita recrearse y evita depender de un valor cambiante.
    const intervalo = window.setInterval(() => {
      setIndice((prev) => (prev + 1) % slidesBase.length);
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
    // La palabra se repite VARIAS VECES pegada a sí misma (sin espacio) en
    // cada línea, en vez de depender de que el ancho del tile coincida con
    // el ancho del texto — así nunca queda un hueco en blanco entre una
    // repetición y la siguiente, sin importar qué tan corto o largo sea el
    // nombre del producto en cada idioma.
    const repetido = upper.repeat(4);
    // Ojo: los atributos van con COMILLAS DOBLES a propósito.
    // encodeURIComponent NO escapa la comilla simple ('), así que si el SVG
    // usa comillas simples, esas comillas sobreviven intactas dentro del
    // data URI — y como el CSS de afuera envuelve la URL en
    // url('...'), el navegador corta la URL en la primera comilla que
    // encuentra (justo después de xmlns=) y el background-image entero
    // queda inválido y se ignora en silencio. Con comillas dobles,
    // encodeURIComponent sí las convierte a %22 y no hay conflicto.
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300">` +
      Array.from({length:3}).map((_,i)=>
        `<text x="0" y="${50 + i*100}" dominant-baseline="middle" text-anchor="start" font-family="Poppins, Arial, sans-serif" font-weight="800" font-size="90" fill="${colorRgba}">${repetido}</text>`
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

            {/* Bottom: color sólido */}
            <div
              style={{ backgroundColor: slideActual.colorHex }}
              className={`absolute inset-x-0 bottom-0 h-1/2`}
            />

            {/* Patrón repetido con el nombre del producto: va ENCIMA de las
                dos franjas de color (para cubrir todo el alto, no solo la
                mitad de arriba) pero SIEMPRE detrás de la imagen del
                producto, que vive en un wrapper aparte más abajo en el DOM.
                Relleno de un tono más claro del mismo color (nunca blanco),
                inclinado y repitiéndose en mosaico bien apretado para cubrir
                todo el fondo. Sobredimensionado (-inset-1/4) para que al
                girar siga tapando las esquinas del contenedor. */}
            <div
              className="pointer-events-none absolute -inset-1/4"
              style={{
                backgroundImage: `url('${svgTextPattern(
                  slideActual.titulo,
                  hexToRgba(lightenHex(slideActual.colorHex, 0.35), 0.55)
                )}')`,
                backgroundRepeat: 'repeat',
                backgroundSize: '800px 200px',
                backgroundPosition: '0 0',
                transform: 'rotate(-12deg)',
              }}
            />

            {/* Contenido: mismo padding vertical de antes, pero ahora
                vive DENTRO de la capa de color en lugar de encima de un
                fondo transparente */}
            <div className="relative py-10">
              <div className="relative h-[420px] w-full sm:h-[520px]">
                {/* Imagen del producto, flotando sobre la transición de color */}
                <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
                  <div className="relative h-72 w-72 sm:h-[420px] sm:w-[420px]">
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
                  aria-label={t.home.heroPrevAria}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-brand-ink shadow-md transition-[transform,background-color] duration-[.28s] hover:scale-110 hover:bg-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={irSiguiente}
                  aria-label={t.home.heroNextAria}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-brand-ink shadow-md transition-[transform,background-color] duration-[.28s] hover:scale-110 hover:bg-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

      {/* Sellos inferiores: fijos en las esquinas del Hero */}
      <div className="absolute left-4 bottom-4 z-40 flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-brand-ink shadow">
        <Leaf className="h-3.5 w-3.5 text-brand-green" />
        <span>{t.home.heroBadge}</span>
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
                    aria-label={t.home.heroVerAria(slide.titulo)}
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