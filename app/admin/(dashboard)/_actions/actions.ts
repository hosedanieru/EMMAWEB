"use server";

import { prisma } from "@/lib/prisma";
import { productoSchema } from "@/app/admin/(dashboard)/productos/_components/schema";
import { slugify } from "@/lib/slugify";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "./auth-guard";

export async function crearProducto(data: unknown) {
  await requireAdmin();

  const parsed = productoSchema.parse(data);
  const slugBase = slugify(parsed.nombre);

  // Si ya existe un producto con ese slug (nombre repetido o muy parecido),
  // se le agrega un sufijo numérico para no chocar con el @unique del schema.
  let slug = slugBase;
  let contador = 2;
  while (await prisma.producto.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${contador}`;
    contador++;
  }

  const { presentaciones, ...camposProducto } = parsed;

  await prisma.producto.create({
    data: {
      ...camposProducto,
      slug,
      presentaciones: {
        create: presentaciones.map((p) => ({
          cantidad: p.cantidad,
          unidad: p.unidad,
          unidadesPorPaquete: p.unidadesPorPaquete,
          precio: p.precio,
          stock: p.stock,
          activo: p.activo,
        })),
      },
    },
  });

  revalidatePath("/admin/productos");
  revalidatePath("/productos");
  redirect("/admin/productos");
}

export async function actualizarProducto(id: string, data: unknown) {
  await requireAdmin();

  const parsed = productoSchema.parse(data);
  const { presentaciones, ...camposProducto } = parsed;

  // El slug no se toca acá a propósito: si cambiara cada vez que se edita
  // el nombre, cualquier link ya compartido a /productos/[slug] se rompería.
  await prisma.$transaction(async (tx) => {
    await tx.producto.update({ where: { id }, data: camposProducto });

    for (const p of presentaciones) {
      const datosPresentacion = {
        cantidad: p.cantidad,
        unidad: p.unidad,
        unidadesPorPaquete: p.unidadesPorPaquete,
        precio: p.precio,
        stock: p.stock,
        activo: p.activo,
      };

      if (p.id) {
        // El productoId en el where no es decorativo: sin él, un id de
        // presentación manipulado en el formulario permitía sobrescribir el
        // precio o el stock de OTRO producto. updateMany y no update porque
        // update exige que el where sea único y esto son dos columnas.
        const actualizadas = await tx.presentacion.updateMany({
          where: { id: p.id, productoId: id },
          data: datosPresentacion,
        });
        if (actualizadas.count === 0) {
          throw new Error(
            "Una de las presentaciones no pertenece a este producto."
          );
        }
      } else {
        await tx.presentacion.create({ data: { ...datosPresentacion, productoId: id } });
      }
    }
  });

  revalidatePath("/admin/productos");
  revalidatePath("/productos");
  redirect("/admin/productos");
}

export async function cambiarEstadoProducto(id: string, activo: boolean) {
  await requireAdmin();

  await prisma.producto.update({ where: { id }, data: { activo } });

  revalidatePath("/admin/productos");
  revalidatePath("/productos");
}
