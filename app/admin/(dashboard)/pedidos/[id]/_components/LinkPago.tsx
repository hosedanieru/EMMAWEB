"use client";

import { useState } from "react";

// Antes no había forma de recuperar el link de pago de un pedido: se generaba
// al crearlo, se mandaba al navegador del cliente y ahí moría. Si la persona
// cerraba la pestaña antes de pagar —o el correo estaba apagado, que es el
// caso hoy— el pedido quedaba esperando un pago para siempre y nadie del
// equipo podía hacer nada.
//
// El link se puede reconstruir en cualquier momento a partir de la referencia
// y el total (la página lo hace del lado del servidor, que es donde vive el
// secreto de integridad). Acá solo se muestra y se ofrece de dos formas:
// copiarlo, o abrirlo ya escrito en un mensaje de WhatsApp al cliente.

export default function LinkPago({
  link,
  telefonoCliente,
  nombreCliente,
  numeroPedido,
}: {
  link: string;
  telefonoCliente: string;
  nombreCliente: string;
  numeroPedido: string;
}) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Sin permiso de portapapeles (o sin HTTPS) no se puede copiar solo:
      // el link está a la vista y se puede seleccionar a mano.
      setCopiado(false);
    }
  }

  // wa.me exige el número en formato internacional sin +, espacios ni guiones.
  // Si el cliente lo escribió con espacios o con el indicativo, se normaliza.
  const soloDigitos = telefonoCliente.replace(/\D/g, "");
  const numeroWhatsApp = soloDigitos.startsWith("57")
    ? soloDigitos
    : `57${soloDigitos}`;

  const mensaje = `Hola ${nombreCliente.split(" ")[0]}, te escribimos de Emma Colombia por tu pedido #${numeroPedido}. Puedes completar el pago acá: ${link}`;

  return (
    <div className="mt-4 rounded-lg border border-brand-line-2 bg-brand-paper-2 p-4">
      <p className="mb-2 text-sm font-medium text-brand-ink">
        Link de pago de este pedido
      </p>
      <p className="mb-3 break-all rounded border border-brand-line-2 bg-white px-3 py-2 font-mono text-xs text-brand-muted">
        {link}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copiar}
          className="rounded-full border border-brand-line px-4 py-1.5 text-sm text-brand-ink transition-colors duration-200 hover:border-brand-green hover:text-brand-green"
        >
          {copiado ? "Copiado" : "Copiar link"}
        </button>
        <a
          href={`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-[#25d366] px-4 py-1.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#1da851]"
        >
          Enviar por WhatsApp
        </a>
      </div>
    </div>
  );
}
