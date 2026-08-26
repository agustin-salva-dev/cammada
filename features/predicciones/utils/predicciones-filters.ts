import type { CombatePrediccionPublico } from "../types";

export interface PrediccionesFilterState {
  searchQuery: string;
  selectedEquipo: string;
  selectedCiudad: string;
}

export const PREDICCIONES_FILTER_DEFAULTS: PrediccionesFilterState = {
  searchQuery: "",
  selectedEquipo: "all",
  selectedCiudad: "all",
};

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function extraerOpcionesFiltros(combates: CombatePrediccionPublico[]) {
  const equiposSet = new Set<string>();
  const ciudadesSet = new Set<string>();

  for (const c of combates) {
    if (c.peleador1.equipo?.nombre) equiposSet.add(c.peleador1.equipo.nombre);
    if (c.peleador2.equipo?.nombre) equiposSet.add(c.peleador2.equipo.nombre);
    if (c.peleador1.ciudad) ciudadesSet.add(c.peleador1.ciudad);
    if (c.peleador2.ciudad) ciudadesSet.add(c.peleador2.ciudad);
  }

  return {
    equipos: Array.from(equiposSet).sort((a, b) => a.localeCompare(b, "es")),
    ciudades: Array.from(ciudadesSet).sort((a, b) => a.localeCompare(b, "es")),
  };
}

export function filtrarCombatesPrediccion(
  combates: CombatePrediccionPublico[],
  filters: PrediccionesFilterState,
): CombatePrediccionPublico[] {
  const query = normalize(filters.searchQuery);
  const filterEquipo = filters.selectedEquipo;
  const filterCiudad = filters.selectedCiudad;

  return combates.filter((combate) => {
    const { peleador1, peleador2 } = combate;

    if (query) {
      const matchP1 =
        normalize(peleador1.nombre).includes(query) ||
        normalize(peleador1.apellido).includes(query) ||
        normalize(peleador1.apodo).includes(query) ||
        normalize(`${peleador1.nombre} ${peleador1.apellido}`).includes(query);

      const matchP2 =
        normalize(peleador2.nombre).includes(query) ||
        normalize(peleador2.apellido).includes(query) ||
        normalize(peleador2.apodo).includes(query) ||
        normalize(`${peleador2.nombre} ${peleador2.apellido}`).includes(query);

      if (!matchP1 && !matchP2) return false;
    }

    if (filterEquipo !== "all") {
      const matchEquipo =
        peleador1.equipo?.nombre === filterEquipo ||
        peleador2.equipo?.nombre === filterEquipo;

      if (!matchEquipo) return false;
    }

    if (filterCiudad !== "all") {
      const matchCiudad =
        peleador1.ciudad === filterCiudad || peleador2.ciudad === filterCiudad;

      if (!matchCiudad) return false;
    }

    return true;
  });
}
