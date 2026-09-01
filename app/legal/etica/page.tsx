import type { Metadata } from "next";
import { DocumentoLegal, Seccion } from "../_components/DocumentoLegal";
import { EMPRESA } from "@/lib/empresa";

export const metadata: Metadata = {
  title: "Transparencia y ética profesional — Emma Colombia",
  description:
    "Principios de conducta, canal de denuncias y compromisos de transparencia de Emma Colombia.",
};

export default function EticaPage() {
  return (
    <DocumentoLegal titulo="Transparencia y ética">
      <p>
        Estos principios orientan la relación de {EMPRESA.nombreComercial} con
        sus clientes, proveedores, trabajadores y con las comunidades donde
        opera.
      </p>

      <Seccion n={1} titulo="Compromisos con el cliente">
        <ul className="list-disc space-y-1 pl-6">
          <li>
            Publicar precios completos, en pesos colombianos y con impuestos
            incluidos, sin cargos que aparezcan al final del proceso de compra.
          </li>
          <li>
            Cobrar el precio vigente al confirmar el pedido y mostrar el costo
            de envío antes de pedir el pago.
          </li>
          <li>
            Describir los productos —peso neto, presentación y contenido— sin
            exagerar propiedades ni atribuirles beneficios que no tienen.
          </li>
          <li>
            Responder peticiones, quejas y reclamos dentro de los plazos que fija
            la ley.
          </li>
        </ul>
      </Seccion>

      <Seccion n={2} titulo="Cadena de suministro">
        <p>
          Emma trabaja con productores agrícolas colombianos bajo condiciones de
          pago acordadas por escrito y cumplidas en los plazos pactados. No se
          aceptan proveedores que empleen trabajo infantil o trabajo forzoso, ni
          que incumplan la normativa laboral y ambiental aplicable.
        </p>
      </Seccion>

      <Seccion n={3} titulo="Anticorrupción">
        <p>
          Se prohíbe ofrecer, prometer, entregar o aceptar cualquier pago,
          regalo o beneficio destinado a obtener una ventaja indebida, tanto con
          funcionarios públicos como con particulares, conforme a la Ley 1474 de
          2011 y la Ley 1778 de 2016.
        </p>
      </Seccion>

      <Seccion n={4} titulo="Conflictos de interés">
        <p>
          Quien participe en decisiones de compra, contratación o selección de
          proveedores y tenga una relación personal, familiar o económica con
          alguna de las partes involucradas, debe declararlo y apartarse de la
          decisión.
        </p>
      </Seccion>

      <Seccion n={5} titulo="Trato en el trabajo">
        <p>
          No se tolera ninguna forma de acoso, discriminación por razón de
          género, origen, religión, orientación sexual, discapacidad o condición
          social, ni el uso de trabajo infantil o forzoso en ninguna operación
          propia.
        </p>
      </Seccion>

      <Seccion n={6} titulo="Manejo de la información">
        <p>
          La información de clientes, proveedores y trabajadores se usa solo
          para los fines que la originaron. El acceso a los sistemas internos se
          otorga según el rol de cada persona y se retira cuando deja de ser
          necesario.
        </p>
      </Seccion>

      <Seccion n={7} titulo="Canal de reporte">
        <p>
          Cualquier persona —cliente, proveedor, trabajador o tercero— puede
          reportar una conducta contraria a estos principios escribiendo a{" "}
          <a
            href={`mailto:${EMPRESA.correoContacto}`}
            className="text-brand-green-2 underline underline-offset-2"
          >
            {EMPRESA.correoContacto}
          </a>
          , con el asunto «Reporte ético».
        </p>
        <p>
          Los reportes se tratan de forma reservada y no se tomarán represalias
          contra quien reporte de buena fe. Se pueden presentar de forma anónima,
          teniendo en cuenta que ello puede limitar la investigación.
        </p>
      </Seccion>

      <Seccion n={8} titulo="Vigencia">
        <p>
          Este documento rige desde el {EMPRESA.vigenteDesde} y se revisa
          periódicamente.
        </p>
      </Seccion>
    </DocumentoLegal>
  );
}
