"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCarrito } from "@/context/CarritoContext";
import { useLocale } from "@/context/LocaleContext";
import { CIUDADES_CON_COBERTURA, calcularEnvio } from "@/lib/envio";
import { formatearCOP, pesosEnteros } from "@/lib/dinero";
import { linkWhatsApp } from "@/lib/contacto";

type FormData = {
  nombreCliente: string;
  correoCliente: string;
  telefonoCliente: string;
  direccion: string;
  ciudad: string;
  // Campo trampa para bots: se mantiene oculto fuera de pantalla, así que
  // ninguna persona real llega a verlo ni llenarlo.
  sitioWeb: string;
};

const initialForm: FormData = {
  nombreCliente: "",
  correoCliente: "",
  telefonoCliente: "",
  direccion: "",
  ciudad: "",
  sitioWeb: "",
};

const claseInput =
  "w-full rounded-md border border-brand-line px-4 py-2 text-brand-ink outline-none focus:border-brand-green";

export default function CheckoutPage() {
  const router = useRouter();
  // El `total` del contexto no se usa acá: se recalcula abajo con el mismo
  // redondeo que aplica el servidor, para que la pantalla no muestre un
  // número distinto del que se va a cobrar.
  const { items, cantidadTotal, vaciarCarrito } = useCarrito();
  const { t } = useLocale();

  const [form, setForm] = useState<FormData>(initialForm);
  const [autorizaDatos, setAutorizaDatos] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si no hay items en el carrito, no tiene sentido mostrar el checkout
  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-7 py-24 text-center">
        <h1 className="mb-4 text-brand-green">{t.checkout.carritoVacioTitulo}</h1>
        <p className="text-brand-muted">{t.checkout.carritoVacioTexto}</p>
        <Link href="/productos" className="btn btn-primary mt-6 inline-flex">
          {t.checkout.verProductos}
        </Link>
      </main>
    );
  }

  // El subtotal se redondea igual que en el servidor (ver lib/dinero.ts) para
  // que el número de esta pantalla sea exactamente el que se va a cobrar y no
  // uno aproximado.
  const subtotal = items.reduce(
    (acc, i) => acc + pesosEnteros(i.precio) * i.cantidad,
    0
  );
  const envio = form.ciudad ? calcularEnvio(subtotal, form.ciudad) : null;
  const costoEnvio = envio?.cubierto ? envio.costo : 0;
  const total = subtotal + costoEnvio;

  // Cuánto le falta para que el envío salga gratis. Solo se muestra si ya
  // eligió ciudad y todavía no llega al umbral de su zona.
  const faltaParaGratis =
    envio?.cubierto && !envio.gratis
      ? envio.zona.envioGratisDesde - subtotal
      : 0;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validación básica de campos obligatorios (sitioWeb es el campo
    // trampa para bots: a propósito NO entra en esta lista, porque para
    // una persona real debe quedar vacío).
    const camposRequeridos: (keyof Omit<FormData, "sitioWeb">)[] = [
      "nombreCliente",
      "correoCliente",
      "telefonoCliente",
      "direccion",
      "ciudad",
    ];
    const campoVacio = camposRequeridos.find((campo) => !form[campo].trim());
    if (campoVacio) {
      setError(
        campoVacio === "ciudad" ? t.checkout.eligeCiudad : t.checkout.completaCampos
      );
      return;
    }

    // El servidor lo vuelve a exigir; esto es solo para no mandar una
    // petición que ya sabemos que va a fallar.
    if (!autorizaDatos) {
      setError(t.checkout.debesAutorizar);
      return;
    }

    setEnviando(true);

    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items, autorizaDatos }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? t.checkout.errorGenerico);
        setEnviando(false);
        return;
      }

      // El pedido queda aprobado automáticamente al crearse. Si ya hay
      // credenciales de Wompi configuradas, linkPago viene listo y
      // mandamos al cliente derecho a pagar; si no, cae al comprobante
      // (pedido-recibido) mientras el equipo coordina el pago a mano.
      if (data.linkPago) {
        vaciarCarrito();
        window.location.href = data.linkPago;
      } else if (data.pedidoId) {
        vaciarCarrito();
        router.push(`/pedido-recibido/${data.pedidoId}`);
      } else {
        // Caso raro: el campo trampa se activó y no se creó ningún pedido
        // real. No hay nada que mostrar, así que no tocamos el carrito.
        router.push("/productos");
      }
    } catch (err) {
      console.error(err);
      setError(t.checkout.errorGenerico);
      setEnviando(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-7 py-24">
      <h1 className="mb-10 text-brand-green">{t.checkout.titulo}</h1>

      <div className="grid gap-12 md:grid-cols-2">
        {/* Formulario de datos del cliente */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo trampa para bots: fuera de pantalla, invisible y sin
              tabulación para una persona real; un bot que rellena todos
              los inputs del formulario sí lo llena. */}
          <div
            aria-hidden="true"
            className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden"
          >
            <label htmlFor="sitioWeb">Sitio web</label>
            <input
              id="sitioWeb"
              type="text"
              name="sitioWeb"
              value={form.sitioWeb}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div>
            <label
              htmlFor="nombreCliente"
              className="mb-1 block text-sm font-medium text-brand-ink"
            >
              {t.checkout.nombreCompleto}
            </label>
            <input
              id="nombreCliente"
              type="text"
              name="nombreCliente"
              value={form.nombreCliente}
              onChange={handleChange}
              autoComplete="name"
              className={claseInput}
              placeholder={t.checkout.nombrePlaceholder}
            />
          </div>

          <div>
            <label
              htmlFor="correoCliente"
              className="mb-1 block text-sm font-medium text-brand-ink"
            >
              {t.checkout.correo}
            </label>
            <input
              id="correoCliente"
              type="email"
              name="correoCliente"
              value={form.correoCliente}
              onChange={handleChange}
              autoComplete="email"
              className={claseInput}
              placeholder={t.checkout.correoPlaceholder}
            />
          </div>

          <div>
            <label
              htmlFor="telefonoCliente"
              className="mb-1 block text-sm font-medium text-brand-ink"
            >
              {t.checkout.telefono}
            </label>
            <input
              id="telefonoCliente"
              type="tel"
              name="telefonoCliente"
              value={form.telefonoCliente}
              onChange={handleChange}
              autoComplete="tel"
              className={claseInput}
              placeholder={t.checkout.telefonoPlaceholder}
            />
          </div>

          <div>
            <label
              htmlFor="direccion"
              className="mb-1 block text-sm font-medium text-brand-ink"
            >
              {t.checkout.direccion}
            </label>
            <input
              id="direccion"
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              autoComplete="street-address"
              className={claseInput}
              placeholder={t.checkout.direccionPlaceholder}
            />
          </div>

          {/* Antes era texto libre, así que se podía pedir un domicilio a
              cualquier parte del país y el envío salía gratis igual. Ahora
              solo se ofrecen las ciudades con cobertura real, y el costo se
              calcula a partir de la que se elija. */}
          <div>
            <label
              htmlFor="ciudad"
              className="mb-1 block text-sm font-medium text-brand-ink"
            >
              {t.checkout.ciudad}
            </label>
            <select
              id="ciudad"
              name="ciudad"
              value={form.ciudad}
              onChange={handleChange}
              className={claseInput}
            >
              <option value="">{t.checkout.ciudadElige}</option>
              {CIUDADES_CON_COBERTURA.map((ciudad) => (
                <option key={ciudad} value={ciudad}>
                  {ciudad}
                </option>
              ))}
            </select>
            <a
              href={linkWhatsApp(
                "Hola, quiero hacer un pedido pero mi ciudad no aparece en la lista."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-block text-xs text-brand-muted underline underline-offset-2 hover:text-brand-green"
            >
              {t.checkout.ciudadNoAparece}
            </a>
          </div>

          {/* Ley 1581 de 2012: la autorización tiene que ser expresa, así que
              la casilla no puede venir marcada por defecto. La fecha en que
              se marca queda guardada en el pedido. */}
          <div className="flex items-start gap-2.5 pt-1">
            <input
              id="autorizaDatos"
              type="checkbox"
              checked={autorizaDatos}
              onChange={(e) => setAutorizaDatos(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 accent-brand-green"
            />
            <label htmlFor="autorizaDatos" className="text-sm text-brand-muted">
              {t.checkout.autorizoInicio}
              <Link
                href="/legal/tratamiento-datos"
                target="_blank"
                className="text-brand-green underline underline-offset-2"
              >
                {t.checkout.autorizoTratamiento}
              </Link>
              {t.checkout.autorizoMedio}
              <Link
                href="/legal/terminos"
                target="_blank"
                className="text-brand-green underline underline-offset-2"
              >
                {t.checkout.autorizoTerminos}
              </Link>
              .
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="btn btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
          >
            {enviando ? t.checkout.procesando : t.checkout.confirmarPedido}
          </button>
        </form>

        {/* Resumen del pedido */}
        <div>
          <h2 className="mb-4 text-lg font-medium text-brand-green">
            {t.checkout.resumenPedido}
          </h2>
          <div className="divide-y divide-brand-line-2 rounded-brand border border-brand-line-2">
            {items.map((item) => (
              <div
                key={item.presentacionId}
                className="flex items-center justify-between px-4 py-3"
              >
                <div>
                  <p className="font-medium text-brand-ink">{item.productoNombre}</p>
                  <p className="text-sm text-brand-muted">
                    {item.etiqueta} × {item.cantidad}
                  </p>
                </div>
                <p className="font-medium text-brand-ink">
                  {formatearCOP(pesosEnteros(item.precio) * item.cantidad)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2 border-t border-brand-line-2 pt-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-brand-muted">
                {t.checkout.subtotal} · {cantidadTotal} {t.checkout.articulos}
              </span>
              <span className="text-brand-ink">{formatearCOP(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-brand-muted">{t.checkout.envio}</span>
              <span className="text-brand-ink">
                {!envio?.cubierto
                  ? t.checkout.envioPendiente
                  : envio.gratis
                    ? t.checkout.envioGratis
                    : formatearCOP(envio.costo)}
              </span>
            </div>

            {faltaParaGratis > 0 && (
              <p className="text-xs text-brand-orange-d">
                {t.checkout.faltaParaEnvioGratis(formatearCOP(faltaParaGratis))}
              </p>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-brand-line-2 pt-3">
            <p className="text-sm text-brand-muted">{t.checkout.total}</p>
            <p className="text-xl font-medium text-brand-green">
              {formatearCOP(total)}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
