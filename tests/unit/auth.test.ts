import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema } from "@/features/auth/zod";

describe("loginSchema", () => {
  it("acepta credenciales válidas", () => {
    const result = loginSchema.safeParse({
      email: "usuario@cammada.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza email con formato inválido", () => {
    const result = loginSchema.safeParse({
      email: "no-es-un-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza email vacío", () => {
    const result = loginSchema.safeParse({ email: "", password: "password123" });
    expect(result.success).toBe(false);
  });

  it("rechaza contraseña vacía", () => {
    const result = loginSchema.safeParse({
      email: "usuario@cammada.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  const validInput = {
    nombre: "Juan",
    email: "juan@cammada.com",
    password: "Segura123!",
  };

  it("acepta un registro válido", () => {
    const result = registerSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rechaza nombre con menos de 2 caracteres", () => {
    const result = registerSchema.safeParse({ ...validInput, nombre: "A" });
    expect(result.success).toBe(false);
  });

  it("rechaza contraseña sin número", () => {
    const result = registerSchema.safeParse({
      ...validInput,
      password: "SoloLetras!",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza contraseña sin carácter especial", () => {
    const result = registerSchema.safeParse({
      ...validInput,
      password: "SoloLetras1",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza contraseña de menos de 8 caracteres", () => {
    const result = registerSchema.safeParse({
      ...validInput,
      password: "Ab1!",
    });
    expect(result.success).toBe(false);
  });

  it("acepta registro sin teléfono ni imagen (campos opcionales)", () => {
    const result = registerSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rechaza URL de imagen inválida", () => {
    const result = registerSchema.safeParse({
      ...validInput,
      imagen: "no-es-una-url",
    });
    expect(result.success).toBe(false);
  });
});
