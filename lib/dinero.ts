// El peso colombiano no circula centavos: no existe una moneda de $0,50. Pero
// varias presentaciones tienen precios con fracción en la base (2047.5,
// 3659.25, 91481.25...), porque salen de aplicarle un margen a un costo.
//
// Si esas fracciones llegan hasta el cobro pasan dos cosas malas:
//
//   1. Wompi recibe un monto en centavos que no es múltiplo de 100, y el
//      cliente ve un cobro de $10.977,75 — que no se puede pagar en efectivo
//      ni cuadrar en una caja.
//   2. La factura no cuadra: 3 × $2.047,50 = $6.142,50 es aritmética correcta
//      pero impresentable en un documento contable colombiano.
//
// La decisión acá es redondear el PRECIO UNITARIO al peso entero antes de
// multiplicar, y no el subtotal. Así la factura es internamente consistente
// (3 × $2.048 = $6.144, la multiplicación se puede verificar a mano) y la
// diferencia máxima es de medio peso por unidad. Redondear el subtotal daría
// un total marginalmente más exacto, pero dejaría una factura donde la
// multiplicación no cuadra, que es peor para quien la audita.

/** Redondea a peso entero. Es el único lugar donde se decide el redondeo. */
export function pesosEnteros(valor: number): number {
  return Math.round(valor);
}

/**
 * Convierte pesos a centavos para Wompi. Se espera que `pesos` ya sea entero
 * (pasó por pesosEnteros); el Math.round de acá solo protege contra el error
 * de coma flotante que deja un 6144.000000000001 después de sumar.
 */
export function aCentavos(pesos: number): number {
  return Math.round(pesos * 100);
}

/** Formatea para mostrar: "$6.144". Sin decimales, que es como se escribe el COP. */
export function formatearCOP(valor: number): string {
  return `$${Math.round(valor).toLocaleString("es-CO")}`;
}
