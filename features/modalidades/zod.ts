import { z } from "zod";

export const modalidadSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(60, "El nombre no puede superar los 60 caracteres"),
});

export type ModalidadFormData = z.infer<typeof modalidadSchema>;
