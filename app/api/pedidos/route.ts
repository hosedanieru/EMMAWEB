import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generarUrlPago } from "@/lib/wompi";
import { enviarCorreoResultadoPedido } from "@/lib/email-pedidos";
import { smtpConfigurado } from "@/lib/mailer";
import { etiquetaPresentacion } from "@/lib/presentacion";
import { calcularEnvio } from "@/lib/envio";
import { pesosEnteros, aCentavos } from "@/lib/dinero";
import { consumir, ipDePeticion } from "@/lib/rate-limit";

// Del carrito solo se cree la PAREJA presentación + cantidad. El nombre, la
// etiqueta y sobre todo el precio se resuelven contra la base de datos más
// abajo: el carrito vive en localStorage del navegador, así que cualquiera
// puede editarlo y mandar el precio que se le antoje.
//
// Los topes de cantidad y de líneas no son por el negocio (nadie compra 500
// presentaciones distintas): son para que un script no pueda mandar un cuerpo
// enorme y hacer trabajar a la base sin límite.
const MAX_LINEAS = 50;
const MAX_CANTIDAD_POR_LINEA = 999;

// Pedidos por IP y por ventana. Holgado para una persona real —nadie hace 10
// compras seguidas en una hora— y suficiente para que un script no llene la
// tabla de pedidos basura.
const LIMITE_PEDIDOS = 10;
const VENTANA_SEGUNDOS = 60 * 60;

const itemSchema = z.object({
  presentacionId: z.string().min(1),
  cantidad: z.number().int().positive().max(MAX_CANTIDAD_POR_LINEA),
});

