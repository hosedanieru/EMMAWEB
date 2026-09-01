import Hero from "./_components/Hero";
import TrustStrip from "./_components/TrustStrip";
import FeaturedProducts from "./_components/FeaturedProducts";
import NacimosEnElCampo from "./_components/NacimosEnElCampo";
import Proceso from "./_components/Proceso";
import CalidadQueSeSiente from "./_components/CalidadQueSeSiente";
import Sostenibilidad from "./_components/Sostenibilidad";
import Faq from "./_components/Faq";
import { prisma } from "@/lib/prisma";

// Sin esto, Next.js prerenderiza esta página como estática en el momento
// del build: los productos destacados quedarían "congelados" con los datos
// de ese instante, y un cambio hecho después desde el panel de Admin no se
// vería en el sitio hasta el próximo despliegue.
export const dynamic = "force-dynamic";

export default async function Home() {
  const productosDestacados = await prisma.producto.findMany({
    where: { destacado: true, activo: true },
    include: {
      categoria: true,
      presentaciones: {
        where: { activo: true },
        orderBy: { precio: "asc" },
        take: 1,
      },
    },
    orderBy: { nombre: "asc" },
    take: 10,
  });

  // FeaturedProducts es un Client Component: los props que recibe tienen
  // que ser serializables, y un Decimal de Prisma no lo es. Por eso se
  // saca "presentaciones" del spread — no solo se ignora en el tipo, se
  // quita del objeto real que cruza la frontera servidor→cliente.
  const productosConPrecio = productosDestacados.map((producto) => {
    const { presentaciones, ...resto } = producto;
    return {
      ...resto,
      precioDesde: presentaciones[0] ? Number(presentaciones[0].precio) : null,
    };
  });

  return (
    <div>
      <Hero />
      <TrustStrip />
      <FeaturedProducts productos={productosConPrecio} />
      <NacimosEnElCampo />
      <Proceso />
      <CalidadQueSeSiente />
      <Sostenibilidad />
      <Faq />
    </div>
  );
}
