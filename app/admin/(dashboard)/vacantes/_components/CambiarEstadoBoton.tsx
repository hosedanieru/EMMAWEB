import { cambiarEstadoVacante } from "../../_actions/vacantes-actions";

export default function CambiarEstadoBoton({
  vacanteId,
  activa,
}: {
  vacanteId: string;
  activa: boolean;
}) {
  return (
    <form action={cambiarEstadoVacante.bind(null, vacanteId, !activa)}>
      <button type="submit" className="text-sm text-brand-muted hover:text-brand-ink hover:underline">
        {activa ? "Desactivar" : "Activar"}
      </button>
    </form>
  );
}
