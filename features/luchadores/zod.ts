import { z } from "zod";

export const recordSchema = z.object({
  modalidad: z.string().optional().nullable(),
  victorias: z.number().int().nonnegative().optional().default(0),
  derrotas: z.number().int().nonnegative().optional().default(0),
  empates: z.number().int().nonnegative().optional().default(0),
});

const tapologyUrlRegex =
  /^https?:\/\/(www\.)?tapology\.com\/fightcenter\/fighters\/.+/i;

export const luchadorSchema = z.object({
  nombre: z.string().optional().nullable(),
  apodo: z.string().optional().nullable(),
  apellido: z.string().optional().nullable(),
  edad: z.number().int().min(14).max(80).optional().nullable(),
  altura: z.number().int().min(140).max(230).optional().nullable(),
  ultimoPeso: z.number().positive().optional().nullable(),
  pais: z.string().optional().nullable(),
  ciudad: z.string().optional().nullable(),
  equipo: z.string().optional().nullable(),
  categoria: z.string().optional().nullable(),
  records: z.array(recordSchema).optional().default([]),
  esExportado: z.boolean().optional().default(false),
  linkTapology: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => !val || tapologyUrlRegex.test(val),
      "El enlace debe ser una URL válida de Tapology (ej: https://www.tapology.com/fightcenter/fighters/...)",
    ),
});

export type LuchadorInput = z.infer<typeof luchadorSchema>;
