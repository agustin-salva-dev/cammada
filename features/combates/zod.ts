import { z } from "zod";

export const TIPOS_COMBATE = [
  "ESTELAR",
  "CO_ESTELAR",
  "CARTELERA_PRINCIPAL",
  "PRELIMINAR",
] as const;

export type TipoCombate = (typeof TIPOS_COMBATE)[number];

export const TIPO_COMBATE_LABELS: Record<TipoCombate, string> = {
  ESTELAR: "Pelea Estelar",
  CO_ESTELAR: "Pelea Co-Estelar",
  CARTELERA_PRINCIPAL: "Cartelera Principal",
  PRELIMINAR: "Pre-Eliminar",
};

export const ESTADOS_COMBATE = [
  "PROGRAMADO",
  "CONFIRMADO",
  "FINALIZADO",
  "CANCELADO",
] as const;

export type EstadoCombate = (typeof ESTADOS_COMBATE)[number];

export const ESTADO_COMBATE_LABELS: Record<EstadoCombate, string> = {
  PROGRAMADO: "Programado",
  CONFIRMADO: "Confirmado",
  FINALIZADO: "Finalizado",
  CANCELADO: "Cancelado",
};

export const combateSchema = z
  .object({
    peleador1Id: z.string().min(1, "Debe seleccionar al Peleador 1"),
    peleador2Id: z.string().min(1, "Debe seleccionar al Peleador 2"),
    rounds: z.coerce.number().int().min(1).max(20).default(3),
    duracionRounds: z.coerce.number().int().min(1).max(15).default(5),
    eventoId: z.string().min(1, "Debe seleccionar un evento"),
    tipo: z.enum(TIPOS_COMBATE).default("PRELIMINAR"),
    numeroPelea: z.coerce.number().int().min(1),
    horarioEstimado: z.string().optional(),
    categoriaPesoId: z
      .string()
      .min(1, "Debe seleccionar una categoría de peso"),
    modalidadId: z.string().min(1, "Debe seleccionar una modalidad"),
    titulo: z.boolean().default(false),
    estado: z.enum(ESTADOS_COMBATE).default("PROGRAMADO"),
    ganadorId: z.string().optional(),
    viaVictoria: z.string().optional(),
    roundFin: z.coerce.number().int().min(1).optional().or(z.literal("")),
    minutoFin: z.coerce
      .number()
      .int()
      .min(0)
      .max(59)
      .optional()
      .or(z.literal("")),
    segundoFin: z.coerce
      .number()
      .int()
      .min(0)
      .max(59)
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (
      data.peleador1Id &&
      data.peleador2Id &&
      data.peleador1Id === data.peleador2Id
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El Peleador 1 y el Peleador 2 no pueden ser el mismo",
        path: ["peleador2Id"],
      });
    }

    if (data.estado === "FINALIZADO") {
      if (!data.ganadorId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Debe seleccionar un ganador para una pelea finalizada",
          path: ["ganadorId"],
        });
      }
      if (!data.viaVictoria || data.viaVictoria.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Debe indicar la vía de la victoria",
          path: ["viaVictoria"],
        });
      }
      if (data.roundFin === "" || data.roundFin === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Debe indicar el round en que finalizó",
          path: ["roundFin"],
        });
      } else if (
        typeof data.roundFin === "number" &&
        data.roundFin > data.rounds
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `El round de fin no puede superar el total de rounds (${data.rounds})`,
          path: ["roundFin"],
        });
      }
      if (data.minutoFin === "" || data.minutoFin === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Debe indicar el minuto en que finalizó",
          path: ["minutoFin"],
        });
      }
      if (data.segundoFin === "" || data.segundoFin === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Debe indicar el segundo en que finalizó",
          path: ["segundoFin"],
        });
      }
    }
  });

export type CombateFormData = z.infer<typeof combateSchema>;

export const ESTADO_COMBATE_BADGE_VARIANT: Record<
  EstadoCombate,
  "default" | "secondary" | "destructive" | "outline" | "green"
> = {
  PROGRAMADO: "outline",
  CONFIRMADO: "green",
  FINALIZADO: "default",
  CANCELADO: "destructive",
};

export const TIPO_COMBATE_BADGE_VARIANT: Record<
  TipoCombate,
  "default" | "secondary" | "destructive" | "outline" | "green"
> = {
  ESTELAR: "default",
  CO_ESTELAR: "secondary",
  CARTELERA_PRINCIPAL: "green",
  PRELIMINAR: "outline",
};
