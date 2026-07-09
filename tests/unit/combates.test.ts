import { describe, it, expect } from "vitest";
import { combateSchema } from "@/features/combates/zod";

const baseInput = {
  peleador1Id: "peleador-uuid-1",
  peleador2Id: "peleador-uuid-2",
  rounds: 3,
  duracionRounds: 5,
  eventoId: "evento-uuid-1",
  tipo: "PRELIMINAR" as const,
  numeroPelea: 1,
  categoriaPesoId: "categoria-uuid-1",
  modalidadId: "modalidad-uuid-1",
  titulo: false,
  estado: "PROGRAMADO" as const,
};

describe("combateSchema — validaciones básicas", () => {
  it("acepta un combate programado válido", () => {
    const result = combateSchema.safeParse(baseInput);
    expect(result.success).toBe(true);
  });

  it("rechaza si peleador1 y peleador2 son el mismo", () => {
    const result = combateSchema.safeParse({
      ...baseInput,
      peleador2Id: "peleador-uuid-1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("peleador2Id");
    }
  });

  it("rechaza rounds fuera de rango (> 20)", () => {
    const result = combateSchema.safeParse({ ...baseInput, rounds: 25 });
    expect(result.success).toBe(false);
  });

  it("rechaza duracion de rounds fuera de rango (> 15)", () => {
    const result = combateSchema.safeParse({ ...baseInput, duracionRounds: 20 });
    expect(result.success).toBe(false);
  });
});

describe("combateSchema — reglas de finalización (FINALIZADO)", () => {
  const baseFinished = {
    ...baseInput,
    estado: "FINALIZADO" as const,
    ganadorId: "peleador-uuid-1",
    viaVictoria: "KO",
    roundFin: 2,
    minutoFin: 3,
    segundoFin: 45,
  };

  it("acepta un combate finalizado con todos los campos de resultado", () => {
    const result = combateSchema.safeParse(baseFinished);
    expect(result.success).toBe(true);
  });

  it("rechaza estado FINALIZADO sin ganador", () => {
    const result = combateSchema.safeParse({
      ...baseFinished,
      ganadorId: undefined,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("ganadorId");
    }
  });

  it("rechaza estado FINALIZADO sin vía de victoria", () => {
    const result = combateSchema.safeParse({
      ...baseFinished,
      viaVictoria: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("viaVictoria");
    }
  });

  it("rechaza roundFin mayor al total de rounds", () => {
    const result = combateSchema.safeParse({
      ...baseFinished,
      rounds: 3,
      roundFin: 5,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("roundFin");
    }
  });

  it("rechaza minutoFin fuera de rango (> 59)", () => {
    const result = combateSchema.safeParse({ ...baseFinished, minutoFin: 60 });
    expect(result.success).toBe(false);
  });

  it("rechaza segundoFin fuera de rango (> 59)", () => {
    const result = combateSchema.safeParse({ ...baseFinished, segundoFin: 60 });
    expect(result.success).toBe(false);
  });
});
