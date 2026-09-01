"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { linkWhatsApp } from "@/lib/contacto";
import { useLocale } from "@/context/LocaleContext";

export default function PedidoRecibidoContenido({
  primerNombre,
  numeroPedido,
  pagado,
}: {
  primerNombre: string;
  numeroPedido: string;
  // Con el pago automático, este comprobante se muestra en dos momentos
  // distintos: justo al crear el pedido (todavía sin pagar) o al volver
  // del checkout de Wompi (normalmente ya pagado). El webhook que confirma
  // el pago es asíncrono, así que puede llegar un instante después de que
  // el cliente ya está viendo esta página — por eso el mensaje "pendiente"
  // sigue siendo válido incluso justo después de pagar.
  pagado: boolean;
}) {
  const { t } = useLocale();
  const titulo = pagado ? t.pedidoRecibido.tituloPagado : t.pedidoRecibido.tituloPendiente;
  const explicacion = pagado
    ? t.pedidoRecibido.explicacionPagado
    : t.pedidoRecibido.explicacionPendiente;

  // El mensaje cambia según el momento: ya pagó y toca coordinar entrega, o
  // el pago quedó a medias y necesita ayuda. En los dos casos lleva el número
  // de pedido escrito, que es el dato que hace falta para atenderlo.
  const mensaje = pagado
    ? t.pedidoRecibido.mensajePagado(numeroPedido)
    : t.pedidoRecibido.mensajePendiente(numeroPedido);

  return (
    <main className="mx-auto max-w-2xl px-7 py-24 text-center">
      <span className="text-sm font-medium uppercase tracking-widest text-brand-orange-d">
        {t.pedidoRecibido.gracias(primerNombre)}
      </span>
      <h1 className="mt-2 text-brand-green">{titulo}</h1>
      <p className="mt-6 text-brand-muted">
        {t.pedidoRecibido.pedidoLabel}{" "}
        <span className="font-medium text-brand-ink">#{numeroPedido}</span>{" "}
        {explicacion}
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <a
          href={linkWhatsApp(mensaje)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          <MessageCircle className="h-[18px] w-[18px] shrink-0" />
          {t.pedidoRecibido.escribirPorPedido}
        </a>
        <Link href="/productos" className="btn btn-outline">
          {t.pedidoRecibido.seguirViendoProductos}
        </Link>
      </div>
    </main>
  );
}
