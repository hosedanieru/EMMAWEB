import type { Metadata } from "next";
import Link from "next/link";
import { DocumentoLegal, Seccion } from "../_components/DocumentoLegal";
import { EMPRESA } from "@/lib/empresa";
import { ZONAS_ENVIO } from "@/lib/envio";
import { formatearCOP } from "@/lib/dinero";

export const metadata: Metadata = {
  title: "Términos y condiciones — Emma Colombia",
  description:
    "Términos y condiciones de compra en la tienda en línea de Compañía Colombiana de Alimentos Emma S.A.S.",
};

export default function TerminosPage() {
  return (
    <DocumentoLegal titulo="Términos y condiciones">
      <p>
        Estos términos regulan la compra de productos a través de este sitio.
        Al confirmar un pedido, el comprador declara que los ha leído y los
        acepta.
      </p>

      <Seccion n={1} titulo="Identificación del vendedor">
        <p>
          El vendedor es {EMPRESA.razonSocial}, domiciliada en{" "}
          {EMPRESA.domicilio}, {EMPRESA.ciudad}. Atención al cliente:{" "}
          {EMPRESA.correoContacto} · {EMPRESA.telefono}.
        </p>
      </Seccion>

      <Seccion n={2} titulo="Productos y precios">
        <p>
          Los productos ofrecidos son alimentos no perecederos —granos y
          derivados— en las presentaciones publicadas en el catálogo.
        </p>
        <p>
          Todos los precios están expresados en pesos colombianos (COP) e
          incluyen los impuestos aplicables. El precio que se cobra es el
          vigente en el momento de confirmar el pedido, no el que estuviera
          guardado en el carrito de una sesión anterior.
        </p>
        <p>
          Las ofertas están sujetas a la disponibilidad de inventario. Si un
          producto se agota entre la confirmación y el pago, se contactará al
          comprador para reemplazarlo o devolver el dinero.
        </p>
      </Seccion>

      <Seccion n={3} titulo="Proceso de compra">
        <p>
          El comprador agrega productos al carrito, diligencia sus datos de
          entrega y confirma el pedido. A continuación es dirigido a la pasarela
          de pago para completar la transacción.
        </p>
        <p>
          El pedido se entiende perfeccionado únicamente cuando la pasarela
          confirma la aprobación del pago. Hasta ese momento no hay obligación
          de despacho ni reserva de inventario.
        </p>
      </Seccion>

      <Seccion n={4} titulo="Medios de pago">
        <p>
          Los pagos se procesan a través de <strong>Wompi</strong>, pasarela de
          Bancolombia S.A. Se aceptan tarjetas de crédito y débito, PSE, Nequi,
          Bancolombia y pago en efectivo en los puntos habilitados por la
          pasarela.
        </p>
        <p>
          Emma no almacena datos de tarjetas: esa información se entrega
          directamente a la pasarela, que es la responsable de su custodia.
        </p>
      </Seccion>

      <Seccion n={5} titulo="Cobertura y envíos">
        <p>Actualmente se despacha a las siguientes zonas:</p>
        <ul className="list-disc space-y-1 pl-6">
          {ZONAS_ENVIO.map((zona) => (
            <li key={zona.id}>
              <strong>{zona.nombre}</strong> ({zona.ciudades.join(", ")}) —{" "}
              {formatearCOP(zona.costo)} de envío, gratis desde{" "}
              {formatearCOP(zona.envioGratisDesde)}.
            </li>
          ))}
        </ul>
        <p>
          El costo de envío se calcula al elegir la ciudad y se muestra antes de
          confirmar. Para destinos fuera de estas zonas, el envío se coordina de
          forma individual escribiendo por WhatsApp.
        </p>
      </Seccion>

      <Seccion n={6} titulo="Derecho de retracto">
        <p>
          Conforme al artículo 47 de la Ley 1480 de 2011 (Estatuto del
          Consumidor), el comprador puede ejercer el derecho de retracto dentro
          de los cinco (5) días hábiles siguientes a la entrega del producto,
          devolviéndolo en el mismo estado en que lo recibió.
        </p>
        <p>
          Para ejercerlo debe comunicarlo a {EMPRESA.correoContacto} o por
          WhatsApp dentro de ese plazo. Los costos de transporte de la devolución
          corren por cuenta del comprador. Recibido el producto y verificado su
          estado, el dinero se devuelve dentro de los treinta (30) días
          calendario siguientes.
        </p>
        <p>
          El retracto no aplica sobre productos cuyo empaque haya sido abierto
          cuando ello comprometa su inocuidad alimentaria.
        </p>
      </Seccion>

      <Seccion n={7} titulo="Reversión del pago">
        <p>
          De acuerdo con el artículo 51 de la Ley 1480 de 2011, el comprador
          puede solicitar la reversión del pago cuando sea objeto de fraude,
          cuando corresponda a una operación no solicitada, cuando el producto no
          sea recibido, cuando el entregado no corresponda al solicitado, o
          cuando esté defectuoso.
        </p>
        <p>
          La solicitud debe presentarse dentro de los cinco (5) días hábiles
          siguientes al conocimiento del hecho, ante Emma y ante la entidad
          emisora del medio de pago.
        </p>
      </Seccion>

      <Seccion n={8} titulo="Garantía">
        <p>
          Todos los productos cuentan con la garantía legal prevista en los
          artículos 7 y siguientes de la Ley 1480 de 2011. Si un producto llega
          en mal estado, vencido o con el empaque comprometido, se reemplaza o se
          devuelve el dinero sin costo, previa verificación.
        </p>
        <p>
          Las reclamaciones se reciben en {EMPRESA.correoContacto} o por
          WhatsApp, adjuntando el número de pedido y, cuando sea posible, un
          registro fotográfico.
        </p>
      </Seccion>

      <Seccion n={9} titulo="Datos personales">
        <p>
          El tratamiento de los datos suministrados se rige por la{" "}
          <Link
            href="/legal/tratamiento-datos"
            className="text-brand-green-2 underline underline-offset-2"
          >
            política de tratamiento de datos personales
          </Link>
          , que hace parte integral de estos términos.
        </p>
      </Seccion>

      <Seccion n={10} titulo="Ley aplicable y controversias">
        <p>
          Estos términos se rigen por la ley colombiana. Las controversias que
          no se resuelvan directamente podrán someterse a la Superintendencia de
          Industria y Comercio en ejercicio de sus facultades jurisdiccionales, o
          a los jueces competentes de la República de Colombia.
        </p>
      </Seccion>

      <Seccion n={11} titulo="Modificaciones">
        <p>
          Emma puede modificar estos términos en cualquier momento. La versión
          aplicable a cada compra es la publicada en este sitio al momento de
          confirmar el pedido. Vigente desde el {EMPRESA.vigenteDesde}.
        </p>
      </Seccion>
    </DocumentoLegal>
  );
}
