import { describe, it, expect } from "vitest";
import { modalidadSchema } from "@/features/modalidades/zod";

describe("modalidadSchema", () => {
  it("acepta un nombre de modalidad válido", () => {
    const result = modalidadSchema.safeParse({ nombre: "MMA" });
    expect(result.success).toBe(true);
  });

  it("rechaza nombre vacío", () => {
    const result = modalidadSchema.safeParse({ nombre: "" });
    expect(result.success).toBe(false);
  });

  it("rechaza nombre que supera los 60 caracteres", () => {
    const result = modalidadSchema.safeParse({ nombre: "A".repeat(61) });
    expect(result.success).toBe(false);
  });

  it("acepta modalidades comunes del sistema", () => {
    const modalidades = ["MMA", "K1", "Grappling", "Muay Thai", "Boxeo"];
    for (const nombre of modalidades) {
      const result = modalidadSchema.safeParse({ nombre });
      expect(result.success).toBe(true);
    }
  });
});
