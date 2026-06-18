import { z } from "zod";

export const recordSchema = z.object({
  modalidad: z.string().optional().nullable(),
  victorias: z.number().int().nonnegative().optional().default(0),
  derrotas: z.number().int().nonnegative().optional().default(0),
  empates: z.number().int().nonnegative().optional().default(0),
});

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
});

export type LuchadorInput = z.infer<typeof luchadorSchema>;
