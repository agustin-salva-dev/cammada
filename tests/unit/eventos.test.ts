import { describe, it, expect } from "vitest";
import { eventoSchema } from "@/features/eventos/zod";

describe("eventoSchema", () => {
  const validInput = {
    numero: 1,
    fecha: "2026-12-01",
    horaInicio: "19:00",
    horaFin: "23:00",
    lugarNombre: "Arena Principal",
    calle: "Av. Corrientes",
    calleNumero: "1234",
    estado: "PROGRAMADO" as const,
  };

  it("acepta un evento válido", () => {
    const result = eventoSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rechaza número de evento negativo", () => {
    const result = eventoSchema.safeParse({ ...validInput, numero: -1 });
    expect(result.success).toBe(false);
  });

  it("rechaza número de evento igual a 0", () => {
    const result = eventoSchema.safeParse({ ...validInput, numero: 0 });
    expect(result.success).toBe(false);
  });

  it("rechaza horaInicio con formato inválido", () => {
    const result = eventoSchema.safeParse({
      ...validInput,
      horaInicio: "7pm",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza horaFin con formato inválido", () => {
    const result = eventoSchema.safeParse({
      ...validInput,
      horaFin: "25:00",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza lugarNombre vacío", () => {
    const result = eventoSchema.safeParse({
      ...validInput,
      lugarNombre: "",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza calle vacía", () => {
    const result = eventoSchema.safeParse({ ...validInput, calle: "" });
    expect(result.success).toBe(false);
  });

  it("acepta todos los estados de evento posibles", () => {
    const estados = [
      "BORRADOR",
      "PROGRAMADO",
      "CONFIRMADO",
      "FINALIZADO",
      "CANCELADO",
    ] as const;
    for (const estado of estados) {
      const result = eventoSchema.safeParse({ ...validInput, estado });
      expect(result.success).toBe(true);
    }
  });
});
