import { z } from "zod";

export const ROLES = ["ADMIN", "FACTURACION", "EDITOR", "VIEWER"] as const;

export const usuarioCrearSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  role: z.enum(ROLES),
});
export type UsuarioCrearFormValues = z.infer<typeof usuarioCrearSchema>;

export const usuarioEditarSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  email: z.string().email("Correo electrónico inválido"),
  role: z.enum(ROLES),
});
export type UsuarioEditarFormValues = z.infer<typeof usuarioEditarSchema>;
