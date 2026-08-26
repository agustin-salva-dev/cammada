import { z } from "zod";

const HORA_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const ESTADOS_EVENTO = [
  "BORRADOR",
  "PROGRAMADO",
  "CONFIRMADO",
  "FINALIZADO",
  "CANCELADO",
] as const;

export type EstadoEvento = (typeof ESTADOS_EVENTO)[number];

export const ESTADOS_EVENTO_PUBLICOS: EstadoEvento[] = [
  "CONFIRMADO",
  "FINALIZADO",
];

export const ESTADO_LABELS: Record<EstadoEvento, string> = {
  BORRADOR: "Borrador",
  PROGRAMADO: "Programado",
  CONFIRMADO: "Confirmado",
  FINALIZADO: "Finalizado",
  CANCELADO: "Cancelado",
};

export const eventoSchema = z.object({
  numero: z
    .number({ error: "El número del evento es obligatorio" })
    .int("Debe ser un número entero")
    .positive("Debe ser un número positivo"),
  fecha: z
    .string({ error: "La fecha es obligatoria" })
    .min(1, "La fecha es obligatoria"),
  horaInicio: z
    .string({ error: "La hora de inicio es obligatoria" })
    .regex(HORA_REGEX, "Formato inválido (HH:MM)"),
  horaFin: z
    .string({ error: "La hora de cierre es obligatoria" })
    .regex(HORA_REGEX, "Formato inválido (HH:MM)"),
  lugarNombre: z
    .string()
    .min(1, "El nombre del lugar es obligatorio")
    .max(200, "El nombre no puede superar los 200 caracteres"),
  calle: z
    .string()
    .min(1, "La calle es obligatoria")
    .max(200, "La calle no puede superar los 200 caracteres"),
  calleNumero: z
    .string()
    .min(1, "El número de calle es obligatorio")
    .max(20, "El número no puede superar los 20 caracteres"),
  estado: z.enum(ESTADOS_EVENTO).default("PROGRAMADO"),
});

export type EventoFormData = z.infer<typeof eventoSchema>;
