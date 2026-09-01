"use client";

import { useTransition, useState } from "react";
import { eliminarUsuario } from "../../_actions/usuarios-actions";

export default function EliminarUsuarioBoton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function manejarClick() {
    if (!window.confirm("¿Eliminar este usuario? Esta acción no se puede deshacer.")) {
      return;
    }
    setError("");
    startTransition(async () => {
      try {
        await eliminarUsuario(id);
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudo eliminar");
      }
    });
  }

  return (
    <div>
      <button
        onClick={manejarClick}
        disabled={isPending}
        className="text-sm text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Eliminando..." : "Eliminar"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
