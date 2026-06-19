import { z } from "zod";

export const equipoSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre del equipo es obligatorio")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  pais: z
    .string()
    .min(1, "El país es obligatorio"),
  ciudad: z
    .string()
    .min(1, "La ciudad es obligatoria"),
});

export type EquipoFormData = z.infer<typeof equipoSchema>;
