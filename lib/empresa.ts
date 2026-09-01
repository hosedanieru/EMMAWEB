// Identificación legal de la empresa, para los documentos de /legal.
//
// Está aparte de lib/contacto.ts porque son cosas distintas: contacto.ts tiene
// los canales por los que se le escribe a Emma (WhatsApp, correo), y esto es
// la identidad jurídica que la ley exige publicar en un comercio electrónico.
//
// ─────────────────────────────────────────────────────────────────────────
// PENDIENTE: los campos marcados abajo los tiene que confirmar la empresa.
// El NIT no estaba en ninguna parte del proyecto (ni siquiera en el pie de
// página, donde el texto dice literalmente "NIT" sin número). Mientras estén
// vacíos, las páginas legales muestran un aviso en vez del dato.
// ─────────────────────────────────────────────────────────────────────────

export const EMPRESA = {
  razonSocial: "Compañía Colombiana de Alimentos Emma S.A.S.",
  nombreComercial: "Emma Colombia",

  /** PENDIENTE. Formato: 900.123.456-7 */
  nit: "",

  domicilio:
    "Av. Troncal de Occidente 18 – 76, Bodega B9, Parque Industrial Santo Domingo",
  ciudad: "Cundinamarca, Colombia",

  correoContacto: "laura.sanchez@emmacolombia.com",
  telefono: "311 371 2834",

  /** Correo al que llegan las solicitudes de habeas data. */
  correoDatos: "laura.sanchez@emmacolombia.com",

  /** Fecha desde la que rigen los documentos legales publicados. */
  vigenteDesde: "1 de septiembre de 2026",
} as const;

/** Muestra el NIT o un aviso, para no imprimir un campo vacío. */
export function nitVisible(): string {
  return EMPRESA.nit || "NIT pendiente de publicación";
}
