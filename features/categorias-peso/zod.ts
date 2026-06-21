import { z } from "zod";

export const categoriaPesoSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(60, "El nombre no puede superar los 60 caracteres"),
  orden: z.number().int().nonnegative().default(0),
  limiteInferior: z.number().int().nonnegative().nullable().optional(),
  limiteSuperior: z.number().int().nonnegative().nullable().optional(),
});

export type CategoriaPesoFormData = z.infer<typeof categoriaPesoSchema>;
