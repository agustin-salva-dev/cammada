import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { EquipoPublico } from "@/features/equipos/actions/public";

type EquipoLuchador = EquipoPublico["luchadores"][number];

interface EquipoLuchadorItemProps {
  luchador: EquipoLuchador;
}

export function EquipoLuchadorItem({ luchador }: EquipoLuchadorItemProps) {
  const apodo = luchador.apodo?.trim() ? ` "${luchador.apodo.trim()}"` : "";
  const w = luchador.records.reduce((s, r) => s + r.victorias, 0);
  const d = luchador.records.reduce((s, r) => s + r.derrotas, 0);
  const e = luchador.records.reduce((s, r) => s + r.empates, 0);

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border border-border/50 bg-card/80 text-xs"
      role="listitem"
    >
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-foreground truncate">
            {luchador.nombre}
            {apodo} {luchador.apellido}
          </span>
          {luchador.esExportado && (
            <Badge
              variant="secondary"
              className="text-[9px] py-0 px-1 text-sky-500 bg-sky-500/10 border-sky-500/20"
            >
              Exportado
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground mt-0.5">
          {luchador.categoria && (
            <span className="text-primary font-medium">
              Peso {luchador.categoria.nombre}
            </span>
          )}
          {luchador.edad && <span>· {luchador.edad} años</span>}
          {luchador.ultimoPeso && <span>· {luchador.ultimoPeso} kg</span>}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
        <div className="flex items-center gap-1 font-mono text-xs font-semibold">
          <span className="text-emerald-500">{w}W</span>
          <span className="text-muted-foreground">-</span>
          <span className="text-rose-500">{d}L</span>
          <span className="text-muted-foreground">-</span>
          <span className="text-amber-500">{e}D</span>
        </div>

        {luchador.linkTapology?.trim() && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            asChild
            title="Ver Tapology"
          >
            <Link
              href={luchador.linkTapology.trim()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ver perfil de ${luchador.nombre} en Tapology`}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