const pedidoSchema = z.object({
  nombreCliente: z.string().trim().min(2, "El nombre es muy corto").max(120),
  // Antes solo se comprobaba que no estuviera vacío. Ese valor va derecho al
  // link de Wompi como customer-data:email y al destinatario del correo de
  // confirmación: un correo malformado deja sin comprobante y sin canal de
  // contacto a alguien que ya pagó.
  correoCliente: z.string().trim().toLowerCase().email("Correo electrónico inválido").max(160),
  telefonoCliente: z.string().trim().min(7, "Teléfono inválido").max(30),
  direccion: z.string().trim().min(5, "La dirección es muy corta").max(200),
  ciudad: z.string().trim().min(1, "Elegí una ciudad").max(80),
  items: z.array(itemSchema).min(1, "El pedido no tiene productos").max(MAX_LINEAS),
  // Ley 1581 de 2012: la autorización del titular tiene que ser expresa, y la
  // empresa tiene que poder demostrar cuándo se dio. La casilla del checkout
  // es obligatoria y acá se vuelve a exigir, porque la validación del
  // navegador no es una garantía de nada.
  autorizaDatos: z.literal(true, {
    errorMap: () => ({ message: "Debes autorizar el tratamiento de datos para continuar" }),
  }),
  // Campo trampa para bots (honeypot): el formulario lo mantiene oculto
  // fuera de pantalla con CSS, así que ninguna persona real lo llena. Un
  // bot que rellena todos los inputs del form sí lo hace.
  sitioWeb: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const crudo = await request.json();

    // El honeypot se mira ANTES de validar: si viene lleno se responde éxito
    // falso sin crear nada, y así no le damos pistas al bot de que fue
    // detectado (un 400 con errores de validación sí se las daría).
    if (typeof crudo?.sitioWeb === "string" && crudo.sitioWeb.length > 0) {
      return NextResponse.json({ pedidoId: null, linkPago: null });
    }

    const ip = ipDePeticion(request.headers);
    const limite = consumir(`pedidos:${ip}`, LIMITE_PEDIDOS, VENTANA_SEGUNDOS);
    if (!limite.permitido) {
      return NextResponse.json(
        { error: "Demasiados pedidos seguidos. Intenta de nuevo en un rato." },
        { status: 429, headers: { "Retry-After": String(limite.reintentarEn) } }
      );
    }

    const parseo = pedidoSchema.safeParse(crudo);
    if (!parseo.success) {
      return NextResponse.json(
        { error: parseo.error.issues[0]?.message ?? "Datos del pedido inválidos" },
        { status: 400 }
      );
    }

    const {
      nombreCliente,
      correoCliente,
      telefonoCliente,
      direccion,
      ciudad,
      items,
    } = parseo.data;

    // Si el carrito trae dos líneas de la misma presentación, se suman: si no,
    // cada una se validaría contra el stock por separado y entre las dos
    // podrían pasarse del inventario real.
    const cantidadPorPresentacion = new Map<string, number>();
    for (const item of items) {
      cantidadPorPresentacion.set(
        item.presentacionId,
        (cantidadPorPresentacion.get(item.presentacionId) ?? 0) + item.cantidad
      );
    }

    // ACÁ está la parte que de verdad hace que el total sea confiable: los
    // precios se leen de la base, no del cuerpo de la petición. Antes se
    // calculaba con el precio que mandaba el cliente, así que bastaba editar
    // el localStorage para comprarse un pedido entero por $1 — y como la
    // firma de integridad de Wompi se genera sobre ese mismo total, el pago
    // salía "válido".
    //
    // De paso arregla el problema de los carritos viejos: si el precio cambió
    // desde que la persona agregó el producto, se cobra el precio actual y no
    // el que quedó congelado en su navegador.
    const presentaciones = await prisma.presentacion.findMany({
      where: { id: { in: [...cantidadPorPresentacion.keys()] }, activo: true },
      include: { producto: true },
    });

    const lineas = [];
    for (const [presentacionId, cantidad] of cantidadPorPresentacion) {
      const presentacion = presentaciones.find((p) => p.id === presentacionId);

      // No existe, está desactivada, o su producto se desactivó.
      if (!presentacion || !presentacion.producto.activo) {
        return NextResponse.json(
          { error: "Alguno de los productos ya no está disponible" },
          { status: 409 }
        );
      }

      if (presentacion.stock < cantidad) {
        return NextResponse.json(
          {
            error: `No queda suficiente stock de ${presentacion.producto.nombre} (${etiquetaPresentacion({
              cantidad: Number(presentacion.cantidad),
              unidad: presentacion.unidad,
              unidadesPorPaquete: presentacion.unidadesPorPaquete,
            })}).`,
          },
          { status: 409 }
        );
      }

      lineas.push({
        presentacionId,
        cantidad,
        nombreProducto: presentacion.producto.nombre,
        etiqueta: etiquetaPresentacion({
          cantidad: Number(presentacion.cantidad),
          unidad: presentacion.unidad,
          unidadesPorPaquete: presentacion.unidadesPorPaquete,
        }),
        // Ver lib/dinero.ts: varias presentaciones tienen precio con fracción
        // de peso (2047.5, 3659.25). Se redondea acá, antes de multiplicar,
        // para que la factura cuadre al verificarla a mano y para que Wompi
        // reciba un monto que se pueda pagar en efectivo.
        precioUnitario: pesosEnteros(Number(presentacion.precio)),
      });
    }

    const subtotal = lineas.reduce(
      (acc, linea) => acc + linea.precioUnitario * linea.cantidad,
      0
    );

    // El envío se calcula en el servidor, igual que los precios. El checkout
    // muestra un estimado con el mismo módulo, pero el que se cobra es este.
    const envio = calcularEnvio(subtotal, ciudad);
    if (!envio.cubierto) {
      return NextResponse.json(
        {
          error:
            "Todavía no llegamos a esa ciudad. Escríbenos por WhatsApp y coordinamos el envío.",
        },
        { status: 409 }
      );
    }

    const total = subtotal + envio.costo;

    // El pedido queda aprobado automáticamente al crearse — ya no espera
    // revisión manual de nadie del equipo antes de poder pagarse. El stock
    // NO se toca acá: se descuenta recién cuando Wompi confirma el pago
    // por webhook (app/api/webhooks/wompi/route.ts), para que un pedido
    // creado pero nunca pagado no le bloquee inventario real a nadie.
    const pedido = await prisma.pedido.create({
      data: {
        nombreCliente,
        correoCliente,
        telefonoCliente,
        direccion,
        ciudad,
        subtotal,
        costoEnvio: envio.costo,
        total,
        estado: "APROBADO",
        autorizaDatosEn: new Date(),
        items: { create: lineas },
      },
      include: { items: true },
    });

    // La referencia es lo que Wompi usa para identificar el pedido (y lo
    // que el webhook usa para encontrarlo de vuelta); se fija en un update
    // aparte porque necesitamos el id ya generado por el create de arriba.
    await prisma.pedido.update({
      where: { id: pedido.id },
      data: { referencia: pedido.id },
    });

    // Si las credenciales de Wompi todavía no están puestas en el .env,
    // generarUrlPago devuelve null: el pedido queda igual de aprobado,
    // solo que sin link de pago (alguien del equipo debe contactar al
    // cliente para coordinar el pago manualmente).
    // APP_URL permite fijar el dominio público del sitio. Sirve en dos
    // casos: detrás de un proxy/CDN, donde request.url no siempre trae el
    // dominio real, y en desarrollo con un túnel tipo ngrok (sin él, el
    // origen es localhost y Wompi no acepta el retorno — ver lib/wompi.ts).
    const origen =
      process.env.APP_URL?.trim().replace(/\/$/, "") ||
      new URL(request.url).origin;
    const linkPago = generarUrlPago({
      referencia: pedido.id,
      montoEnCentavos: aCentavos(total),
      correoCliente,
      redirectUrl: `${origen}/pedido-recibido/${pedido.id}`,
    });

    // El correo lleva el link de pago, así que es lo que le permite al cliente
    // retomar un pago que dejó a medias. Mientras SMTP_USER y SMTP_PASS estén
    // vacíos no se intenta el envío (ver lib/mailer.ts) y el único respaldo es
    // el botón de WhatsApp del comprobante — por eso conviene configurarlo.
    //
    // El try/catch se queda porque el envío puede fallar igual con las
    // credenciales puestas (proveedor caído, buzón lleno) y eso no debe
    // tumbar un pedido ya creado.
    if (smtpConfigurado) {
      try {
        await enviarCorreoResultadoPedido(
          {
            id: pedido.id,
            nombreCliente,
            correoCliente,
            subtotal,
            costoEnvio: envio.costo,
            total,
            items: pedido.items.map((item) => ({
              nombreProducto: item.nombreProducto,
              etiqueta: item.etiqueta,
              cantidad: item.cantidad,
              precioUnitario: Number(item.precioUnitario),
            })),
          },
          "APROBADO",
          linkPago
        );
      } catch (error) {
        console.error("Error al enviar correo de confirmación de pedido:", error);
      }
    }

    return NextResponse.json({ pedidoId: pedido.id, linkPago });
  } catch (error) {
    console.error("Error al crear el pedido:", error);
    return NextResponse.json(
      { error: "No se pudo crear el pedido" },
      { status: 500 }
    );
  }
}
