"use client";

import { Mail, MessageCircle } from "lucide-react";
import { linkCorreo, linkWhatsApp } from "@/lib/contacto";
import { useLocale } from "@/context/LocaleContext";

type Props = {
  // Texto que queda escrito en el chat de WhatsApp / cuerpo del correo.
  mensaje: string;
  asunto: string;
  // El botón de WhatsApp es el principal salvo que se indique lo contrario.
  variante?: "principal" | "secundaria";
};

// Par de botones "WhatsApp / Correo" con el mensaje ya redactado. El de
// correo desaparece solo si todavía no hay correo configurado en
// lib/contacto.ts, para no ofrecer un enlace que abriría el cliente de
// correo con el destinatario vacío.
export default function BotonesContacto({
  mensaje,
  asunto,
  variante = "principal",
}: Props) {
  const { t } = useLocale();
  const correo = linkCorreo({ asunto, cuerpo: mensaje });

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={linkWhatsApp(mensaje)}
        target="_blank"
        rel="noopener noreferrer"
        className={`btn ${variante === "principal" ? "btn-primary" : "btn-outline"}`}
      >
        <MessageCircle className="h-[18px] w-[18px] shrink-0" />
        {t.contacto.escribirWhatsApp}
      </a>

      {correo && (
        <a href={correo} className="btn btn-outline">
          <Mail className="h-[18px] w-[18px] shrink-0" />
          {t.contacto.escribirCorreo}
        </a>
      )}
    </div>
  );
}
