import Image from "next/image";

export default function CalidadQueSeSiente() {
  return (
    <section className="relative bg-brand-green-500 pt-24 pb-20 px-6 md:px-16">
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none -translate-y-1">
        <svg
          viewBox="0 0 1440 100"
          className="w-full h-20 fill-[#DFEBAB]"
          preserveAspectRatio="none"
        >
          <path d="M0,40 C360,100 1080,0 1440,40 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-brand-gold-100">
          Calidad que se siente
        </h2>

        <h3 className="text-2xl text-brand-green-100">
          SELECCIONAMOS LO MEJOR DE NUESTRA TIERRA
        </h3>

        <p className="mt-4 text-white">
          Granos frescos, nutritivos y llenos de sabor, con procesos que
          garantizan pureza y conservación natural, siempre pensando en tu
          bienestar.
        </p>

        <a href="/productos" className="mt-4 inline-block text-brand-orange-300 font-semibold">
          CONOCE TODOS NUESTROS PRODUCTOS &gt;&gt;
        </a>
      </div>

      <div className="mt-10 flex justify-center">
        <Image
          src="/images/completodeproductos.png"
          alt="Productos Emma: arroz, frijol, lenteja, maíz y garbanzo"
          width={2500}
          height={1000}
          className="w-full max-w-6xl h-auto"
        />
      </div>
    </section>
  );
}