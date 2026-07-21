"use client";

import { Filter } from "lucide-react";
import type { EventoPublicoDetalle } from "@/features/eventos/queries";
import { useCarteleraFiltros } from "../hooks/useCarteleraFiltros";
import { CarteleraFilterBar } from "./detalle/CarteleraFilterBar";
import { CarteleraGroup } from "./detalle/CarteleraGroup";
import { TIPO_ORDER } from "../utils/eventHelpers";

interface EventoDetalleClientProps {
  evento: EventoPublicoDetalle;
}

export function EventoDetalleClient({ evento }: EventoDetalleClientProps) {
  const { numero, combates } = evento;
  const filterState = useCarteleraFiltros(combates);

  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      <CarteleraFilterBar
        totalCombates={combates.length}
        filteredCombatesCount={filterState.filtered.length}
        {...filterState}
      />

      {filterState.filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 sm:py-20 rounded-2xl border border-dashed border-white/10 text-center px-4">
          <Filter size={36} className="text-primary/20" />
          <p className="text-muted-foreground text-xs sm:text-sm">
            Ningún combate coincide con los filtros aplicados.
          </p>
          <button
            type="button"
            onClick={filterState.clearAll}
            className="text-xs text-primary hover:underline mt-1 cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-8 sm:gap-10">
          {TIPO_ORDER.map((tipo) => (
            <CarteleraGroup
              key={tipo}
              tipo={tipo}
              combates={filterState.combatesPorTipo[tipo]}
              eventoNumero={numero}
            />
          ))}
        </div>
      )}
    </div>
  );
}
