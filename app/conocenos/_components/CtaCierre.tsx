import Link from 'next/link';

export default function CtaConocenos() {
  return (
    <section className="text-center py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          ¿Listo para probar la diferencia Emma?
        </h2>
        <p className="text-white/90 mb-8">
          Somos más que alimentos; somos una compañía comprometida con la calidad colombiana.
        </p>
        <Link
          href="/productos"
          className="inline-block bg-white text-green-800 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
        >
          Explora nuestro portafolio
        </Link>
      </div>
    </section>
  );
}