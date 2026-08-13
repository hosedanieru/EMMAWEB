import Image from "next/image";
import Link from "next/link";

interface SostenibilidadProps {
  title?: string;
  subtitle?: string;
  description?: string;
  imageSrc: string;
  imageAlt: string;
  watermarkText?: string;
}

export default function Sostenibilidad({
  title = "En Emma,",
  subtitle = "EL FUTURO ES SOSTENIBLE",
  description = "Con nuestra flota eléctrica y planta con energía solar, trabajamos por un futuro más limpio y responsable con el planeta.",
  imageSrc="/images/Group 214.png",
  imageAlt = "Sede Emma",
  watermarkText = "#Sostenibilidad",
}: SostenibilidadProps) {
  return (
    <section className="relative overflow-hidden bg-[#F3B913] py-16 sm:py-22">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/3 left-[-10%] h-[140%] w-[70%] rounded-full bg-[#E5AC08] opacity-60 blur-[2px] sm:left-0"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 w-full select-none overflow-hidden"
      >
        <p className="whitespace-nowrap text-[14.4vw] font-extrabold leading-none tracking-tight text-[#E5AC08]/40 sm:text-[9.6vw]">
          {Array(6).fill(watermarkText).join(" ")}
        </p>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl font-extrabold leading-none text-[#FFF6D8] sm:text-5xl">
          {title}
        </h2>
        <p className="mt-1 text-2xl font-light tracking-wide text-white sm:text-3xl">
          {subtitle}
        </p>
        <p className="mx-auto mt-4 max-w-xl text-xs font-medium text-white/90 sm:text-sm">
          {description}
        </p>
        <div className="mt-6">
          <Link
            href="/sostenibilidad"
            aria-label="Sostenibilidad"
            className="inline-flex items-center gap-1 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
          >
            Sostenibilidad
          </Link>
        </div>
      </div>

      <div className="relative z-10 mt-10 px-6">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={1400}
          height={1000}
          className="mx-auto w-full rounded-sm object-cover shadow-xl"
        />
      </div>
    </section>
  );
}