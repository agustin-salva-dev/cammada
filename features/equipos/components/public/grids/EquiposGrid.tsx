"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { SearchX, RotateCcw, Shield } from "lucide-react";
import { EquipoCard } from "../cards/EquipoCard";
import { EquiposFilterBar } from "../filters/EquiposFilterBar";
import type { EquipoPublico } from "@/features/equipos/actions/public";
import {
  filterAndSortEquipos,
  isEquiposFiltered,
  EQUIPOS_FILTER_DEFAULTS,
  type EquiposFilterState,
} from "@/features/equipos/utils/equipos-publicos-filters";

interface EquiposGridProps {
  equipos: EquipoPublico[];
}

export function EquiposGrid({ equipos }: EquiposGridProps) {
  const [filters, setFilters] = React.useState<EquiposFilterState>(
    EQUIPOS_FILTER_DEFAULTS,
  );

  const filtered = React.useMemo(
    () => filterAndSortEquipos(equipos, filters),
    [equipos, filters],
  );

  const filtered_active = isEquiposFiltered(filters);

  if (!equipos.length) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border border-dashed border-border bg-card/50 backdrop-blur">
        <Shield className="h-12 w-12 text-primary/40 mb-3" />
        <h3 className="text-xl font-bold text-foreground">
          Próximamente — Equipos Cammada
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mt-1">
          Estamos preparando el directorio de equipos y gimnasios.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8">
      <EquiposFilterBar
        filters={filters}
        onFilterChange={setFilters}
        totalResultados={filtered.length}
        totalOriginal={equipos.length}
        isFiltered={filtered_active}
      />

      {filtered.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-border bg-card/50 backdrop-blur">
          <SearchX className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-bold text-foreground">
            No se encontraron equipos
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mt-1 mb-4">
            Ningún equipo coincide con los criterios de búsqueda aplicados.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters(EQUIPOS_FILTER_DEFAULTS)}
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
          aria-label="Lista de equipos"
        >
          {filtered.map((equipo) => (
            <div key={equipo.id} role="listitem">
              <EquipoCard equipo={equipo} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
