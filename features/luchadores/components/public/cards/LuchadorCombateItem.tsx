import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Clock } from "lucide-react";
import type { LuchadorCombateRaw } from "@/features/luchadores/utils/luchador-combates";

interface LuchadorCombateItemProps {
  combate: LuchadorCombateRaw;
  luchadorId: string;
}

export function LuchadorCombateItem({
  combate,
  luchadorId,
}: LuchadorCombateItemProps) {
  const esPeleador1 = combate.peleador1Id === luchadorId;
  const rival = esPeleador1 ? combate.peleador2 : combate.peleador1;
  const rivalApodo = rival?.apodo?.trim() ? ` "${rival.apodo.trim()}"` : "";
  const rivalNombre = rival
    ? `${rival.nombre}${rivalApodo} ${rival.apellido}`
    : "Rival por confirmar";

  const gano = combate.ganadorId === luchadorId;
  const perdio = combate.ganadorId && combate.ganadorId !== luchadorId;

  return (
    <div className="p-3 rounded-xl border border-border/50 bg-card/80 space-y-2 text-xs">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <span className="font-semibold text-foreground text-sm flex items-center gap-1">
            vs {rivalNombre}
          </span>
          <span className="text-muted-foreground text-[11px] flex items-center gap-1 mt-0.5">
            <Calendar className="h-3 w-3" />
            Cammada #{combate.evento.numero}
            {combate.evento.lugarNombre && ` · ${combate.evento.lugarNombre}`}
          </span>
        </div>

        {combate.estado === "FINALIZADO" ? (
          gano ? (
            <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-500 font-bold text-[10px]">
              Victoria
            </Badge>
          ) : perdio ? (
            <Badge className="bg-rose-500/10 border-rose-500/30 text-rose-500 font-bold text-[10px]">
              Derrota
            </Badge>
          ) : (
            <Badge className="bg-amber-500/10 border-amber-500/30 text-amber-500 font-bold text-[10px]">
              Empate
            </Badge>
          )
        ) : combate.estado === "PROGRAMADO" ||
          combate.estado === "CONFIRMADO" ? (
          <Badge className="bg-sky-500/10 border-sky-500/30 text-sky-500 text-[10px]">
            Programada
          </Badge>
        ) : (
          <Badge variant="outline" className="text-[10px]">
            {combate.estado}
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground pt-1 border-t border-border/30">
        {combate.modalidad?.nombre && <span>{combate.modalidad.nombre}</span>}
        {combate.categoriaPeso?.nombre && (
          <span>Peso {combate.categoriaPeso.nombre}</span>
        )}
        {combate.titulo && (
          <span className="text-amber-400 font-semibold flex items-center gap-1">
            <Trophy size={11} /> Pelea por Título
          </span>
        )}
        {combate.viaVictoria && (
          <span className="text-foreground/90 font-medium">
            Vía: {combate.viaVictoria}
          </span>
        )}
        {combate.roundFin && (
          <span className="flex items-center gap-0.5">
            <Clock size={10} /> R{combate.roundFin}
            {combate.minutoFin !== null &&
              ` (${combate.minutoFin}:${String(
                combate.segundoFin ?? 0,
              ).padStart(2, "0")})`}
          </span>
        )}
      </div>
    </div>
  );
}
