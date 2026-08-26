"use client";

import { useMemo } from "react";
import { Search, X, Filter, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  SearchableSelect,
  type SearchableSelectOption,
} from "@/components/ui/searchable-select";
import type { PrediccionesFilterState } from "../../utils/predicciones-filters";
import { PREDICCIONES_FILTER_DEFAULTS } from "../../utils/predicciones-filters";

interface PrediccionesFilterBarProps {
  filters: PrediccionesFilterState;
  onFilterChange: (next: PrediccionesFilterState) => void;
  equipos: string[];
  ciudades: string[];
  totalResultados: number;
  totalOriginal: number;
}

export function PrediccionesFilterBar({
  filters,
  onFilterChange,
  equipos,
  ciudades,
  totalResultados,
  totalOriginal,
}: PrediccionesFilterBarProps) {
  const isFiltered =
    filters.searchQuery !== "" ||
    filters.selectedEquipo !== "all" ||
    filters.selectedCiudad !== "all";

  const handleReset = () => onFilterChange(PREDICCIONES_FILTER_DEFAULTS);

  const equipoOptions: SearchableSelectOption[] = useMemo(
    () => [
      { value: "all", label: "Todos los equipos" },
      ...equipos.map((eq) => ({ value: eq, label: eq })),
    ],
    [equipos],
  );

  const ciudadOptions: SearchableSelectOption[] = useMemo(
    () => [
      { value: "all", label: "Todas las ciudades" },
      ...ciudades.map((c) => ({ value: c, label: c })),
    ],
    [ciudades],
  );

  return (
    <div
      id="predicciones-filter-bar"
      className="relative z-30 w-full flex flex-col gap-3.5 p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg"
    >
      <div className="flex gap-3 items-center flex-wrap sm:flex-nowrap">
        <div className="relative w-full sm:flex-1 flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="predicciones-search"
            type="search"
            placeholder="Buscar por nombre, apodo o apellido…"
            value={filters.searchQuery}
            onChange={(e) =>
              onFilterChange({ ...filters, searchQuery: e.target.value })
            }
            className="pl-10 pr-9 h-10 rounded-xl text-sm border-white/10 bg-black/20 focus-visible:border-primary/50"
            aria-label="Buscar combate o peleador"
          />
          {filters.searchQuery && (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={() => onFilterChange({ ...filters, searchQuery: "" })}
              className="absolute right-3 p-1 rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {equipos.length > 0 && (
          <div className="w-full sm:w-56 shrink-0">
            <SearchableSelect
              id="filter-equipo-predicciones"
              value={filters.selectedEquipo}
              onValueChange={(val) =>
                onFilterChange({ ...filters, selectedEquipo: val })
              }
              options={equipoOptions}
              placeholder="Todos los equipos"
              searchPlaceholder="Buscar equipo..."
              emptyText="No se encontraron equipos"
            />
          </div>
        )}

        {ciudades.length > 0 && (
          <div className="w-full sm:w-56 shrink-0">
            <SearchableSelect
              id="filter-ciudad-predicciones"
              value={filters.selectedCiudad}
              onValueChange={(val) =>
                onFilterChange({ ...filters, selectedCiudad: val })
              }
              options={ciudadOptions}
              placeholder="Todas las ciudades"
              searchPlaceholder="Buscar ciudad..."
              emptyText="No se encontraron ciudades"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5 font-medium">
          <Filter className="h-3.5 w-3.5 text-primary" />
          Mostrando{" "}
          <span className="text-foreground font-bold">
            {totalResultados}
          </span>{" "}
          de <span className="text-foreground">{totalOriginal}</span> combates
          {isFiltered && " (filtrado)"}
        </span>

        {isFiltered && (
          <Button
            id="btn-limpiar-filtros-predicciones"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-7 px-2.5 text-xs text-muted-foreground hover:text-primary flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
}
