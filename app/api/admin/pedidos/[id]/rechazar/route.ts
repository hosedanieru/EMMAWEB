import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { enviarCorreoResultadoPedido } from "@/lib/email-pedidos";
import { smtpConfigurado } from "@/lib/mailer";

const ROLES_PERMITIDOS = ["ADMIN", "FACTURACION"];

// Comprueba que la petición venga del propio sitio. La cookie de sesión de
// Auth.js es SameSite=Lax, que ya bloquea los POST desde otro origen en
// navegadores actuales — pero esa es una defensa que nadie eligió y que
// depende del navegador del usuario. Esto la hace explícita.
function mismoOrigen(request: Request): boolean {
  const origen = request.headers.get("origin");
  // Sin Origin no es una petición de navegador entre sitios (un curl, por
  // ejemplo), y esa ya la frena la sesión.
  if (!origen) return true;

  const permitido = process.env.APP_URL?.trim().replace(/\/$/, "");
  if (permitido) return origen === permitido;

  // Sin APP_URL configurado se compara contra el host de la propia petición,
  // que es lo mejor que se puede hacer en desarrollo.
  try {
    return new URL(origen).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || !ROLES_PERMITIDOS.includes(session.user.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  if (!mismoOrigen(request)) {
    return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
  }

  const { id } = await params;

  // Los pedidos se aprueban solos al crearse (ver app/api/pedidos/route.ts)
  // y el stock no se toca hasta que el pago se confirma por webhook — así
  // que "rechazar" acá es en realidad "cancelar un pedido que todavía no
  // pagó" (ej. se ve sospechoso, el cliente se arrepintió, quedó
  // abandonado). El updateMany condicionado a pagadoEn: null evita
  // cancelar un pedido que ya fue pagado — eso requeriría un reembolso,
  // que no se maneja desde acá.
  const resultado = await prisma.pedido.updateMany({
    where: { id, estado: "APROBADO", pagadoEn: null },
    data: { estado: "RECHAZADO" },
  });

  if (resultado.count === 0) {
    return NextResponse.json(
      { error: "Este pedido ya fue pagado, cancelado, o no existe." },
      { status: 409 }
    );
  }

  // Si el correo falla, no revertimos la cancelación. Y si no hay
  // credenciales SMTP ni se intenta, para no llenar el log de errores
  // esperables (ver lib/mailer.ts).
  if (smtpConfigurado) {
    try {
      const pedido = await prisma.pedido.findUnique({
        where: { id },
        include: { items: true },
      });

      if (pedido) {
        await enviarCorreoResultadoPedido(
          {
            id: pedido.id,
            nombreCliente: pedido.nombreCliente,
            correoCliente: pedido.correoCliente,
            subtotal: Number(pedido.subtotal),
            costoEnvio: Number(pedido.costoEnvio),
            total: Number(pedido.total),
            items: pedido.items.map((item) => ({
              nombreProducto: item.nombreProducto,
              etiqueta: item.etiqueta,
              cantidad: item.cantidad,
              precioUnitario: Number(item.precioUnitario),
            })),
          },
          "RECHAZADO"
        );
      }
    } catch (error) {
      console.error("Error al enviar correo de rechazo:", error);
    }
  }

  return NextResponse.json({ success: true });
}
