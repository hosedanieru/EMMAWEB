import Image from "next/image";
import Link from "next/link";

export default function NacimosEnElCampo() {
  return (
    <section className="bg-[#DFEBAB] py-20 px-6 md:px-16">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-center gap-10">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-brand-green-500">
            Nacimos en el campo
          </h2>
          <h2 className="text-4xl font-bold text-brand-green-300">
            COLOMBIANO
          </h2>
          <p className="text-brand-green-500">
            Cada grano de <strong>Emma</strong> es cultivado con tradición y el
            esfuerzo de miles de familias campesinas Cundinamarquesas que ponen
            el corazón en cada cosecha.
          </p>
          <div className="flex gap-4">
            <Link
              href="/conocenos"
              className="rounded-full border border-brand-green-500 px-6 py-2 text-brand-green-500 inline-flex items-center justify-center"
            >
              CONOCE A EMMA
            </Link>
            <Link
              href="/productos"
              className="rounded-full bg-brand-green-500 px-6 py-2 text-white inline-flex items-center justify-center"
            >
              COMPRAR EN LÍNEA
            </Link>
          </div>
        </div>

        <div className="md:w-1/2">
          <div className="relative inline-block">
            <Image
              src="/images/delcampoatucasa.png"
              alt="Mujer campesina cosechando en el campo colombiano"
              width={277}
              height={301}
              className="rounded-2xl"
            />
            <div className="absolute -top-3 -right-3 h-10 w-16 rotate-12 bg-brand-green-300" />
            <div className="absolute -bottom-3 -left-3 h-10 w-16 -rotate-12 bg-brand-green-300" />
          </div>
        </div>
      </div>
    </section>
  );
}