import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { error: "El correo es obligatorio." })
    .email({ error: "Ingresa un correo válido." })
    .trim(),
  password: z
    .string()
    .min(1, { error: "La contraseña es obligatoria." }),
});

export const registerSchema = z.object({
  nombre: z
    .string()
    .min(2, { error: "El nombre debe tener al menos 2 caracteres." })
    .max(25, { error: "El nombre no puede superar los 25 caracteres." })
    .trim(),
  email: z
    .string()
    .min(1, { error: "El correo es obligatorio." })
    .email({ error: "Ingresa un correo válido." })
    .trim(),
  password: z
    .string()
    .min(8, { error: "La contraseña debe tener al menos 8 caracteres." })
    .regex(/[a-zA-Z]/, { error: "Debe contener al menos una letra." })
    .regex(/[0-9]/, { error: "Debe contener al menos un número." })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Debe contener al menos un carácter especial.",
    }),
  telefono: z
    .string()
    .max(20, { error: "El teléfono no puede superar los 20 caracteres." })
    .regex(/^[+\d\s()-]*$/, {
      error: "El teléfono solo puede contener números, +, -, (, ) y espacios.",
    })
    .optional()
    .or(z.literal("")),
  imagen: z
    .string()
    .url({ error: "La URL de la imagen no es válida." })
    .nullish()
    .or(z.literal("")),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
