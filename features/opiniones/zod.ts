import { z } from "zod";

const safeString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .regex(
      /^[^\x00-\x08\x0B\x0C\x0E-\x1F\x7F]*$/,
      "Contiene caracteres no permitidos",
    );

export const opinionSchema = z.object({
  nombreUsuario: safeString(50).optional().default("Anónimo"),
  rolParticipante: z
    .enum(["ATLETA", "ESPECTADOR", "COACH", "OTRO"])
    .default("OTRO"),
  tipo: z.enum(["COMENTARIO", "SUGERENCIA"]).default("COMENTARIO"),
  titulo: safeString(100).min(3, "El título debe tener al menos 3 caracteres"),
  descripcion: safeString(2000).min(
    10,
    "La descripción debe tener al menos 10 caracteres",
  ),
  categoria: z
    .enum([
      "WEB_PLATAFORMA",
      "ORGANIZACION",
      "LUGAR_INSTALACIONES",
      "KIT_PREMIACION",
      "GENERAL",
    ])
    .default("GENERAL"),
  estrellas: z.number().int().min(1).max(5).optional(),
});

export const valoracionAspectoSchema = z.object({
  categoria: z.enum([
    "WEB_PLATAFORMA",
    "ORGANIZACION",
    "LUGAR_INSTALACIONES",
    "KIT_PREMIACION",
    "GENERAL",
  ]),
  estrellas: z
    .number()
    .int()
    .min(1, "Mínimo 1 estrella")
    .max(5, "Máximo 5 estrellas"),
});

export const valoracionesSchema = z
  .array(valoracionAspectoSchema)
  .min(1)
  .max(5);

export const npsSchema = z.object({
  nps: z.number().int().min(0, "Mínimo 0").max(10, "Máximo 10"),
  intencionRetorno: z
    .number()
    .int()
    .min(1, "Mínimo 1 estrella")
    .max(5, "Máximo 5 estrellas"),
  satisfaccionWeb: z
    .number()
    .int()
    .min(1, "Mínimo 1 estrella")
    .max(5, "Máximo 5 estrellas"),
});

export const votarSugerenciaSchema = z.object({
  opinionId: z.string().uuid("ID de opinión inválido"),
});

export const respuestaOficialSchema = z.object({
  opinionId: z.string().uuid("ID de opinión inválido"),
  contenido: safeString(1000).min(
    5,
    "La respuesta debe tener al menos 5 caracteres",
  ),
});

export const moderarOpinionSchema = z.object({
  opinionId: z.string().uuid("ID de opinión inválido"),
  estado: z.enum(["APROBADA", "RECHAZADA"]),
});

export const eliminarOpinionSchema = z.object({
  opinionId: z.string().uuid("ID de opinión inválido"),
});

export const eliminarOpinionesSchema = z.object({
  opinionIds: z
    .array(z.string().uuid("ID de opinión inválido"))
    .min(1, "Debe seleccionar al menos una opinión"),
});

export type OpinionFormData = z.infer<typeof opinionSchema>;
export type ValoracionAspectoData = z.infer<typeof valoracionAspectoSchema>;
export type ValoracionesData = z.infer<typeof valoracionesSchema>;
export type NPSData = z.infer<typeof npsSchema>;
export type RespuestaOficialData = z.infer<typeof respuestaOficialSchema>;
export type EliminarOpinionData = z.infer<typeof eliminarOpinionSchema>;
export type EliminarOpinionesData = z.infer<typeof eliminarOpinionesSchema>;

