import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verificarFirmaEvento } from "@/lib/wompi";
import { aCentavos } from "@/lib/dinero";

export async function POST(request: Request) {
  let evento;
  try {
    evento = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!verificarFirmaEvento(evento)) {
    console.error("Webhook de Wompi con firma inválida, se ignora.");
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  const transaccion = evento?.data?.transaction;

  // Solo nos interesa cuando Wompi confirma que el pago fue aprobado.
  if (transaccion?.status === "APPROVED" && transaccion.reference) {
    await prisma.$transaction(async (tx) => {
      // Se carga primero para poder VALIDAR antes de marcar nada. La lectura
      // no sirve como control de concurrencia (dos webhooks simultáneos
      // podrían leer los dos el mismo estado): de eso se encarga el
      // updateMany condicionado de más abajo.
      const pedido = await tx.pedido.findUnique({
        where: { referencia: transaccion.reference },
        include: { items: true },
      });

      if (!pedido) {
        console.error(
          `Webhook de Wompi con referencia desconocida: ${transaccion.reference}`
        );
        return;
      }

      // ─── Validación del monto ───────────────────────────────────────────
      // Antes se marcaba el pedido como pagado sin mirar cuánto se pagó. Es
      // la segunda cerradura: si el secreto de integridad se filtrara,
      // alguien podría firmar un link por $1.000 contra la referencia de un
      // pedido de $2.000.000 y esto lo daría por pagado. Wompi lo recomienda
      // explícitamente en su guía de integración.
      const centavosEsperados = aCentavos(Number(pedido.total));
      const centavosRecibidos = Number(transaccion.amount_in_cents);
      const monedaCorrecta = transaccion.currency === "COP";

      if (centavosRecibidos !== centavosEsperados || !monedaCorrecta) {
        const motivo =
          `Monto o moneda no coinciden: se recibieron ${centavosRecibidos} ` +
          `${transaccion.currency ?? "?"} y el pedido son ${centavosEsperados} COP. ` +
          `Transacción Wompi ${transaccion.id ?? "sin id"}. NO se marcó como pagado ` +
          `ni se descontó inventario.`;

        await tx.pedido.update({
          where: { id: pedido.id },
          data: { requiereRevision: true, motivoRevision: motivo },
        });
        console.error(`Pedido ${pedido.id}: ${motivo}`);
        return;
      }

      // ─── Pedido cancelado que se paga igual ─────────────────────────────
      // Cancelar no invalida el link de pago que el cliente ya tiene. Si lo
      // paga después, el dinero entró y tiene que quedar registrado y
      // visible — pero el inventario NO se toca, porque el pedido está
      // cancelado y lo más probable es que haya que devolver la plata. Queda
      // marcado para que una persona decida: reactivar o reembolsar.
      const estabaCancelado = pedido.estado === "RECHAZADO";

      // El where con pagadoEn: null evita procesar dos veces el mismo pago
      // si Wompi reintenta el envío del webhook (lo hace hasta 3 veces en
      // 24h si no recibe un 200). Es atómico, a diferencia de la lectura de
      // arriba, así que es este el que garantiza la idempotencia.
      const marcado = await tx.pedido.updateMany({
        where: { id: pedido.id, pagadoEn: null },
        data: {
          pagadoEn: new Date(),
          wompiTransactionId: transaccion.id ?? null,
          metodoPago: transaccion.payment_method_type ?? null,
          datosPago: transaccion,
          ...(estabaCancelado
            ? {
                requiereRevision: true,
                motivoRevision:
                  "El cliente pagó un pedido que ya estaba cancelado. El dinero " +
                  "entró pero el inventario NO se descontó. Hay que reactivar el " +
                  "pedido y despacharlo, o reembolsar desde el panel de Wompi.",
              }
            : {}),
        },
      });

      // count 0 = este pago ya se había registrado antes (reintento): no hay
      // nada nuevo que descontar de inventario.
      if (marcado.count === 0) return;

      if (estabaCancelado) {
        console.error(
          `Pedido ${pedido.id} pagado estando cancelado — requiere revisión manual.`
        );
        return;
      }

      // El stock se descuenta ACÁ, recién con el pago ya confirmado y
      // validado — nunca antes. Un pedido creado pero nunca pagado no le
      // bloquea inventario real a nadie.
      const sinStock: string[] = [];

      for (const item of pedido.items) {
        const descuento = await tx.presentacion.updateMany({
          where: { id: item.presentacionId, stock: { gte: item.cantidad } },
          data: { stock: { decrement: item.cantidad } },
        });

        // El pago ya se cobró: si a estas alturas no queda stock suficiente
        // (se agotó entre que se creó el pedido y se pagó), no tiene sentido
        // dejar la fila en negativo. Se deja en 0 y se marca el pedido — no
        // hay forma de reversar un cobro ya hecho desde acá, así que alguien
        // del equipo debe revisarlo (contactar al cliente, reabastecer, o
        // reembolsar).
        if (descuento.count === 0) {
          await tx.presentacion.updateMany({
            where: { id: item.presentacionId },
            data: { stock: 0 },
          });
          sinStock.push(`${item.nombreProducto} (${item.etiqueta}) x${item.cantidad}`);
        }
      }

      // Antes esto solo salía por console.error, que en producción no lo lee
      // nadie: el pedido se despachaba o no según si alguien se dio cuenta.
      // Ahora queda marcado en la base y el panel lo muestra en rojo.
      if (sinStock.length > 0) {
        const motivo =
          `Posible sobreventa: el pago se confirmó pero no había stock ` +
          `suficiente de ${sinStock.join(", ")}. El inventario de esas ` +
          `presentaciones quedó en 0.`;
        await tx.pedido.update({
          where: { id: pedido.id },
          data: { requiereRevision: true, motivoRevision: motivo },
        });
        console.error(`Pedido ${pedido.id}: ${motivo}`);
      }
    });
  }

  // Siempre respondemos 200 una vez verificada la firma — incluso para
  // estados que no procesamos (DECLINED, VOIDED, etc.) — para que Wompi no
  // siga reintentando algo que ya vimos.
  return NextResponse.json({ received: true });
}
