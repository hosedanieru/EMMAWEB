import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true', // true para puerto 465, false para 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// De quién salen los correos.
//
// Con Microsoft 365, SMTP_USER servía para las dos cosas: era el buzón que
// se autenticaba Y el remitente (Microsoft rechaza enviar "en nombre de"
// otra dirección). Con un proveedor transaccional —Brevo, Resend, SES— eso
// deja de ser cierto: el usuario SMTP es un identificador de la cuenta,
// algo como 9a1b2c001@smtp-brevo.com, que no sirve como remitente ni es una
// dirección a la que alguien pueda responder.
//
// Por eso el remitente se configura aparte en SMTP_FROM. Acepta tanto una
// dirección suelta como el formato con nombre visible:
//   SMTP_FROM="Emma Colombia <pedidos@emmacolombia.com.co>"
// Si no está definido, se cae a SMTP_USER — que es justo el comportamiento
// correcto para el caso de Microsoft 365.
export const remitente = process.env.SMTP_FROM?.trim() || process.env.SMTP_USER;

// Si no hay credenciales, ni vale la pena intentar el envío: nodemailer
// falla igual y solo deja un error en el log por cada pedido, ruido que
// esconde los errores que sí importan. Quien llama esto decide qué hacer
// cuando da false (hoy: el sitio ofrece WhatsApp en su lugar).
//
// En cuanto se llenen las variables en el .env, el envío se reactiva solo,
// sin tocar código.
export const smtpConfigurado = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
);