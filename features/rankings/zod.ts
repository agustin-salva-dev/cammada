import { z } from "zod";

export const rankingItemSchema = z.object({
  luchadorId: z.string().uuid("ID de luchador inválido"),
  posicion: z.number().int().positive("La posición debe ser mayor a 0"),
});

export const rankingSchema = z.object({
  modalidadId: z.string().uuid("La modalidad es obligatoria"),
  categoriaPesoId: z.string().uuid("ID de categoría inválido").nullable().optional(),
  campeonId: z.string().uuid("ID de campeón inválido").nullable().optional(),
  items: z.array(rankingItemSchema),
});

export type RankingFormData = z.infer<typeof rankingSchema>;
export type RankingItemFormData = z.infer<typeof rankingItemSchema>;
