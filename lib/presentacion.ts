export function etiquetaPresentacion(p: {
  cantidad: number;
  unidad: string;
  unidadesPorPaquete: number;
}) {
  const base = `${p.cantidad}${p.unidad}`;
  if (p.unidadesPorPaquete > 1) {
    return `Caja x${p.unidadesPorPaquete} (${base} c/u)`;
  }
  return base;
}