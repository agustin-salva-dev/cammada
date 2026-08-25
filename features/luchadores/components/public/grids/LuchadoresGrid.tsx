"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { SearchX, RotateCcw, Users } from "lucide-react";
import { LuchadorCard } from "../cards/LuchadorCard";
import { LuchadoresFilterBar } from "../filters/LuchadoresFilterBar";
import type { LuchadorPublico } from "@/features/luchadores/actions/public";
import {
  filterAndSortLuchadores,
  extractUniqueCategorias,
  extractUniqueEquiposFromLuchadores,
  extractUniqueCiudadesFromLuchadores,
  isLuchadoresFiltered,
  LUCHADORES_FILTER_DEFAULTS,
  type LuchadoresFilterState,
} from "@/features/luchadores/utils/luchadores-publicos-filters";

interface LuchadoresGridProps {
  luchadores: LuchadorPublico[];
}

export function LuchadoresGrid({ luchadores }: LuchadoresGridProps) {
  const [filters, setFilters] = React.useState<LuchadoresFilterState>(
    LUCHADORES_FILTER_DEFAULTS,
  );

  const categorias = React.useMemo(
    () => extractUniqueCategorias(luchadores),
    [luchadores],
  );
  const equipos = React.useMemo(
    () => extractUniqueEquiposFromLuchadores(luchadores),
    [luchadores],
  );
  const ciudades = React.useMemo(
    () => extractUniqueCiudadesFromLuchadores(luchadores),
    [luchadores],
  );

  const filtered = React.useMemo(
    () => filterAndSortLuchadores(luchadores, filters),
    [luchadores, filters],
  );

  const filtered_active = isLuchadoresFiltered(filters);

  if (!luchadores.length) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border border-dashed border-border bg-card/50 backdrop-blur">
        <Users className="h-12 w-12 text-primary/40 mb-3" />
        <h3 className="text-xl font-bold text-foreground">
          Próximamente — Roster Cammada
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mt-1">
          Estamos cargando los perfiles de los atletas de Cammada.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8">
      <LuchadoresFilterBar
        filters={filters}
        onFilterChange={setFilters}
        categorias={categorias}
        equipos={equipos}
        ciudades={ciudades}
        totalResultados={filtered.length}
        totalOriginal={luchadores.length}
        isFiltered={filtered_active}
      />

      {filtered.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-border bg-card/50 backdrop-blur">
          <SearchX className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-bold text-foreground">
            No se encontraron luchadores
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mt-1 mb-4">
            Ningún luchador coincide con los filtros aplicados.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters(LUCHADORES_FILTER_DEFAULTS)}
            className="flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restablecer filtros
          </Button>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
          role="list"
          aria-label="Lista de luchadores"
        >
          {filtered.map((luchador) => (
            <div key={luchador.id} role="listitem">
              <LuchadorCard luchador={luchador} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
