import { Target, Users, Heart, Zap, Eye } from 'lucide-react';

const valores = [
  { icon: Target, titulo: 'Intrépido', descripcion: 'Persistimos hasta alcanzar metas imposibles.' },
  { icon: Users, titulo: 'Emprendedor', descripcion: 'Unimos talentos para identificar y resolver tus necesidades.' },
  { icon: Heart, titulo: 'Solidario', descripcion: 'Trabajamos unidos con el objetivo de llevar bienestar al hogar.' },
  { icon: Zap, titulo: 'Entusiasta', descripcion: 'Resiliencia y actitud positiva ante cada desafío diario.' },
  { icon: Eye, titulo: 'Visionario', descripcion: 'Acción e innovación constante para el futuro de tu salud.' },
];

export default function ValoresConocenos() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold">Nuestra ADN: Valores con Propósito</h2>
        <p className="text-gray-600 mt-2">La brújula que guía cada producto que llega a tu mesa.</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {valores.slice(0, 3).map((valor) => {
            const Icon = valor.icon;
            return (
              <div key={valor.titulo} className="max-w-sm w-full mx-auto flex flex-col items-center text-center gap-3 p-6 bg-white rounded-xl shadow-sm">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100 text-green-700">
                  <Icon size={26} />
                </div>
                <h3 className="font-semibold text-lg">{valor.titulo}</h3>
                <p className="text-gray-600 text-sm">{valor.descripcion}</p>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-8">
          {valores.slice(3).map((valor) => {
            const Icon = valor.icon;
            return (
              <div key={valor.titulo} className="max-w-sm w-full flex flex-col items-center text-center gap-3 p-6 bg-white rounded-xl shadow-sm">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100 text-green-700">
                  <Icon size={26} />
                </div>
                <h3 className="font-semibold text-lg">{valor.titulo}</h3>
                <p className="text-gray-600 text-sm">{valor.descripcion}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}