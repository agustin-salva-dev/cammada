import { describe, it, expect } from "vitest";
import { categoriaPesoSchema } from "@/features/categorias-peso/zod";

describe("categoriaPesoSchema", () => {
  it("acepta datos válidos con límites", () => {
    const result = categoriaPesoSchema.safeParse({
      nombre: "Peso Ligero",
      orden: 1,
      limiteInferior: 65,
      limiteSuperior: 70,
    });
    expect(result.success).toBe(true);
  });

  it("acepta categoría sin límites de peso (ej: Peso Abierto)", () => {
    const result = categoriaPesoSchema.safeParse({
      nombre: "Peso Abierto",
      orden: 0,
    });
    expect(result.success).toBe(true);
  });

  it("rechaza nombre vacío", () => {
    const result = categoriaPesoSchema.safeParse({ nombre: "", orden: 1 });
    expect(result.success).toBe(false);
  });

  it("rechaza nombre que supera los 60 caracteres", () => {
    const result = categoriaPesoSchema.safeParse({
      nombre: "A".repeat(61),
      orden: 1,
    });
    expect(result.success).toBe(false);
  });

  it("rechaza orden negativo", () => {
    const result = categoriaPesoSchema.safeParse({
      nombre: "Peso Mosca",
      orden: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rechaza límites de peso negativos", () => {
    const result = categoriaPesoSchema.safeParse({
      nombre: "Peso Mosca",
      orden: 0,
      limiteInferior: -10,
      limiteSuperior: 50,
    });
    expect(result.success).toBe(false);
  });
});
