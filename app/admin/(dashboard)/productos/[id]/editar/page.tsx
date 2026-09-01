import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { tienePermiso, AccesoDenegado } from "../../_lib/acceso";
import FormularioProducto from "../../_components/FormularioProducto";
import { actualizarProducto } from "../../../_actions/actions";
import type { ProductoFormValues } from "../../_components/schema";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!tienePermiso(session?.user?.role)) {
    return <AccesoDenegado />;
  }

  const { id } = await params;

  const [producto, categorias] = await Promise.all([
    prisma.producto.findUnique({ where: { id }, include: { presentaciones: true } }),
    prisma.categoria.findMany({ orderBy: { nombre: "asc" } }),
  ]);

  if (!producto) {
    notFound();
  }

  const valoresIniciales: ProductoFormValues = {
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    imagen: producto.imagen,
    categoriaId: producto.categoriaId,
    activo: producto.activo,
    destacado: producto.destacado,
    presentaciones: producto.presentaciones.map((p) => ({
      id: p.id,
      cantidad: Number(p.cantidad),
      unidad: p.unidad as "g" | "kg",
      unidadesPorPaquete: p.unidadesPorPaquete,
      precio: Number(p.precio),
      stock: p.stock,
      activo: p.activo,
    })),
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-lg font-semibold text-brand-green">Editar {producto.nombre}</h1>
      <div className="max-w-2xl">
        <FormularioProducto
          categorias={categorias}
          valoresIniciales={valoresIniciales}
          onSubmit={actualizarProducto.bind(null, producto.id)}
        />
      </div>
    </div>
  );
}
