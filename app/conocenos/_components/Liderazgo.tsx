import Image from "next/image";

export default function Liderazgo() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Dirección Estratégica</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Un equipo plural y diverso que vive la adaptabilidad y la visión sostenible, guiando el futuro de Emma[cite: 1].
        </p>
      </div>

      {/* Estructura de 3 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        
        {/* Columna Izquierda: Información de Salomón */}
        <div className="text-center md:text-right space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">Salomón Rodriguez</h3>
          <p className="text-green-700 font-semibold uppercase tracking-wider text-sm">
            Presidente Grupo Inlotrans
          </p>
        </div>

        {/* Columna Central: Foto circular de ambos */}
        <div className="flex justify-center">
          <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden shadow-xl border-4 border-green-600">
            {
              <Image 
                src="/images/Jefazos.png" 
                alt="Salomón Rodriguez y Miguel Rodriguez" 
                fill 
                className="object-cover"
              />
            }
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm p-4 text-center">
              [Foto: Salomón y Miguel Rodriguez]
            </div>
          </div>
        </div>

        {/* Columna Derecha: Información de Miguel */}
        <div className="text-center md:text-left space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">Miguel Rodriguez</h3>
          <p className="text-green-700 font-semibold uppercase tracking-wider text-sm">
            CEO
          </p>
        </div>

      </div>

      {/* Cita o Manifiesto de los líderes */}
      <div className="mt-16 max-w-3xl mx-auto text-center border-t border-gray-200 pt-8">
        <p className="text-lg italic text-gray-700 leading-relaxed">
          En EMMA nos levantamos cada día para construir un mundo mejor donde el desarrollo sea para todos.
        </p>
      </div>
    </section>
  );
}