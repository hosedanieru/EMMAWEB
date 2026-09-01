import { z } from "zod";

export const TIPOS_CONTRATO = [
  "TIEMPO_COMPLETO",
  "MEDIO_TIEMPO",
  "TEMPORAL",
  "PRACTICA",
] as const;

export const ETIQUETAS_TIPO_CONTRATO: Record<(typeof TIPOS_CONTRATO)[number], string> = {
  TIEMPO_COMPLETO: "Tiempo completo",
  MEDIO_TIEMPO: "Medio tiempo",
  TEMPORAL: "Temporal",
  PRACTICA: "Práctica",
};

export const vacanteSchema = z.object({
  titulo: z.string().min(2, "El título es muy corto"),
  area: z.string().min(2, "El área es muy corta"),
  ubicacion: z.string().min(2, "La ubicación es muy corta"),
  tipo: z.enum(TIPOS_CONTRATO),
  descripcion: z.string().min(10, "La descripción es muy corta"),
  activa: z.boolean(),
});

export type VacanteFormValues = z.infer<typeof vacanteSchema>;
