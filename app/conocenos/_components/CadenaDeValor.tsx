export default function CadenaDeValor() {
  const pasos = [
    { 
      nombre: 'COMPRAR', 
      bgColor: 'bg-[#1b4332]' // Verde oscuro corporativo
    },
    { 
      nombre: 'PRODUCIR', 
      bgColor: 'bg-[#e67e22]' // Naranja dinámico
    },
    { 
      nombre: 'DISTRIBUIR', 
      bgColor: 'bg-[#8ac926]' // Verde claro / Lima
    },
    { 
      nombre: 'VENDER', 
      bgColor: 'bg-[#f3b913]' // Amarillo de marca
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-10 py-4">
      <div className="text-center mb-12">
        <h2 className="text-6xl font-bold text-black mb-6">Nuestra Cadena de Valor</h2>
        <p className="text-gray-600 text-2xl">Del campo a tu casa, garantizando calidad e inocuidad en cada etapa.</p>
      </div>

      {/* Contenedor de la cadena en formato de flechas secuenciales */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full gap-2 md:gap-0">
        {pasos.map((paso, index) => (
          <div
            key={paso.nombre}
            className={`relative flex items-center justify-center text-white font-bold tracking-wider py-5 px-6 w-full md:w-1/4 text-center shadow-sm transition-all duration-300 hover:brightness-105 ${paso.bgColor} ${
              index !== 0 ? 'md:-ml-0' : ''
            }`}
            style={{
              // Genera la forma de flecha horizontal (chevron) en pantallas medianas en adelante
              clipPath: 'polygon(0% 0%, calc(100% - 40px) 0%, 100% 50%, calc(100% - 40px) 100%, 0% 100%)'
            }}
          >
            <span className="relative z-60 text-lg md:text-xl drop-shadow">
              {paso.nombre}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}