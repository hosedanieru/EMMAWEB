const ROLES_PERMITIDOS = ["ADMIN", "FACTURACION"];

export function tienePermiso(role: string | undefined) {
  return !!role && ROLES_PERMITIDOS.includes(role);
}

export function AccesoDenegado() {
  return (
    <div className="p-6">
      <p className="text-red-600">No tienes permiso para ver esta sección.</p>
    </div>
  );
}
