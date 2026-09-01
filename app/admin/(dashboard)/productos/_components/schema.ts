import { z } from "zod";

export const presentacionSchema = z.object({
  id: z.string().optional(),
  cantidad: z.coerce.number().positive("Debe ser mayor a 0"),
  unidad: z.enum(["g", "kg"]),
  unidadesPorPaquete: z.coerce.number().int().min(1, "Mínimo 1"),
  precio: z.coerce.number().positive("Debe ser mayor a 0"),
  stock: z.coerce.number().int().min(0, "No puede ser negativo"),
  activo: z.boolean(),
});

export const productoSchema = z.object({
  nombre: z.string().min(2, "El nombre es muy corto"),
  descripcion: z.string().min(10, "La descripción es muy corta"),
  imagen: z.string().min(1, "La ruta de la imagen es obligatoria"),
  categoriaId: z.string().min(1, "Elegí una categoría"),
  activo: z.boolean(),
  destacado: z.boolean(),
  presentaciones: z
    .array(presentacionSchema)
    .min(1, "Agregá al menos una presentación"),
});

export type ProductoFormValues = z.infer<typeof productoSchema>;
export type PresentacionFormValues = z.infer<typeof presentacionSchema>;
