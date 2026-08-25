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
  EquiposFilterState,
  EquiposNameSort,
  EquiposCountSort,
} from "@/features/equipos/utils/equipos-publicos-filters";
import { EQUIPOS_FILTER_DEFAULTS } from "@/features/equipos/utils/equipos-publicos-filters";

interface EquiposFilterBarProps {
  filters: EquiposFilterState;
  onFilterChange: (next: EquiposFilterState) => void;
  totalResultados: number;
  totalOriginal: number;
  isFiltered: boolean;
}

export function EquiposFilterBar({
  filters,
  onFilterChange,
  totalResultados,
  totalOriginal,
  isFiltered,
}: EquiposFilterBarProps) {
  const handleReset = React.useCallback(
    () => onFilterChange(EQUIPOS_FILTER_DEFAULTS),
    [onFilterChange],
  );

  return (
    <div className="w-full flex flex-col gap-4 p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-6 relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="equipos-search"
            type="search"
            placeholder="Buscar por nombre de equipo, ciudad o país…"
            value={filters.searchQuery}
            onChange={(e) =>
              onFilterChange({ ...filters, searchQuery: e.target.value })
            }
            className="pl-10 pr-9 h-10 rounded-xl text-sm"
            aria-label="Buscar equipo"
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

        <div className="md:col-span-3">
          <NativeSelect
            aria-label="Ordenar por cantidad de luchadores"
            value={filters.countSort}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                countSort: e.target.value as EquiposCountSort,
              })
            }
            className="w-full h-10 rounded-xl text-sm"
          >
            <NativeSelectOption value="none">
              Luchadores: Todos
            </NativeSelectOption>
            <NativeSelectOption value="count-desc">
              Más luchadores
            </NativeSelectOption>
            <NativeSelectOption value="count-asc">
              Menos luchadores
            </NativeSelectOption>
          </NativeSelect>
        </div>

        <div className="md:col-span-3">
          <NativeSelect
            aria-label="Ordenar alfabéticamente"
            value={filters.nameSort}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                nameSort: e.target.value as EquiposNameSort,
              })
            }
            className="w-full h-10 rounded-xl text-sm"
          >
            <NativeSelectOption value="name-asc">
              Nombre (A–Z)
            </NativeSelectOption>
            <NativeSelectOption value="name-desc">
              Nombre (Z–A)
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
          de <span className="text-foreground">{totalOriginal}</span> equipos
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
