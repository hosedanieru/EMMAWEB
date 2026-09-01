// Prisma 7 ya no carga el .env solo. El CLI lo hace a través de
// prisma.config.ts, pero cuando este archivo se corre directo con tsx
// (npm run seed) nadie lo carga y DATABASE_URL llega vacío: la conexión
// falla con un "client password must be a string" bastante despistante.
import 'dotenv/config';
import { prisma } from '../lib/prisma';

type PresentacionSeed = {
  cantidad: number;
  unidad: string;
  unidadesPorPaquete: number;
  precio: number;
};

type ProductoSeed = {
  nombre: string;
  slug: string;
  descripcion: string;
  presentaciones: PresentacionSeed[];
};

const productos: ProductoSeed[] = [
  {
    nombre: 'Arroz Blanco',
    slug: 'arroz-blanco',
    descripcion: 'Descripción pendiente de definir.',
    presentaciones: [
      { cantidad: 460, unidad: 'g', unidadesPorPaquete: 1, precio: 1600 },
      { cantidad: 460, unidad: 'g', unidadesPorPaquete: 25, precio: 39375 },
      { cantidad: 500, unidad: 'g', unidadesPorPaquete: 1, precio: 1680 },
      { cantidad: 500, unidad: 'g', unidadesPorPaquete: 25, precio: 42000 },
      { cantidad: 10, unidad: 'kg', unidadesPorPaquete: 1, precio: 36750 },
      { cantidad: 50, unidad: 'kg', unidadesPorPaquete: 1, precio: 165000 },
    ],
  },
  {
    nombre: 'Lenteja',
    slug: 'lenteja',
    descripcion: 'Descripción pendiente de definir.',
    presentaciones: [
      { cantidad: 460, unidad: 'g', unidadesPorPaquete: 1, precio: 1911 },
      { cantidad: 460, unidad: 'g', unidadesPorPaquete: 25, precio: 47775 },
      { cantidad: 500, unidad: 'g', unidadesPorPaquete: 1, precio: 2047.5 },
      { cantidad: 500, unidad: 'g', unidadesPorPaquete: 25, precio: 51187.5 },
    ],
  },
  {
    nombre: 'Frijol Cargamanto V',
    slug: 'frijol-cargamanto-v',
    descripcion: 'Descripción pendiente de definir.',
    presentaciones: [
      { cantidad: 460, unidad: 'g', unidadesPorPaquete: 1, precio: 3659.25 },
      { cantidad: 460, unidad: 'g', unidadesPorPaquete: 25, precio: 91481.25 },
    ],
  },
  {
    nombre: 'Frijol Cargamanto N',
    slug: 'frijol-cargamanto-n',
    descripcion: 'Descripción pendiente de definir.',
    presentaciones: [
      { cantidad: 460, unidad: 'g', unidadesPorPaquete: 1, precio: 5932.5 },
      { cantidad: 460, unidad: 'g', unidadesPorPaquete: 25, precio: 148312.5 },
    ],
  },
  {
    nombre: 'Arveja Verde',
    slug: 'arveja-verde',
    descripcion: 'Descripción pendiente de definir.',
    presentaciones: [
      { cantidad: 500, unidad: 'g', unidadesPorPaquete: 1, precio: 1680 },
      { cantidad: 500, unidad: 'g', unidadesPorPaquete: 25, precio: 42000 },
    ],
  },
  {
    nombre: 'Frijol Bola Roja',
    slug: 'frijol-bola-roja',
    descripcion: 'Descripción pendiente de definir.',
    presentaciones: [
      { cantidad: 500, unidad: 'g', unidadesPorPaquete: 1, precio: 7980 },
      { cantidad: 500, unidad: 'g', unidadesPorPaquete: 25, precio: 199500 },
    ],
  },
  {
    nombre: 'Garbanzo',
    slug: 'garbanzo',
    descripcion: 'Descripción pendiente de definir.',
    presentaciones: [
      { cantidad: 500, unidad: 'g', unidadesPorPaquete: 1, precio: 2362.5 },
      { cantidad: 500, unidad: 'g', unidadesPorPaquete: 25, precio: 59062.5 },
    ],
  },
  {
    nombre: 'Frijol Radical',
    slug: 'frijol-radical',
    descripcion: 'Descripción pendiente de definir.',
    presentaciones: [
      { cantidad: 500, unidad: 'g', unidadesPorPaquete: 1, precio: 3832.5 },
      { cantidad: 500, unidad: 'g', unidadesPorPaquete: 25, precio: 95812.5 },
    ],
  },
  {
    nombre: 'Maíz Pira',
    slug: 'maiz-pira',
    descripcion: 'Descripción pendiente de definir.',
    presentaciones: [
      { cantidad: 460, unidad: 'g', unidadesPorPaquete: 1, precio: 1837.5 },
      { cantidad: 460, unidad: 'g', unidadesPorPaquete: 25, precio: 45937.5 },
      { cantidad: 500, unidad: 'g', unidadesPorPaquete: 1, precio: 1995 },
      { cantidad: 500, unidad: 'g', unidadesPorPaquete: 25, precio: 49875 },
    ],
  },
];

async function main() {
  const categoriaGranos = await prisma.categoria.upsert({
    where: { slug: 'granos' },
    update: {},
    create: {
      nombre: 'Granos',
      slug: 'granos',
    },
  });

  for (const p of productos) {
    const producto = await prisma.producto.upsert({
      where: { slug: p.slug },
      update: {
        nombre: p.nombre,
        descripcion: p.descripcion,
      },
      create: {
        nombre: p.nombre,
        slug: p.slug,
        descripcion: p.descripcion,
        imagen: '',
        categoriaId: categoriaGranos.id,
      },
    });

    // Antes esto borraba y recreaba todas las presentaciones del producto en
    // cada corrida. Eso tenía dos problemas graves:
    //
    //   1. Reventaba en cuanto existía un pedido. ItemPedido apunta a
    //      Presentacion con llave foránea, así que el deleteMany fallaba con
    //      un error de restricción y dejaba el seed a medias.
    //   2. Borraba el stock. Las presentaciones se recreaban con stock 0, así
    //      que cada corrida del seed vaciaba el inventario que el equipo
    //      hubiera cargado desde el panel.
    //
    // Ahora se emparejan por su clave natural (medida + unidad + unidades por
    // paquete) y solo se actualiza el precio. El stock no se toca nunca: eso
    // lo maneja el panel, no el seed.
    const existentes = await prisma.presentacion.findMany({
      where: { productoId: producto.id },
    });

    for (const pres of p.presentaciones) {
      const yaExiste = existentes.find(
        (e) =>
          Number(e.cantidad) === pres.cantidad &&
          e.unidad === pres.unidad &&
          e.unidadesPorPaquete === pres.unidadesPorPaquete
      );

      if (yaExiste) {
        await prisma.presentacion.update({
          where: { id: yaExiste.id },
          data: { precio: pres.precio },
        });
      } else {
        await prisma.presentacion.create({
          data: { ...pres, productoId: producto.id },
        });
      }
    }

    // Las presentaciones que estén en la base pero no en esta lista se dejan
    // como estén: pueden haberlas creado desde el panel a propósito, y no le
    // toca al seed decidir que sobran.
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });