'use server';

import { prisma } from '@/lib/prisma';
import { contactoSchema, type ContactoFormData } from './schema';

type EnviarContactoResult =
  | { success: true }
  | { success: false; error: string };

export async function enviarContacto(
  data: ContactoFormData
): Promise<EnviarContactoResult> {
  const parsed = contactoSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: 'Los datos enviados no son válidos.',
    };
  }

  try {
    await prisma.mensajeContacto.create({
      data: {
        nombre: parsed.data.nombre,
        correo: parsed.data.correo,
        telefono: parsed.data.telefono || null,
        mensaje: parsed.data.mensaje,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error al guardar mensaje de contacto:', error);
    return {
      success: false,
      error: 'Ocurrió un error al guardar tu mensaje. Intenta de nuevo.',
    };
  }
}