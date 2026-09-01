import type { Metadata } from "next";
import Link from "next/link";
import { DocumentoLegal, Seccion } from "../_components/DocumentoLegal";
import { EMPRESA } from "@/lib/empresa";

export const metadata: Metadata = {
  title: "Política de privacidad — Emma Colombia",
  description:
    "Cómo Emma Colombia usa la información al navegar el sitio: cookies, almacenamiento local y servicios de terceros.",
};

export default function PrivacidadPage() {
  return (
    <DocumentoLegal titulo="Política de privacidad">
      <p>
        Esta política explica qué información se registra al navegar este sitio
        y cómo se usa. Lo relativo a los datos que el comprador entrega al hacer
        un pedido —nombre, correo, dirección— está en la{" "}
        <Link
          href="/legal/tratamiento-datos"
          className="text-brand-green-2 underline underline-offset-2"
        >
          política de tratamiento de datos personales
        </Link>
        .
      </p>

      <Seccion n={1} titulo="Navegación sin registro">
        <p>
          No hace falta crear una cuenta para comprar. El sitio no tiene registro
          de usuarios ni perfiles de cliente: cada pedido es independiente y solo
          conserva los datos necesarios para entregarlo.
        </p>
      </Seccion>

      <Seccion n={2} titulo="Almacenamiento en el navegador">
        <p>El sitio guarda dos cosas en el navegador del visitante:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong>El carrito de compras</strong>, en el almacenamiento local.
            Permite que los productos sigan ahí si se cierra la pestaña. No sale
            del dispositivo hasta que se confirma un pedido y no contiene datos
            personales.
          </li>
          <li>
            <strong>El idioma elegido</strong>, para no volver a preguntarlo.
          </li>
        </ul>
        <p>
          Ambos se pueden borrar en cualquier momento desde la configuración del
          navegador, sin afectar la posibilidad de comprar.
        </p>
      </Seccion>

      <Seccion n={3} titulo="Cookies">
        <p>
          Este sitio no usa cookies de publicidad, de analítica ni de
          seguimiento de terceros.
        </p>
        <p>
          La única cookie que se instala es la de sesión del panel
          administrativo, que solo reciben las personas del equipo de Emma que
          inician sesión en él. Es una cookie técnica, estrictamente necesaria
          para el funcionamiento del panel, y expira a las ocho horas.
        </p>
      </Seccion>

      <Seccion n={4} titulo="Servicios de terceros">
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong>Wompi (Bancolombia S.A.)</strong> — al pagar, el visitante
            es dirigido al dominio de la pasarela. A partir de ahí aplica la
            política de privacidad de Wompi. Los datos de tarjeta se entregan
            solo a la pasarela y nunca llegan a los servidores de Emma.
          </li>
          <li>
            <strong>Google Fonts</strong> — el sitio carga una tipografía desde
            los servidores de Google, que registran la dirección IP de la
            solicitud como parte de la entrega del archivo.
          </li>
          <li>
            <strong>WhatsApp (Meta)</strong> — los botones de contacto abren una
            conversación en WhatsApp, sujeta a las políticas de esa plataforma.
          </li>
        </ul>
      </Seccion>

      <Seccion n={5} titulo="Registros técnicos">
        <p>
          El servidor conserva registros técnicos de las solicitudes —dirección
          IP, fecha y ruta— con el único fin de detectar fallas y prevenir abuso
          automatizado. No se usan para perfilar visitantes ni se cruzan con los
          datos de los pedidos.
        </p>
      </Seccion>

      <Seccion n={6} titulo="Menores de edad">
        <p>
          El sitio no está dirigido a menores de edad y no recolecta
          intencionalmente sus datos. Las compras deben ser realizadas por
          personas mayores de dieciocho (18) años con capacidad legal para
          contratar.
        </p>
      </Seccion>

      <Seccion n={7} titulo="Contacto">
        <p>
          Cualquier pregunta sobre esta política se atiende en{" "}
          <a
            href={`mailto:${EMPRESA.correoContacto}`}
            className="text-brand-green-2 underline underline-offset-2"
          >
            {EMPRESA.correoContacto}
          </a>
          . Vigente desde el {EMPRESA.vigenteDesde}.
        </p>
      </Seccion>
    </DocumentoLegal>
  );
}
