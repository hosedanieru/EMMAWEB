import type { Metadata } from "next";
import { DocumentoLegal, Seccion } from "../_components/DocumentoLegal";
import { EMPRESA } from "@/lib/empresa";

export const metadata: Metadata = {
  title: "Tratamiento de datos personales — Emma Colombia",
  description:
    "Política de tratamiento de datos personales de Compañía Colombiana de Alimentos Emma S.A.S., conforme a la Ley 1581 de 2012.",
};

export default function TratamientoDatosPage() {
  return (
    <DocumentoLegal titulo="Tratamiento de datos">
      <p>
        Esta política se adopta en cumplimiento de la Ley 1581 de 2012, el
        Decreto 1074 de 2015 y demás normas que las modifiquen o reglamenten.
        Describe cómo {EMPRESA.razonSocial} recolecta, usa, almacena y protege
        los datos personales de quienes usan este sitio.
      </p>

      <Seccion n={1} titulo="Responsable del tratamiento">
        <p>
          El responsable es {EMPRESA.razonSocial}, con domicilio en{" "}
          {EMPRESA.domicilio}, {EMPRESA.ciudad}. Las solicitudes relacionadas
          con datos personales se atienden en{" "}
          <a
            href={`mailto:${EMPRESA.correoDatos}`}
            className="text-brand-green-2 underline underline-offset-2"
          >
            {EMPRESA.correoDatos}
          </a>
          .
        </p>
      </Seccion>

      <Seccion n={2} titulo="Datos que recolectamos">
        <p>Al realizar un pedido en este sitio se recolecta:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Nombre completo</li>
          <li>Correo electrónico</li>
          <li>Número de teléfono</li>
          <li>Dirección y ciudad de entrega</li>
          <li>
            Detalle del pedido y de la transacción de pago reportada por la
            pasarela
          </li>
        </ul>
        <p>
          No se recolectan datos sensibles en los términos del artículo 5 de la
          Ley 1581 de 2012, ni datos de menores de edad. Tampoco se almacena
          ningún dato de tarjetas de crédito o débito: esa información se
          entrega directamente a la pasarela de pago y nunca pasa por los
          servidores de Emma.
        </p>
      </Seccion>

      <Seccion n={3} titulo="Finalidades">
        <p>Los datos se tratan únicamente para:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Procesar, despachar y entregar el pedido</li>
          <li>Gestionar el cobro y su verificación con la pasarela de pago</li>
          <li>Comunicarnos con el titular sobre el estado de su pedido</li>
          <li>Atender peticiones, quejas, reclamos y solicitudes de garantía</li>
          <li>Cumplir obligaciones contables, tributarias y legales</li>
        </ul>
        <p>
          Los datos no se venden ni se ceden a terceros con fines comerciales.
        </p>
      </Seccion>

      <Seccion n={4} titulo="Encargados y transferencia de datos">
        <p>
          Para prestar el servicio se apoya en terceros que actúan como
          encargados del tratamiento:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong>Wompi</strong> (Bancolombia S.A.) — procesamiento de pagos.
            Recibe el nombre, el correo, el monto y la referencia del pedido.
          </li>
          <li>
            <strong>Proveedor de correo transaccional</strong> — envío de la
            confirmación del pedido.
          </li>
          <li>
            <strong>Proveedor de alojamiento</strong> — operación técnica del
            sitio y de la base de datos.
          </li>
        </ul>
      </Seccion>

      <Seccion n={5} titulo="Derechos del titular">
        <p>
          Conforme al artículo 8 de la Ley 1581 de 2012, el titular tiene
          derecho a:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Conocer, actualizar y rectificar sus datos personales</li>
          <li>
            Solicitar prueba de la autorización otorgada, salvo cuando la ley no
            la exija
          </li>
          <li>Ser informado sobre el uso que se les ha dado a sus datos</li>
          <li>
            Presentar quejas ante la Superintendencia de Industria y Comercio
            por infracciones a la ley
          </li>
          <li>
            Revocar la autorización o solicitar la supresión de los datos,
            cuando no exista un deber legal o contractual que lo impida
          </li>
          <li>Acceder de forma gratuita a sus datos personales</li>
        </ul>
      </Seccion>

      <Seccion n={6} titulo="Cómo ejercer estos derechos">
        <p>
          Escribiendo a{" "}
          <a
            href={`mailto:${EMPRESA.correoDatos}`}
            className="text-brand-green-2 underline underline-offset-2"
          >
            {EMPRESA.correoDatos}
          </a>{" "}
          con el asunto «Habeas Data», indicando el nombre del titular, la
          descripción de la solicitud y un dato de contacto.
        </p>
        <p>
          Las consultas se atienden en un plazo máximo de diez (10) días hábiles
          y los reclamos en quince (15) días hábiles, prorrogables conforme a los
          artículos 14 y 15 de la Ley 1581 de 2012.
        </p>
      </Seccion>

      <Seccion n={7} titulo="Conservación">
        <p>
          Los datos asociados a un pedido se conservan mientras dure la relación
          comercial y, después, durante el término necesario para atender
          obligaciones legales —en particular las contables y tributarias, que
          exigen conservar los soportes por diez (10) años conforme al artículo
          28 de la Ley 962 de 2005—. Cumplido ese plazo se suprimen.
        </p>
      </Seccion>

      <Seccion n={8} titulo="Seguridad">
        <p>
          Se aplican medidas técnicas y administrativas para proteger los datos:
          cifrado en tránsito, control de acceso por roles al panel
          administrativo, contraseñas almacenadas con funciones de derivación
          irreversibles, y verificación criptográfica de las confirmaciones de
          pago.
        </p>
      </Seccion>

      <Seccion n={9} titulo="Vigencia">
        <p>
          Esta política rige desde el {EMPRESA.vigenteDesde}. Cualquier cambio
          sustancial se informará a través de este mismo sitio. Las bases de
          datos se conservarán mientras sea necesario para las finalidades
          descritas.
        </p>
      </Seccion>
    </DocumentoLegal>
  );
}
