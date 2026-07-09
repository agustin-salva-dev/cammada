import { describe, it, expect } from "vitest";
import { rankingSchema, rankingItemSchema } from "@/features/rankings/zod";

const VALID_UUID = "123e4567-e89b-12d3-a456-426614174000";
const VALID_UUID_2 = "223e4567-e89b-12d3-a456-426614174001";
const VALID_UUID_3 = "323e4567-e89b-12d3-a456-426614174002";

describe("rankingItemSchema", () => {
  it("acepta un item válido", () => {
    const result = rankingItemSchema.safeParse({
      luchadorId: VALID_UUID,
      posicion: 1,
    });
    expect(result.success).toBe(true);
  });

  it("rechaza posición 0 (debe ser positiva)", () => {
    const result = rankingItemSchema.safeParse({
      luchadorId: VALID_UUID,
      posicion: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rechaza posición negativa", () => {
    const result = rankingItemSchema.safeParse({
      luchadorId: VALID_UUID,
      posicion: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rechaza luchadorId que no es un UUID válido", () => {
    const result = rankingItemSchema.safeParse({
      luchadorId: "id-invalido",
      posicion: 1,
    });
    expect(result.success).toBe(false);
  });
});

describe("rankingSchema", () => {
  it("acepta un ranking válido con items", () => {
    const result = rankingSchema.safeParse({
      modalidadId: VALID_UUID,
      categoriaPesoId: VALID_UUID_2,
      campeonId: VALID_UUID_3,
      items: [
        { luchadorId: VALID_UUID_2, posicion: 1 },
        { luchadorId: VALID_UUID_3, posicion: 2 },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("acepta un ranking sin categoría de peso (ranking general)", () => {
    const result = rankingSchema.safeParse({
      modalidadId: VALID_UUID,
      categoriaPesoId: null,
      items: [],
    });
    expect(result.success).toBe(true);
  });

  it("acepta un ranking sin campeón", () => {
    const result = rankingSchema.safeParse({
      modalidadId: VALID_UUID,
      campeonId: null,
      items: [{ luchadorId: VALID_UUID_2, posicion: 1 }],
    });
    expect(result.success).toBe(true);
  });

  it("rechaza modalidadId que no es un UUID válido", () => {
    const result = rankingSchema.safeParse({
      modalidadId: "no-es-uuid",
      items: [],
    });
    expect(result.success).toBe(false);
  });

  it("rechaza campeonId que no es un UUID válido", () => {
    const result = rankingSchema.safeParse({
      modalidadId: VALID_UUID,
      campeonId: "no-es-uuid",
      items: [],
    });
    expect(result.success).toBe(false);
  });
});
