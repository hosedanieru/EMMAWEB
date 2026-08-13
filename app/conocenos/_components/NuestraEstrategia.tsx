import { Target, Rocket } from 'lucide-react';

export default function NuestraEstrategia() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Misión */}
        <div className="p-8 bg-green-50 rounded-2xl border border-green-100">
          <div className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center mb-6">
            <Target size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h2>
          <p className="text-gray-600 leading-relaxed">
            Proporcionar bienestar a través de una amplia variedad de productos alimenticios con altos estándares de calidad e inocuidad. Nos dedicamos a fomentar un estilo de vida sostenible, llevando el campo directamente a la casa de nuestros consumidores[cite: 1].
          </p>
        </div>

        {/* Visión */}
        <div className="p-8 bg-green-50 rounded-2xl border border-green-100">
          <div className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center mb-6">
            <Rocket size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Visión</h2>
          <p className="text-gray-600 leading-relaxed">
            Ser líderes en el mercado de alimentos en Colombia y el mundo, ofreciendo soluciones innovadoras, saludables y sostenibles que inspiren a las personas a adoptar un estilo de vida consciente, contribuyendo a la salud de las generaciones futuras[cite: 1].
          </p>
        </div>
      </div>
    </section>
  );
}