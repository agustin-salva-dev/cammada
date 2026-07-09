import { describe, it, expect } from "vitest";
import { equipoSchema } from "@/features/equipos/zod";

describe("equipoSchema", () => {
  it("acepta un equipo válido", () => {
    const result = equipoSchema.safeParse({
      nombre: "Team Alpha",
      pais: "Argentina",
      ciudad: "Rosario",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza nombre vacío", () => {
    const result = equipoSchema.safeParse({
      nombre: "",
      pais: "Argentina",
      ciudad: "Rosario",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza nombre que supera los 100 caracteres", () => {
    const result = equipoSchema.safeParse({
      nombre: "A".repeat(101),
      pais: "Argentina",
      ciudad: "Rosario",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza país vacío", () => {
    const result = equipoSchema.safeParse({
      nombre: "Team Alpha",
      pais: "",
      ciudad: "Rosario",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza ciudad vacía", () => {
    const result = equipoSchema.safeParse({
      nombre: "Team Alpha",
      pais: "Argentina",
      ciudad: "",
    });
    expect(result.success).toBe(false);
  });
});
