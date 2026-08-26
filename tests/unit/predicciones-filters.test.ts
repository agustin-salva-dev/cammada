import { describe, it, expect } from "vitest";
import {
  filtrarCombatesPrediccion,
  extraerOpcionesFiltros,
  PREDICCIONES_FILTER_DEFAULTS,
} from "@/features/predicciones/utils/predicciones-filters";
import type { CombatePrediccionPublico } from "@/features/predicciones/types";

const mockCombates: CombatePrediccionPublico[] = [
  {
    id: "1",
    tipo: "ESTELAR",
    numeroPelea: 5,
    estado: "PROGRAMADO",
    titulo: true,
    totalVotos: 100,
    votosPeleador1: 60,
    votosPeleador2: 40,
    porcentajePeleador1: 60,
    porcentajePeleador2: 40,
    ganadorId: null,
    prediccionHabilitada: true,
    miVotoId: null,
    categoriaPeso: { id: "cat-1", nombre: "Peso Ligero" },
    modalidad: { id: "mod-1", nombre: "MMA" },
    peleador1: {
      id: "p1",
      nombre: "Juan",
      apellido: "Pérez",
      apodo: "El Toro",
      ciudad: "Buenos Aires",
      equipo: { id: "eq1", nombre: "Chute Boxe" },
      victorias: 10,
      derrotas: 2,
      empates: 0,
    },
    peleador2: {
      id: "p2",
      nombre: "Carlos",
      apellido: "Silva",
      apodo: "Pitbull",
      ciudad: "Córdoba",
      equipo: { id: "eq2", nombre: "Nova Uniao" },
      victorias: 8,
      derrotas: 1,
      empates: 0,
    },
  },
  {
    id: "2",
    tipo: "CARTELERA_PRINCIPAL",
    numeroPelea: 4,
    estado: "PROGRAMADO",
    titulo: false,
    totalVotos: 50,
    votosPeleador1: 30,
    votosPeleador2: 20,
    porcentajePeleador1: 60,
    porcentajePeleador2: 40,
    ganadorId: null,
    prediccionHabilitada: true,
    miVotoId: null,
    categoriaPeso: { id: "cat-2", nombre: "Peso Gallo" },
    modalidad: { id: "mod-1", nombre: "MMA" },
    peleador1: {
      id: "p3",
      nombre: "Marcos",
      apellido: "González",
      apodo: "El Rayo",
      ciudad: "Rosario",
      equipo: { id: "eq1", nombre: "Chute Boxe" },
      victorias: 5,
      derrotas: 0,
      empates: 0,
    },
    peleador2: {
      id: "p4",
      nombre: "Esteban",
      apellido: "Ríos",
      apodo: "La Fiera",
      ciudad: "Mendoza",
      equipo: { id: "eq3", nombre: "Alliance" },
      victorias: 7,
      derrotas: 3,
      empates: 0,
    },
  },
];

describe("extraerOpcionesFiltros", () => {
  it("debe extraer y ordenar los equipos y ciudades sin duplicados", () => {
    const { equipos, ciudades } = extraerOpcionesFiltros(mockCombates);

    expect(equipos).toEqual(["Alliance", "Chute Boxe", "Nova Uniao"]);
    expect(ciudades).toEqual(["Buenos Aires", "Córdoba", "Mendoza", "Rosario"]);
  });
});

describe("filtrarCombatesPrediccion", () => {
  it("debe retornar todos los combates con los filtros por defecto", () => {
    const res = filtrarCombatesPrediccion(mockCombates, PREDICCIONES_FILTER_DEFAULTS);
    expect(res).toHaveLength(2);
  });

  it("debe filtrar por nombre de peleador (case-insensitive)", () => {
    const res = filtrarCombatesPrediccion(mockCombates, {
      ...PREDICCIONES_FILTER_DEFAULTS,
      searchQuery: "juan",
    });
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe("1");
  });

  it("debe filtrar por apellido de peleador (case-insensitive)", () => {
    const res = filtrarCombatesPrediccion(mockCombates, {
      ...PREDICCIONES_FILTER_DEFAULTS,
      searchQuery: "gonzalez",
    });
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe("2");
  });

  it("debe filtrar por apodo de peleador (case-insensitive y con acentos)", () => {
    const res = filtrarCombatesPrediccion(mockCombates, {
      ...PREDICCIONES_FILTER_DEFAULTS,
      searchQuery: "pitbull",
    });
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe("1");
  });

  it("debe filtrar por equipo", () => {
    const res = filtrarCombatesPrediccion(mockCombates, {
      ...PREDICCIONES_FILTER_DEFAULTS,
      selectedEquipo: "Alliance",
    });
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe("2");
  });

  it("debe filtrar por ciudad", () => {
    const res = filtrarCombatesPrediccion(mockCombates, {
      ...PREDICCIONES_FILTER_DEFAULTS,
      selectedCiudad: "Córdoba",
    });
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe("1");
  });

  it("debe retornar vacío si no hay coincidencias", () => {
    const res = filtrarCombatesPrediccion(mockCombates, {
      ...PREDICCIONES_FILTER_DEFAULTS,
      searchQuery: "inexistente",
    });
    expect(res).toHaveLength(0);
  });
});
