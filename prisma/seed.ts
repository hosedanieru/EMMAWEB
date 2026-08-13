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

    // Se borran y recrean las presentaciones de este producto en cada corrida
    // (a diferencia del upsert por slug de Producto/Categoria, Presentacion no
    // tiene un campo único natural para hacer upsert individual).
    await prisma.presentacion.deleteMany({
      where: { productoId: producto.id },
    });

    await prisma.presentacion.createMany({
      data: p.presentaciones.map((pres) => ({
        ...pres,
        productoId: producto.id,
      })),
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });