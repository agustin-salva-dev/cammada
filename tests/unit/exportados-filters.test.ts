import { describe, it, expect } from "vitest";
import {
  extractUniqueCiudades,
  extractUniqueEquipos,
  filterAndSortExportados,
  type ExportadosFilterState,
} from "@/features/luchadores/utils/exportados-filters";
import type { LuchadorExportadoDetalle } from "@/features/luchadores/actions/exportados";

const mockExportados: LuchadorExportadoDetalle[] = [
  {
    id: "1",
    nombre: "Juan",
    apellido: "Pérez",
    apodo: "El Toro",
    ciudad: "Salta",
    pais: "Argentina",
    ordenExportado: 1,
    equipo: { id: "eq1", nombre: "Team Alpha" },
    categoria: { id: "cat1", nombre: "70 kg" },
    records: [],
  } as unknown as LuchadorExportadoDetalle,
  {
    id: "2",
    nombre: "Carlos",
    apellido: "Gómez",
    apodo: null,
    ciudad: "Córdoba",
    pais: "Argentina",
    ordenExportado: 2,
    equipo: { id: "eq2", nombre: "Beta Gym" },
    categoria: { id: "cat1", nombre: "70 kg" },
    records: [],
  } as unknown as LuchadorExportadoDetalle,
  {
    id: "3",
    nombre: "Ana",
    apellido: "Álvarez",
    apodo: "La Fiera",
    ciudad: "Salta",
    pais: "Argentina",
    ordenExportado: 3,
    equipo: { id: "eq1", nombre: "Team Alpha" },
    categoria: { id: "cat2", nombre: "57 kg" },
    records: [],
  } as unknown as LuchadorExportadoDetalle,
];

describe("exportados-filters utilities", () => {
  it("extrae correctamente ciudades únicas ordenadas alfabéticamente", () => {
    const ciudades = extractUniqueCiudades(mockExportados);
    expect(ciudades).toEqual(["Córdoba", "Salta"]);
  });

  it("extrae correctamente equipos únicos ordenados alfabéticamente", () => {
    const equipos = extractUniqueEquipos(mockExportados);
    expect(equipos).toEqual(["Beta Gym", "Team Alpha"]);
  });

  it("filtra peleadores por término de búsqueda en nombre, apellido o apodo", () => {
    const filters: ExportadosFilterState = {
      searchQuery: "toro",
      selectedCiudad: "all",
      selectedEquipo: "all",
      sortOption: "default",
    };

    const res = filterAndSortExportados(mockExportados, filters);
    expect(res).toHaveLength(1);
    expect(res[0].nombre).toBe("Juan");
  });

  it("filtra peleadores por ciudad y por equipo", () => {
    const filters: ExportadosFilterState = {
      searchQuery: "",
      selectedCiudad: "Salta",
      selectedEquipo: "Team Alpha",
      sortOption: "default",
    };

    const res = filterAndSortExportados(mockExportados, filters);
    expect(res).toHaveLength(2);
    expect(res.map((r) => r.nombre)).toEqual(["Juan", "Ana"]);
  });

  it("ordena alfabéticamente A-Z por nombre y apellido", () => {
    const filters: ExportadosFilterState = {
      searchQuery: "",
      selectedCiudad: "all",
      selectedEquipo: "all",
      sortOption: "name-asc",
    };

    const res = filterAndSortExportados(mockExportados, filters);
    expect(res.map((r) => `${r.nombre} ${r.apellido}`)).toEqual([
      "Ana Álvarez",
      "Carlos Gómez",
      "Juan Pérez",
    ]);
  });

  it("ordena alfabéticamente Z-A por nombre y apellido", () => {
    const filters: ExportadosFilterState = {
      searchQuery: "",
      selectedCiudad: "all",
      selectedEquipo: "all",
      sortOption: "name-desc",
    };

    const res = filterAndSortExportados(mockExportados, filters);
    expect(res.map((r) => `${r.nombre} ${r.apellido}`)).toEqual([
      "Juan Pérez",
      "Carlos Gómez",
      "Ana Álvarez",
    ]);
  });
});
