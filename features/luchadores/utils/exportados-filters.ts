import type { LuchadorExportadoDetalle } from "@/features/luchadores/actions/exportados";

export type ExportadosSortOption = "default" | "name-asc" | "name-desc";

export interface ExportadosFilterState {
  searchQuery: string;
  selectedCiudad: string;
  selectedEquipo: string;
  sortOption: ExportadosSortOption;
}

/**
 * Extrae la lista única y ordenada de ciudades de los peleadores exportados.
 */
export function extractUniqueCiudades(
  exportados: LuchadorExportadoDetalle[],
): string[] {
  const ciudadesSet = new Set<string>();

  exportados.forEach((p) => {
    if (p.ciudad && p.ciudad.trim() && p.ciudad !== "Desconocida") {
      ciudadesSet.add(p.ciudad.trim());
    }
  });

  return Array.from(ciudadesSet).sort((a, b) =>
    a.localeCompare(b, "es", { sensitivity: "base" }),
  );
}

/**
 * Extrae la lista única y ordenada de equipos de los peleadores exportados.
 */
export function extractUniqueEquipos(
  exportados: LuchadorExportadoDetalle[],
): string[] {
  const equiposSet = new Set<string>();

  exportados.forEach((p) => {
    if (
      p.equipo?.nombre &&
      p.equipo.nombre.trim() &&
      p.equipo.nombre !== "Sin equipo"
    ) {
      equiposSet.add(p.equipo.nombre.trim());
    }
  });

  return Array.from(equiposSet).sort((a, b) =>
    a.localeCompare(b, "es", { sensitivity: "base" }),
  );
}

/**
 * Filtra y ordena la lista de peleadores exportados según el estado de filtros.
 */
export function filterAndSortExportados(
  exportados: LuchadorExportadoDetalle[],
  filters: ExportadosFilterState,
): LuchadorExportadoDetalle[] {
  const query = filters.searchQuery.trim().toLowerCase();
  const selectedCiudad = filters.selectedCiudad;
  const selectedEquipo = filters.selectedEquipo;
  const sortOption = filters.sortOption;

  // 1. Filtrar
  const filtered = exportados.filter((peleador) => {
    // Filtro por texto de búsqueda
    if (query) {
      const nombre = peleador.nombre.toLowerCase();
      const apellido = peleador.apellido.toLowerCase();
      const apodo = (peleador.apodo || "").toLowerCase();
      const nombreCompleto = `${nombre} ${apellido}`;
      const nombreConApodo = `${nombre} ${apodo} ${apellido}`;

      const matchesSearch =
        nombre.includes(query) ||
        apellido.includes(query) ||
        apodo.includes(query) ||
        nombreCompleto.includes(query) ||
        nombreConApodo.includes(query);

      if (!matchesSearch) return false;
    }

    // Filtro por Ciudad
    if (selectedCiudad && selectedCiudad !== "all") {
      if (peleador.ciudad !== selectedCiudad) return false;
    }

    // Filtro por Equipo
    if (selectedEquipo && selectedEquipo !== "all") {
      if (peleador.equipo?.nombre !== selectedEquipo) return false;
    }

    return true;
  });

  // 2. Ordenar
  return [...filtered].sort((a, b) => {
    if (sortOption === "name-asc") {
      const nameA = `${a.nombre} ${a.apellido}`.toLowerCase();
      const nameB = `${b.nombre} ${b.apellido}`.toLowerCase();
      return nameA.localeCompare(nameB, "es", { sensitivity: "base" });
    }

    if (sortOption === "name-desc") {
      const nameA = `${a.nombre} ${a.apellido}`.toLowerCase();
      const nameB = `${b.nombre} ${b.apellido}`.toLowerCase();
      return nameB.localeCompare(nameA, "es", { sensitivity: "base" });
    }

    // Default: preserva el orden original del servidor (ordenExportado, updatedAt)
    return (a.ordenExportado ?? 0) - (b.ordenExportado ?? 0);
  });
}
