import type { EquipoPublico } from "@/features/equipos/actions/public";

export type EquiposNameSort = "name-asc" | "name-desc";
export type EquiposCountSort = "none" | "count-desc" | "count-asc";

export interface EquiposFilterState {
  searchQuery: string;
  nameSort: EquiposNameSort;
  countSort: EquiposCountSort;
}

export const EQUIPOS_FILTER_DEFAULTS: EquiposFilterState = {
  searchQuery: "",
  nameSort: "name-asc",
  countSort: "none",
};

export function filterAndSortEquipos(
  equipos: EquipoPublico[],
  filters: EquiposFilterState,
): EquipoPublico[] {
  const query = filters.searchQuery.trim().toLowerCase();

  const filtered = equipos.filter((e) => {
    if (query) {
      const matches =
        e.nombre.toLowerCase().includes(query) ||
        (e.ciudad && e.ciudad.toLowerCase().includes(query)) ||
        (e.pais && e.pais.toLowerCase().includes(query));
      if (!matches) return false;
    }
    return true;
  });

  return [...filtered].sort((a, b) => {
    if (filters.countSort === "count-desc") {
      const diff = b.luchadores.length - a.luchadores.length;
      if (diff !== 0) return diff;
    } else if (filters.countSort === "count-asc") {
      const diff = a.luchadores.length - b.luchadores.length;
      if (diff !== 0) return diff;
    }

    if (filters.nameSort === "name-desc") {
      return b.nombre.localeCompare(a.nombre, "es");
    }
    return a.nombre.localeCompare(b.nombre, "es");
  });
}

export function isEquiposFiltered(filters: EquiposFilterState): boolean {
  return (
    Boolean(filters.searchQuery.trim()) ||
    filters.nameSort !== "name-asc" ||
    filters.countSort !== "none"
  );
}
