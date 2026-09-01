"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type RespuestaError = { error: string };

// Los pedidos se aprueban automáticamente al crearse — ya no hay un botón
// "Aprobar" acá. Lo único que queda por hacer manualmente es cancelar un
// pedido que todavía no ha sido pagado (se ve sospechoso, quedó
// abandonado, el cliente pidió cancelarlo, etc.).
export default function AccionesPedido({ pedidoId }: { pedidoId: string }) {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<RespuestaError | null>(null);

  async function cancelarPedido() {
    if (!window.confirm("¿Cancelar este pedido?")) return;

    setEnviando(true);
    setError(null);

    const res = await fetch(`/api/admin/pedidos/${pedidoId}/rechazar`, {
      method: "POST",
    });

    if (!res.ok) {
      const body: RespuestaError = await res.json();
      setError(body);
      setEnviando(false);
      // Si el pedido ya fue pagado o cancelado por otra persona,
      // refrescamos para que la página deje de mostrar el botón sobre un
      // estado desactualizado.
      router.refresh();
      return;
    }

    router.refresh();
  }

  return (
    <div className="mt-6">
      <button
        onClick={cancelarPedido}
        disabled={enviando}
        className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {enviando ? "Cancelando..." : "Cancelar pedido"}
      </button>

      {error && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <p className="font-medium">{error.error}</p>
        </div>
      )}
    </div>
  );
}
