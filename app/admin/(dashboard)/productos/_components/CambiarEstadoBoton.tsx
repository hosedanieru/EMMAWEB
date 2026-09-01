import { cambiarEstadoProducto } from "../../_actions/actions";

export default function CambiarEstadoBoton({
  productoId,
  activo,
}: {
  productoId: string;
  activo: boolean;
}) {
  return (
    <form action={cambiarEstadoProducto.bind(null, productoId, !activo)}>
      <button type="submit" className="text-sm text-brand-muted hover:text-brand-ink hover:underline">
        {activo ? "Desactivar" : "Activar"}
      </button>
    </form>
  );
}
