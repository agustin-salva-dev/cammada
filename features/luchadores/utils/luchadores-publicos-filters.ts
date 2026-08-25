import type { LuchadorPublico } from "@/features/luchadores/actions/public";

export type LuchadoresSortOption = "name-asc" | "name-desc" | "wins-desc";

export interface LuchadoresFilterState {
  searchQuery: string;
  selectedCategoria: string;
  selectedEquipo: string;
  selectedCiudad: string;
  sortOption: LuchadoresSortOption;
}

export const LUCHADORES_FILTER_DEFAULTS: LuchadoresFilterState = {
  searchQuery: "",
  selectedCategoria: "all",
  selectedEquipo: "all",
  selectedCiudad: "all",
  sortOption: "name-asc",
};

export function extractUniqueCategorias(
  luchadores: LuchadorPublico[],
): Array<{ id: string; nombre: string }> {
  const map = new Map<string, string>();
  luchadores.forEach((l) => {
    if (l.categoria) map.set(l.categoria.id, l.categoria.nombre);
  });
  return Array.from(map.entries())
    .map(([id, nombre]) => ({ id, nombre }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

export function extractUniqueEquiposFromLuchadores(
  luchadores: LuchadorPublico[],
): string[] {
  const set = new Set<string>();
  luchadores.forEach((l) => {
    if (
      l.equipo?.nombre &&
      l.equipo.nombre.trim() &&
      l.equipo.nombre !== "Sin equipo"
    )
      set.add(l.equipo.nombre.trim());
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
}

export function extractUniqueCiudadesFromLuchadores(
  luchadores: LuchadorPublico[],
): string[] {
  const set = new Set<string>();
  luchadores.forEach((l) => {
    if (
      l.ciudad &&
      l.ciudad.trim() &&
      l.ciudad.toLowerCase() !== "desconocida"
    ) {
      set.add(l.ciudad.trim());
    }
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
}

export function filterAndSortLuchadores(
  luchadores: LuchadorPublico[],
  filters: LuchadoresFilterState,
): LuchadorPublico[] {
  const query = filters.searchQuery.trim().toLowerCase();

  const filtered = luchadores.filter((l) => {
    if (query) {
      const fullName = `${l.nombre} ${l.apellido}`.toLowerCase();
      const apodo = (l.apodo ?? "").toLowerCase();
      const matches =
        l.nombre.toLowerCase().includes(query) ||
        l.apellido.toLowerCase().includes(query) ||
        apodo.includes(query) ||
        fullName.includes(query);
      if (!matches) return false;
    }

    if (
      filters.selectedCategoria !== "all" &&
      l.categoria?.id !== filters.selectedCategoria
    ) {
      return false;
    }

    if (
      filters.selectedEquipo !== "all" &&
      l.equipo?.nombre !== filters.selectedEquipo
    ) {
      return false;
    }

    if (
      filters.selectedCiudad !== "all" &&
      l.ciudad !== filters.selectedCiudad
    ) {
      return false;
    }

    return true;
  });

  return [...filtered].sort((a, b) => {
    switch (filters.sortOption) {
      case "name-desc":
        return `${b.nombre} ${b.apellido}`.localeCompare(
          `${a.nombre} ${a.apellido}`,
          "es",
        );
      case "wins-desc": {
        const winsA = a.records.reduce((sum, r) => sum + r.victorias, 0);
        const winsB = b.records.reduce((sum, r) => sum + r.victorias, 0);
        if (winsB !== winsA) return winsB - winsA;
        return `${a.nombre} ${a.apellido}`.localeCompare(
          `${b.nombre} ${b.apellido}`,
          "es",
        );
      }
      case "name-asc":
      default:
        return `${a.nombre} ${a.apellido}`.localeCompare(
          `${b.nombre} ${b.apellido}`,
          "es",
        );
    }
  });
}

export function isLuchadoresFiltered(filters: LuchadoresFilterState): boolean {
  return (
    Boolean(filters.searchQuery.trim()) ||
    filters.selectedCategoria !== "all" ||
    filters.selectedEquipo !== "all" ||
    filters.selectedCiudad !== "all" ||
    filters.sortOption !== "name-asc"
  );
}
