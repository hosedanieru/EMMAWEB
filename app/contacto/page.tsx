import { prisma } from "@/lib/prisma";
import Reveal from "@/components/Reveal";
import Encabezado from "./_components/Encabezado";
import InfoContacto from "./_components/InfoContacto";
import Consultas from "./_components/Consultas";
import Vacantes from "./_components/Vacantes";
import Proveedores from "./_components/Proveedores";

export const metadata = {
  title: "Contacto | Emma Colombia",
  description:
    "Escríbenos por WhatsApp o correo: consultas y pedidos, vacantes de empleo y registro de proveedores.",
};

// Esta página absorbió lo que antes era /trabaja-con-nosotros. Las dos
// resolvían el mismo problema —hablar con la empresa— y mantenerlas
// separadas obligaba a adivinar por cuál entrar.
//
// Ya no hay formularios: los tres que había (contacto, postulación y
// proveedores) dependían de credenciales SMTP del correo institucional que
// TI no puede entregar, y el de contacto además solo guardaba en una tabla
// que nadie leía. Ahora todo son enlaces directos a WhatsApp y al correo,
// con el mensaje ya redactado. Ver lib/contacto.ts.

// Sin esto, Next.js prerenderiza la página como estática en el build y una
// vacante publicada después desde el panel de Admin no aparecería hasta el
// próximo despliegue.
export const dynamic = "force-dynamic";

export default async function ContactoPage() {
  const vacantes = await prisma.vacante.findMany({
    where: { activa: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      titulo: true,
      area: true,
      ubicacion: true,
      tipo: true,
      descripcion: true,
    },
  });

  return (
    <main className="bg-brand-paper py-[118px]">
      <div className="mx-auto max-w-[1180px] px-7">
        <Encabezado />

        <Reveal className="mb-8">
          <InfoContacto />
        </Reveal>

        <div className="divide-y divide-brand-line-2">
          <Consultas />
          <Vacantes vacantes={vacantes} />
          <Proveedores />
        </div>
      </div>
    </main>
  );
}
