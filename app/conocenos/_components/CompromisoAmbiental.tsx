export default function NuestraEsencia() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Un legado de unión y talento
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Emma nace de la visión de Salomón Rodriguez y Miguel Rodriguez, quienes unieron su pasión y experiencia para transformar la industria alimentaria. Nuestro crecimiento no es casualidad: es el resultado de potenciar el talento humano.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Actualmente, el 90% de nuestro equipo se encuentra en formación constante, garantizando que cada proceso, desde el origen en el campo hasta tu hogar, sea ejecutado con la excelencia que caracteriza a nuestra compañía.
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-sm">
            [Imagen: Equipo de trabajo o fotografía de fundadores]
          </span>
        </div>
      </div>
    </section>
  );
}