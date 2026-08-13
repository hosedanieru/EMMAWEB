import FormularioContacto from './_components/FormularioContacto';
import InfoContacto from './_components/InfoContacto';

export default function ContactoPage() {
  return (
    <div
      className="bg-[url('/images/paisajeemma.png')] bg-cover bg-center bg-no-repeat"
    >
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg">
          <div className="text-center mb-12">
            <h1 className="text-black md:text-4xl font-bold">Contáctanos</h1>
            <p className="text-gray-900 mt-2">
              Escríbenos y te responderemos a la brevedad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <InfoContacto />
            <FormularioContacto />
          </div>
        </div>
      </main>
    </div>
  );
}