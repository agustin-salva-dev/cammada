import { describe, it, expect } from "vitest";
import {
  opinionSchema,
  npsSchema,
  votarSugerenciaSchema,
  eliminarOpinionSchema,
  eliminarOpinionesSchema,
} from "@/features/opiniones/zod";

describe("Opiniones Zod Schemas", () => {
  describe("opinionSchema", () => {
    it("debe validar correctamente una opinión válida", () => {
      const data = {
        nombreUsuario: "Juan Pérez",
        rolParticipante: "ATLETA",
        tipo: "SUGERENCIA",
        titulo: "Mejorar zona de calentamiento",
        descripcion: "Sería excelente contar con más colchonetas disponibles.",
        categoria: "LUGAR_INSTALACIONES",
        estrellas: 5,
      };

      const result = opinionSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("debe rechazar un título menor a 3 caracteres", () => {
      const data = {
        titulo: "Ok",
        descripcion: "Descripción con más de 10 caracteres válidos.",
      };

      const result = opinionSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.titulo).toContain(
          "El título debe tener al menos 3 caracteres",
        );
      }
    });

    it("debe rechazar una descripción menor a 10 caracteres", () => {
      const data = {
        titulo: "Título Válido",
        descripcion: "Muy corto",
      };

      const result = opinionSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.descripcion).toContain(
          "La descripción debe tener al menos 10 caracteres",
        );
      }
    });

    it("debe aplicar valores por defecto para campos opcionales no provistos", () => {
      const data = {
        titulo: "Opinión General",
        descripcion: "Esta es una opinión general del evento.",
      };

      const result = opinionSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.nombreUsuario).toBe("Anónimo");
        expect(result.data.rolParticipante).toBe("OTRO");
        expect(result.data.tipo).toBe("COMENTARIO");
        expect(result.data.categoria).toBe("GENERAL");
      }
    });
  });

  describe("npsSchema", () => {
    it("debe aceptar valores válidos de NPS (0-10)", () => {
      const result = npsSchema.safeParse({
        nps: 9,
        intencionRetorno: 5,
        satisfaccionWeb: 4,
      });
      expect(result.success).toBe(true);
    });

    it("debe rechazar valores fuera de rango en NPS", () => {
      const result = npsSchema.safeParse({
        nps: 11,
        intencionRetorno: 5,
        satisfaccionWeb: 4,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("votarSugerenciaSchema", () => {
    it("debe validar un UUID válido para opinionId", () => {
      const result = votarSugerenciaSchema.safeParse({
        opinionId: "123e4567-e89b-12d3-a456-426614174000",
      });
      expect(result.success).toBe(true);
    });

    it("debe rechazar un ID no UUID", () => {
      const result = votarSugerenciaSchema.safeParse({
        opinionId: "invalid-id",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("eliminarOpinionSchema & eliminarOpinionesSchema", () => {
    it("debe validar correctamente eliminarOpinionSchema con un UUID", () => {
      const result = eliminarOpinionSchema.safeParse({
        opinionId: "123e4567-e89b-12d3-a456-426614174000",
      });
      expect(result.success).toBe(true);
    });

    it("debe rechazar eliminarOpinionSchema con ID inválido", () => {
      const result = eliminarOpinionSchema.safeParse({
        opinionId: "not-a-uuid",
      });
      expect(result.success).toBe(false);
    });

    it("debe validar un arreglo de UUIDs para eliminarOpinionesSchema", () => {
      const result = eliminarOpinionesSchema.safeParse({
        opinionIds: [
          "123e4567-e89b-12d3-a456-426614174000",
          "223e4567-e89b-12d3-a456-426614174000",
        ],
      });
      expect(result.success).toBe(true);
    });

    it("debe rechazar eliminarOpinionesSchema si el arreglo está vacío", () => {
      const result = eliminarOpinionesSchema.safeParse({
        opinionIds: [],
      });
      expect(result.success).toBe(false);
    });
  });
});

