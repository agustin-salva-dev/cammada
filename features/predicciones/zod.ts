import { z } from "zod";

const uuidSchema = z.string().uuid("ID inválido.");

export const votarPrediccionSchema = z.object({
  combateId: uuidSchema,
  peleadorId: uuidSchema,
});

export const cancelarVotoPrediccionSchema = z.object({
  combateId: uuidSchema,
});

export const togglePrediccionCombateSchema = z.object({
  combateId: uuidSchema,
  habilitada: z.boolean(),
});

export const bulkTogglePrediccionesSchema = z.object({
  eventoId: uuidSchema,
  combateIds: z
    .array(uuidSchema)
    .min(1, "Debe seleccionar al menos un combate."),
  habilitada: z.boolean(),
});

export const resetearVotosCombateSchema = z.object({
  combateId: uuidSchema,
});

export const resetearVotosEventoSchema = z.object({
  eventoId: uuidSchema,
});

export type VotarPrediccionInput = z.infer<typeof votarPrediccionSchema>;
export type CancelarVotoPrediccionInput = z.infer<
  typeof cancelarVotoPrediccionSchema
>;
export type TogglePrediccionCombateInput = z.infer<
  typeof togglePrediccionCombateSchema
>;
export type BulkTogglePrediccionesInput = z.infer<
  typeof bulkTogglePrediccionesSchema
>;
export type ResetearVotosCombateInput = z.infer<
  typeof resetearVotosCombateSchema
>;
export type ResetearVotosEventoInput = z.infer<
  typeof resetearVotosEventoSchema
>;
