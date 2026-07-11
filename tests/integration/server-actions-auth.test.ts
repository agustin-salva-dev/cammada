import { describe, it, expect, vi, beforeEach } from "vitest";
import type { MockInstance } from "vitest";
import type { Session } from "next-auth";
import type { RolConfig } from "@prisma/client";
import { DEFAULT_ROLE_PERMISSIONS } from "@/constants/permissions";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    rolConfig: {
      findUnique: vi.fn(),
    },
    luchador: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    evento: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    categoriaPeso: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// --- Importaciones de los módulos bajo prueba ---

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  createLuchador,
  updateLuchador,
  deleteLuchador,
} from "@/features/luchadores/actions";
import {
  createEvento,
  updateEvento,
  deleteEvento,
} from "@/features/eventos/actions";
import {
  createCategoriaPeso,
  updateCategoriaPeso,
  deleteCategoriaPeso,
} from "@/features/categorias-peso/actions";

const mockAuth = auth as unknown as MockInstance<() => Promise<Session | null>>;
const mockRolConfigFindUnique = db.rolConfig
  .findUnique as unknown as MockInstance<typeof db.rolConfig.findUnique>;

const SESSION_AYUDANTE: Session = {
  user: {
    id: "ayudante-test-id",
    name: "Ayudante de Prueba",
    email: "ayudante@test.com",
    role: "AYUDANTE",
  },
  expires: "9999-12-31",
};

const PERMISOS_AYUDANTE = DEFAULT_ROLE_PERMISSIONS["AYUDANTE"];

const MOCK_ROL_AYUDANTE: RolConfig = {
  id: "mock-rol-ayudante-id",
  nombre: "AYUDANTE",
  permisos: [...PERMISOS_AYUDANTE],
  isSystem: true,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

describe("Server Actions — Sin sesión activa (no autenticado)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockImplementation(async () => null);
  });

  describe("Luchadores", () => {
    it("createLuchador → devuelve error de autenticación", async () => {
      const result = await createLuchador({ nombre: "Test" });
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/no autenticado/i);
    });

    it("updateLuchador → devuelve error de autenticación", async () => {
      const result = await updateLuchador("cualquier-id", { nombre: "Test" });
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/no autenticado/i);
    });

    it("deleteLuchador → devuelve error de autenticación", async () => {
      const result = await deleteLuchador("cualquier-id");
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/no autenticado/i);
    });
  });

  describe("Eventos", () => {
    it("createEvento → devuelve error de autenticación", async () => {
      const result = await createEvento({ numero: 1 });
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/no autenticado/i);
    });

    it("updateEvento → devuelve error de autenticación", async () => {
      const result = await updateEvento("cualquier-id", { numero: 1 });
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/no autenticado/i);
    });

    it("deleteEvento → devuelve error de autenticación", async () => {
      const result = await deleteEvento("cualquier-id");
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/no autenticado/i);
    });
  });

  describe("Categorías de Peso", () => {
    it("createCategoriaPeso → devuelve error de autenticación", async () => {
      const result = await createCategoriaPeso({ nombre: "Test" });
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/no autenticado/i);
    });

    it("updateCategoriaPeso → devuelve error de autenticación", async () => {
      const result = await updateCategoriaPeso("cualquier-id", {
        nombre: "Test",
      });
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/no autenticado/i);
    });

    it("deleteCategoriaPeso → devuelve error de autenticación", async () => {
      const result = await deleteCategoriaPeso("cualquier-id");
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/no autenticado/i);
    });
  });
});

describe("Server Actions — Con rol AYUDANTE (solo lectura)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue(SESSION_AYUDANTE);
    mockRolConfigFindUnique.mockResolvedValue(MOCK_ROL_AYUDANTE);
  });

  describe("Luchadores — mutations prohibidas", () => {
    it("createLuchador → devuelve error de permisos", async () => {
      const result = await createLuchador({
        nombre: "Juan",
        apellido: "García",
        apodo: "El Toro",
      });
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/permisos/i);
    });

    it("updateLuchador → devuelve error de permisos", async () => {
      const result = await updateLuchador("luchador-001", { nombre: "Juan" });
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/permisos/i);
    });

    it("deleteLuchador → devuelve error de permisos", async () => {
      const result = await deleteLuchador("luchador-001");
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/permisos/i);
    });
  });

  describe("Eventos — mutations prohibidas", () => {
    it("createEvento → devuelve error de permisos", async () => {
      const result = await createEvento({
        numero: 1,
        fecha: "2026-12-01",
        estado: "PROGRAMADO",
      });
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/permisos/i);
    });

    it("updateEvento → devuelve error de permisos", async () => {
      const result = await updateEvento("evento-001", { numero: 2 });
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/permisos/i);
    });

    it("deleteEvento → devuelve error de permisos", async () => {
      const result = await deleteEvento("evento-001");
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/permisos/i);
    });
  });

  describe("Categorías de Peso — mutations prohibidas", () => {
    it("createCategoriaPeso → devuelve error de permisos", async () => {
      const result = await createCategoriaPeso({ nombre: "Peso Pesado" });
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/permisos/i);
    });

    it("updateCategoriaPeso → devuelve error de permisos", async () => {
      const result = await updateCategoriaPeso("cat-001", {
        nombre: "Peso Pluma",
      });
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/permisos/i);
    });

    it("deleteCategoriaPeso → devuelve error de permisos", async () => {
      const result = await deleteCategoriaPeso("cat-001");
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/permisos/i);
    });
  });
});
