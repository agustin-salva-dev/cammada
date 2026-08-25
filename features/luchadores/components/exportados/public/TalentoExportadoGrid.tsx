"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Globe, SearchX, RotateCcw } from "lucide-react";
import type { LuchadorExportadoDetalle } from "@/features/luchadores/actions/exportados";
import { TalentoExportadoFilters } from "./TalentoExportadoFilters";
import { TalentoExportadoCard } from "./TalentoExportadoCard";
import {
  extractUniqueCiudades,
  extractUniqueEquipos,
  filterAndSortExportados,
  type ExportadosFilterState,
} from "@/features/luchadores/utils/exportados-filters";

interface TalentoExportadoGridProps {
  exportados: LuchadorExportadoDetalle[];
}

export function TalentoExportadoGrid({
  exportados,
}: TalentoExportadoGridProps) {
  const [filters, setFilters] = React.useState<ExportadosFilterState>({
    searchQuery: "",
    selectedCiudad: "all",
    selectedEquipo: "all",
    sortOption: "default",
  });

  const ciudades = React.useMemo(
    () => extractUniqueCiudades(exportados),
    [exportados],
  );

  const equipos = React.useMemo(
    () => extractUniqueEquipos(exportados),
    [exportados],
  );

  const filteredExportados = React.useMemo(
    () => filterAndSortExportados(exportados, filters),
    [exportados, filters],
  );

  if (!exportados || exportados.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border border-dashed border-border bg-card/50 backdrop-blur">
        <Globe className="h-12 w-12 text-primary/40 mb-3" />
        <h3 className="text-xl font-bold text-foreground">
          Próximamente Talento Exportado
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mt-1">
          Estamos preparando la nómina oficial de atletas impulsados desde
          Cammada a las ligas más importantes a nivel nacional e internacional.
        </p>
      </div>
    );
  }

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      selectedCiudad: "all",
      selectedEquipo: "all",
      sortOption: "default",
    });
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <TalentoExportadoFilters
        filters={filters}
        onFilterChange={setFilters}
        ciudades={ciudades}
        equipos={equipos}
        totalResultados={filteredExportados.length}
        totalOriginal={exportados.length}
      />

      {filteredExportados.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-border bg-card/50 backdrop-blur animate-fade-in">
          <SearchX className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-bold text-foreground">
            No se encontraron peleadores
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mt-1 mb-4">
            No hay ningún peleador exportado que coincida con los criterios de
            búsqueda o filtros aplicados.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restablecer filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredExportados.map((peleador) => (
            <TalentoExportadoCard key={peleador.id} peleador={peleador} />
          ))}
        </div>
      )}
    </div>
  );
}
