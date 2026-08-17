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
  ExportadosFilterState,
  ExportadosSortOption,
} from "@/features/luchadores/utils/exportados-filters";

interface TalentoExportadoFiltersProps {
  filters: ExportadosFilterState;
  onFilterChange: (filters: ExportadosFilterState) => void;
  ciudades: string[];
  equipos: string[];
  totalResultados: number;
  totalOriginal: number;
}

export function TalentoExportadoFilters({
  filters,
  onFilterChange,
  ciudades,
  equipos,
  totalResultados,
  totalOriginal,
}: TalentoExportadoFiltersProps) {
  const isFiltered =
    Boolean(filters.searchQuery.trim()) ||
    filters.selectedCiudad !== "all" ||
    filters.selectedEquipo !== "all" ||
    filters.sortOption !== "default";

  const handleReset = React.useCallback(() => {
    onFilterChange({
      searchQuery: "",
      selectedCiudad: "all",
      selectedEquipo: "all",
      sortOption: "default",
    });
  }, [onFilterChange]);

  return (
    <div className="w-full flex flex-col gap-4 p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-lg transition-all">
      {/* Fila principal: Búsqueda + Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Input de Búsqueda (5 cols en md) */}
        <div className="md:col-span-5 relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Buscar por nombre, apodo..."
            value={filters.searchQuery}
            onChange={(e) =>
              onFilterChange({ ...filters, searchQuery: e.target.value })
            }
            className="pl-10 pr-9 bg-background/50 border-border/60 focus-visible:ring-primary/40 h-10 text-sm rounded-xl"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, searchQuery: "" })}
              className="absolute right-3 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              title="Limpiar búsqueda"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Desplegable de Ciudad (2 cols en md) */}
        <div className="md:col-span-2 relative">
          <NativeSelect
            value={filters.selectedCiudad}
            onChange={(e) =>
              onFilterChange({ ...filters, selectedCiudad: e.target.value })
            }
            className="h-10 bg-background/50 border-border/60 text-xs sm:text-sm rounded-xl"
          >
            <NativeSelectOption value="all">
              Todas las ciudades
            </NativeSelectOption>
            {ciudades.map((ciudad) => (
              <NativeSelectOption key={ciudad} value={ciudad}>
                {ciudad}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        {/* Desplegable de Equipo (2 cols en md) */}
        <div className="md:col-span-2 relative">
          <NativeSelect
            value={filters.selectedEquipo}
            onChange={(e) =>
              onFilterChange({ ...filters, selectedEquipo: e.target.value })
            }
            className="h-10 bg-background/50 border-border/60 text-xs sm:text-sm rounded-xl"
          >
            <NativeSelectOption value="all">
              Todos los equipos
            </NativeSelectOption>
            {equipos.map((equipo) => (
              <NativeSelectOption key={equipo} value={equipo}>
                {equipo}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        {/* Desplegable de Ordenamiento (3 cols en md) */}
        <div className="md:col-span-3 relative">
          <NativeSelect
            value={filters.sortOption}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                sortOption: e.target.value as ExportadosSortOption,
              })
            }
            className="h-10 bg-background/50 border-border/60 text-xs sm:text-sm rounded-xl"
          >
            <NativeSelectOption value="default">
              Orden: Destacados
            </NativeSelectOption>
            <NativeSelectOption value="name-asc">
              Nombre (A - Z)
            </NativeSelectOption>
            <NativeSelectOption value="name-desc">
              Nombre (Z - A)
            </NativeSelectOption>
          </NativeSelect>
        </div>
      </div>

      {/* Fila inferior: Estado del filtro + Limpiar */}
      <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5 font-medium">
          <Filter className="h-3.5 w-3.5 text-primary" />
          Mostrando{" "}
          <span className="text-foreground font-bold">
            {totalResultados}
          </span>{" "}
          de <span className="text-foreground">{totalOriginal}</span> peleadores
          {isFiltered && " (filtrado)"}
        </span>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-7 px-2.5 text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
}
