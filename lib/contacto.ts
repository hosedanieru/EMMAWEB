// Datos de contacto de la empresa y armado de los enlaces de WhatsApp y
// correo. Está todo acá para que cambiar un número o un correo sea tocar un
// solo archivo y no perseguirlo por media docena de componentes.
//
// Por qué enlaces y no formularios: enviar correo desde el sitio exigía
// credenciales SMTP del correo institucional que TI no puede entregar
// (implicaba bajarle la seguridad a todo el tenant de Microsoft 365). Un
// enlace a WhatsApp o al cliente de correo no necesita credenciales de
// nada, y además el mensaje llega a un buzón que alguien sí revisa.

export const CONTACTO = {
  // wa.me exige el número en formato internacional SIN +, espacios ni
  // guiones. 57 es el indicativo de Colombia.
  whatsapp: "573113712834",
  // El mismo número pero legible, para mostrarlo en pantalla.
  telefonoVisible: "311 371 2834",

  // Si se deja vacío, los botones de correo no se muestran (ver linkCorreo) y
  // quedan solo los de WhatsApp — es preferible a un botón que abre el cliente
  // de correo con el destinatario en blanco.
  correo: "laura.sanchez@emmacolombia.com",

  direccion:
    "Av. Troncal de Occidente 18 – 76, Bodega B9, Parque Industrial Santo Domingo",

  // El horario NO está acá sino en el diccionario (contacto.horarioValor):
  // es la única de estas cuatro que es prosa traducible. El número, el correo
  // y la dirección se escriben igual en español y en inglés.
} as const;

// Arma el enlace de WhatsApp con el mensaje ya escrito. La persona solo
// tiene que pulsar enviar, que es justo lo que hace que esto funcione mejor
// que un formulario: cero fricción y queda la conversación abierta.
export function linkWhatsApp(mensaje: string): string {
  return `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

// Arma el enlace mailto. Devuelve null si todavía no hay correo configurado,
// para que el componente pueda esconder el botón en vez de ofrecer un enlace
// roto.
//
// Ojo con la codificación: acá NO sirve URLSearchParams porque convierte los
// espacios en "+", y varios clientes de correo los muestran tal cual dentro
// del cuerpo del mensaje. encodeURIComponent los deja como %20, que sí se
// interpreta bien en todos.
export function linkCorreo({
  asunto,
  cuerpo,
}: {
  asunto: string;
  cuerpo?: string;
}): string | null {
  if (!CONTACTO.correo) return null;

  const partes = [`subject=${encodeURIComponent(asunto)}`];
  if (cuerpo) partes.push(`body=${encodeURIComponent(cuerpo)}`);

  return `mailto:${CONTACTO.correo}?${partes.join("&")}`;
}
