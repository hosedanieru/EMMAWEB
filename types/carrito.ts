export interface ItemCarrito {
  presentacionId: string;
  productoId: string;
  productoNombre: string;
  productoSlug: string;
  productoImagen: string;
  etiqueta: string; // ej: "500g" o "Caja x25 - 500g"
  precio: number; // ya convertido desde Decimal, snapshot al momento de agregar
  cantidad: number;
  stockDisponible: number; // snapshot para limitar el stepper en UI, NO autoridad final
}

export interface CarritoState {
  items: ItemCarrito[];
}