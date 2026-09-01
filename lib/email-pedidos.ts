import { transporter, remitente } from "./mailer";

type ItemCorreo = {
  nombreProducto: string;
  etiqueta: string;
  cantidad: number;
  precioUnitario: number;
};

type PedidoCorreo = {
  id: string;
  nombreCliente: string;
  correoCliente: string;
  subtotal: number;
  costoEnvio: number;
  total: number;
  items: ItemCorreo[];
};

function formatearCOP(valor: number) {
  return valor.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

function filasHtml(items: ItemCorreo[]) {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:6px 10px;border-bottom:1px solid #e5e5e5;">${item.nombreProducto} (${item.etiqueta})</td>
          <td style="padding:6px 10px;border-bottom:1px solid #e5e5e5;text-align:center;">${item.cantidad}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #e5e5e5;text-align:right;">${formatearCOP(item.precioUnitario)}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #e5e5e5;text-align:right;">${formatearCOP(item.precioUnitario * item.cantidad)}</td>
        </tr>`
    )
    .join("");
}

function tablaHtml(pedido: PedidoCorreo) {
  return `
    <table style="width:100%;border-collapse:collapse;font-family:sans-serif;font-size:14px;">
      <thead>
        <tr style="background:#f5f5f5;">
          <th style="padding:6px 10px;text-align:left;">Producto</th>
          <th style="padding:6px 10px;text-align:center;">Cant.</th>
          <th style="padding:6px 10px;text-align:right;">Precio</th>
          <th style="padding:6px 10px;text-align:right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>${filasHtml(pedido.items)}</tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="padding:6px 10px;text-align:right;">Subtotal</td>
          <td style="padding:6px 10px;text-align:right;">${formatearCOP(pedido.subtotal)}</td>
        </tr>
        <tr>
          <td colspan="3" style="padding:6px 10px;text-align:right;">Envío</td>
          <td style="padding:6px 10px;text-align:right;">${
            pedido.costoEnvio === 0 ? "Gratis" : formatearCOP(pedido.costoEnvio)
          }</td>
        </tr>
        <tr>
          <td colspan="3" style="padding:8px 10px;text-align:right;font-weight:bold;border-top:1px solid #e5e5e5;">Total</td>
          <td style="padding:8px 10px;text-align:right;font-weight:bold;border-top:1px solid #e5e5e5;">${formatearCOP(pedido.total)}</td>
        </tr>
      </tfoot>
    </table>`;
}

function listaTexto(items: ItemCorreo[]) {
  return items
    .map(
      (i) =>
        `- ${i.nombreProducto} (${i.etiqueta}) x${i.cantidad}: ${formatearCOP(i.precioUnitario * i.cantidad)}`
    )
    .join("\n");
}

export async function enviarCorreoResultadoPedido(
  pedido: PedidoCorreo,
  resultado: "APROBADO" | "RECHAZADO",
  linkPago?: string | null
) {
  const esAprobado = resultado === "APROBADO";
  const numeroPedido = pedido.id.slice(-8).toUpperCase();

  const asunto = esAprobado
    ? `Confirmamos tu pedido #${numeroPedido} — Emma Colombia`
    : `Tu pedido #${numeroPedido} fue cancelado — Emma Colombia`;

  const mensajePrincipal = esAprobado
    ? linkPago
      ? "Recibimos tu pedido. Ya puedes pagarlo de forma segura con el botón de abajo."
      : "Recibimos tu pedido. En breve nos pondremos en contacto para coordinar el pago y la entrega."
    : "Tu pedido fue cancelado. Si ya realizaste el pago, por favor contáctanos para resolverlo.";

  const botonPagoHtml = linkPago
    ? `
      <div style="text-align:center;margin:28px 0;">
        <a href="${linkPago}" style="background:#e07a2f;color:#fff;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:bold;display:inline-block;">
          Pagar ahora
        </a>
      </div>`
    : "";

  const html = `
    <div style="font-family:sans-serif;color:#222;max-width:600px;margin:0 auto;">
      <h2 style="color:#2e5c34;">Hola ${pedido.nombreCliente},</h2>
      <p>${mensajePrincipal}</p>
      <p style="color:#666;font-size:13px;">Pedido #${numeroPedido}</p>
      ${botonPagoHtml}
      <h3>Detalle del pedido</h3>
      ${tablaHtml(pedido)}
      <p style="margin-top:24px;color:#666;font-size:12px;">
        Este es un mensaje automático de Emma Colombia. Si tienes dudas, respondé a este correo.
      </p>
    </div>`;

  const texto = `Hola ${pedido.nombreCliente},

${mensajePrincipal}

Pedido #${numeroPedido}
${linkPago ? `\nPagar ahora: ${linkPago}\n` : ""}
${listaTexto(pedido.items)}

Subtotal: ${formatearCOP(pedido.subtotal)}
Envío: ${pedido.costoEnvio === 0 ? "Gratis" : formatearCOP(pedido.costoEnvio)}
Total: ${formatearCOP(pedido.total)}

Emma Colombia`;

  await transporter.sendMail({
    from: remitente,
    to: pedido.correoCliente,
    subject: asunto,
    text: texto,
    html,
  });
}
