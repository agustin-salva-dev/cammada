"use client";

import * as React from "react";
import { Search, X, Filter, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import type {
  LuchadoresFilterState,
  LuchadoresSortOption,
} from "@/features/luchadores/utils/luchadores-publicos-filters";
import { LUCHADORES_FILTER_DEFAULTS } from "@/features/luchadores/utils/luchadores-publicos-filters";

interface LuchadoresFilterBarProps {
  filters: LuchadoresFilterState;
  onFilterChange: (next: LuchadoresFilterState) => void;
  categorias: Array<{ id: string; nombre: string }>;
  equipos: string[];
  ciudades: string[];
  totalResultados: number;
  totalOriginal: number;
  isFiltered: boolean;
}

export function LuchadoresFilterBar({
  filters,
  onFilterChange,
  categorias,
  equipos,
  ciudades,
  totalResultados,
  totalOriginal,
  isFiltered,
}: LuchadoresFilterBarProps) {
  const handleReset = React.useCallback(
    () => onFilterChange(LUCHADORES_FILTER_DEFAULTS),
    [onFilterChange],
  );

  return (
    <div className="w-full flex flex-col gap-4 p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-lg">
      <div className="flex gap-3 items-center flex-wrap">
        <div className="relative w-full lg:flex-1 lg:w-fit flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="luchadores-search"
            type="search"
            placeholder="Buscar por nombre, apodo o apellido…"
            value={filters.searchQuery}
            onChange={(e) =>
              onFilterChange({ ...filters, searchQuery: e.target.value })
            }
            className="pl-10 pr-9 h-10 rounded-xl text-sm"
            aria-label="Buscar luchador"
          />
          {filters.searchQuery && (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={() => onFilterChange({ ...filters, searchQuery: "" })}
              className="absolute right-3 p-1 rounded-full text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="w-fit">
          <NativeSelect
            aria-label="Filtrar por categoría de peso"
            value={filters.selectedCategoria}
            onChange={(e) =>
              onFilterChange({ ...filters, selectedCategoria: e.target.value })
            }
            className="h-10 rounded-xl text-sm"
          >
            <NativeSelectOption value="all">
              Todas las categorías
            </NativeSelectOption>
            {categorias.map((c) => (
              <NativeSelectOption key={c.id} value={c.id}>
                {c.nombre}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        <div className="w-fit">
          <NativeSelect
            aria-label="Filtrar por equipo"
            value={filters.selectedEquipo}
            onChange={(e) =>
              onFilterChange({ ...filters, selectedEquipo: e.target.value })
            }
            className="w-fit h-10 rounded-xl text-sm"
          >
            <NativeSelectOption value="all" className="w-fit">
              Todos los equipos
            </NativeSelectOption>
            {equipos.map((eq) => (
              <NativeSelectOption key={eq} value={eq} className="w-fit">
                {eq}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        <div className="w-fit">
          <NativeSelect
            aria-label="Filtrar por ciudad"
            value={filters.selectedCiudad}
            onChange={(e) =>
              onFilterChange({ ...filters, selectedCiudad: e.target.value })
            }
            className="h-10 rounded-xl text-sm"
          >
            <NativeSelectOption value="all" className="w-fit">
              Ciudad
            </NativeSelectOption>
            {ciudades.map((c) => (
              <NativeSelectOption key={c} value={c}>
                {c}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        <div className="w-fit">
          <NativeSelect
            aria-label="Ordenar luchadores"
            value={filters.sortOption}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                sortOption: e.target.value as LuchadoresSortOption,
              })
            }
            className="w-fit h-10 rounded-xl text-sm"
          >
            <NativeSelectOption value="name-asc">
              Nombre (A–Z)
            </NativeSelectOption>
            <NativeSelectOption value="name-desc">
              Nombre (Z–A)
            </NativeSelectOption>
            <NativeSelectOption value="wins-desc">
              Más victorias
            </NativeSelectOption>
          </NativeSelect>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5 font-medium">
          <Filter className="h-3.5 w-3.5 text-primary" />
          Mostrando{" "}
          <span className="text-foreground font-bold">
            {totalResultados}
          </span>{" "}
          de <span className="text-foreground">{totalOriginal}</span> luchadores
          {isFiltered && " (filtrado)"}
        </span>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-7 px-2.5 text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
}
