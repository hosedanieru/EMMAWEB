export default function HeroSostenibilidad() {
  return (
    <section className="relative overflow-hidden bg-brand-olive-400 py-20 px-6">
      {/* Marca de agua decorativa */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10rem] md:text-[14rem] font-extrabold leading-none text-brand-olive-300/30"
      >
        #Sostenibilidad
      </span>

      <div className="relative mx-auto max-w-3xl text-center">
        <h1 className="text-white">
          <span className="block text-4xl md:text-5xl font-extrabold">
            En Emma,
          </span>
          <span className="mt-1 block text-2xl md:text-3xl font-light tracking-wide">
            EL FUTURO ES SOSTENIBLE
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-white/90">
          Con nuestra flota eléctrica y planta con energía solar, trabajamos
          por un futuro más limpio y responsable con el planeta.
        </p>

        <div className="relative mx-auto mt-10 max-w-xl">
          <div className="mx-auto mb-2 h-0 w-0 border-x-8 border-x-transparent border-b-[14px] border-b-brand-olive-500" />

          <img
            src="/images/flotacarroselectricos.png"
            alt="Flota eléctrica de Emma en carretera"
            className="w-full rounded-2xl shadow-lg"
          />

          <div className="mx-auto mt-2 h-0 w-0 border-x-8 border-x-transparent border-t-[14px] border-t-brand-olive-500" />
        </div>
      </div>
    </section>
  );
}