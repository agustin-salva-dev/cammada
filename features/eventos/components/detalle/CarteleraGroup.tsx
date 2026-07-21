import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { CombatePublicoDetalle } from "@/features/eventos/queries";
import {
  COLLAPSIBLE_TYPES,
  TIPO_ICON,
  TIPO_LABEL,
  type TipoKey,
} from "../../utils/eventHelpers";
import { CombateRow } from "./CombateRow";

interface CarteleraGroupProps {
  tipo: TipoKey;
  combates: CombatePublicoDetalle[];
  eventoNumero: number;
}

export function CarteleraGroup({
  tipo,
  combates,
  eventoNumero,
}: CarteleraGroupProps) {
  const isCollapsible = COLLAPSIBLE_TYPES.includes(tipo);
  const [isExpanded, setIsExpanded] = React.useState(true);

  if (combates.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5 mb-1 flex-wrap">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 border border-white/10 shrink-0">
          {TIPO_ICON[tipo]}
        </div>
        <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-foreground/80">
          {TIPO_LABEL[tipo]}
        </h3>
        <span className="text-xs text-muted-foreground">
          ({combates.length} {combates.length === 1 ? "pelea" : "peleas"})
        </span>

        {isCollapsible && (
          <button
            type="button"
            onClick={() => setIsExpanded((p) => !p)}
            className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-white/5 cursor-pointer"
            aria-label={isExpanded ? "Ocultar peleas" : "Mostrar peleas"}
          >
            {isExpanded ? (
              <>
                <ChevronUp size={13} />
                <span className="hidden sm:inline">Ocultar</span>
              </>
            ) : (
              <>
                <ChevronDown size={13} />
                <span className="hidden sm:inline">Mostrar</span>
              </>
            )}
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="flex flex-col gap-2">
          {[...combates].reverse().map((c) => (
            <CombateRow key={c.id} combate={c} eventoNumero={eventoNumero} />
          ))}
        </div>
      )}
    </div>
  );
}
