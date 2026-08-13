import { Sun, Recycle, FileX } from "lucide-react";

const hitos = [
  {
    icon: Sun,
    title: "Infraestructura Limpia",
    description:
      "Nuestra planta funciona con energía solar y contamos con una flota de vehículos eléctricos para la distribución.",
  },
  {
    icon: Recycle,
    title: "Economía Circular",
    description:
      "Optimizamos el uso de nuestros residuos a través de la Logística Inversa, reduciendo el impacto de cada entrega.",
  },
  {
    icon: FileX,
    title: "Cero Papel",
    description:
      'Con nuestra política "No Papper", usamos herramientas tecnológicas para eliminar el consumo de papel en nuestros procesos.',
  },
];

export default function HitosAmbientales() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-brand-green-500">
          Nuestros hitos
        </span>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-brand-green-500">
          Comprometidos con el planeta
        </h2>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {hitos.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-2xl border border-brand-olive-100 bg-white p-8 text-center shadow-sm transition hover:shadow-md"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-olive-100">
              <Icon className="h-8 w-8 text-brand-olive-500" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-brand-green-500">
              {title}
            </h3>
            <p className="mt-3 text-sm text-neutral-600">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}