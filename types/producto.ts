import type {Producto, Categoria} from "@/generated/prisma";

export type ProductoConCategoria = Producto & {
  categoria: Categoria;
};

// precioDesde es el precio de la presentación activa más barata, ya
// convertido a number (las tarjetas nunca reciben un Decimal de Prisma).
export type ProductoConPrecio = ProductoConCategoria & {
  precioDesde: number | null;
};