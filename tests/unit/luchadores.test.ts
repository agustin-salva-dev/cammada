import { describe, it, expect } from "vitest";
import { luchadorSchema, recordSchema } from "@/features/luchadores/zod";

describe("recordSchema", () => {
  it("acepta un récord válido", () => {
    const result = recordSchema.safeParse({
      victorias: 10,
      derrotas: 2,
      empates: 1,
    });
    expect(result.success).toBe(true);
  });

  it("acepta récord con valores por defecto (sin pasar números)", () => {
    const result = recordSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.victorias).toBe(0);
      expect(result.data.derrotas).toBe(0);
      expect(result.data.empates).toBe(0);
    }
  });

  it("rechaza victorias negativas", () => {
    const result = recordSchema.safeParse({ victorias: -1 });
    expect(result.success).toBe(false);
  });
});

describe("luchadorSchema", () => {
  it("acepta un luchador con todos los campos válidos", () => {
    const result = luchadorSchema.safeParse({
      nombre: "Juan",
      apodo: "El Toro",
      apellido: "García",
      edad: 25,
      altura: 180,
      ultimoPeso: 77.5,
      pais: "Argentina",
      ciudad: "Buenos Aires",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza edad menor a 14 años", () => {
    const result = luchadorSchema.safeParse({ edad: 13 });
    expect(result.success).toBe(false);
  });

  it("rechaza edad mayor a 80 años", () => {
    const result = luchadorSchema.safeParse({ edad: 81 });
    expect(result.success).toBe(false);
  });

  it("rechaza altura menor a 140 cm", () => {
    const result = luchadorSchema.safeParse({ altura: 100 });
    expect(result.success).toBe(false);
  });

  it("rechaza altura mayor a 230 cm", () => {
    const result = luchadorSchema.safeParse({ altura: 250 });
    expect(result.success).toBe(false);
  });

  it("rechaza peso negativo o cero", () => {
    const result = luchadorSchema.safeParse({ ultimoPeso: 0 });
    expect(result.success).toBe(false);
  });

  it("acepta campos opcionales como null", () => {
    const result = luchadorSchema.safeParse({
      nombre: "Maria",
      edad: null,
      altura: null,
    });
    expect(result.success).toBe(true);
  });
});
