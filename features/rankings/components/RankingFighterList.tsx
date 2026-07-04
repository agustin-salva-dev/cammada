"use client";

import { ChevronUp, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RankingItemDraft } from "../types";

interface RankingFighterListProps {
  items: RankingItemDraft[];
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
}

function getApodo(apodo: string): string | null {
  if (!apodo || apodo.trim() === "" || apodo === "Sin apodo") return null;
  return apodo;
}

export function RankingFighterList({
  items,
  onMoveUp,
  onMoveDown,
  onRemove,
  disabled = false,
}: RankingFighterListProps) {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/20 py-8 text-sm text-muted-foreground">
        Aún no hay peleadores en este ranking.
      </div>
    );
  }

  return (
    <ol className="flex flex-col gap-1.5">
      {items.map((item, index) => {
        const apodo = getApodo(item.apodo);
        return (
          <li
            key={item.luchadorId}
            className="flex items-center gap-2 rounded-lg border border-border/50 bg-card px-3 py-2 transition-colors hover:bg-accent/30"
          >
            {/* Posición */}
            <span className="w-7 shrink-0 text-center text-sm font-bold text-primary">
              #{index + 1}
            </span>

            {/* Info peleador */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-tight">
                {item.apellido}, {item.nombre}
              </p>
              {apodo && (
                <p className="truncate text-xs text-muted-foreground">
                  &quot;{apodo}&quot;
                </p>
              )}
              <p className="truncate text-xs text-muted-foreground/60">
                {item.equipo}
              </p>
            </div>

            {/* Controles */}
            <div className="flex shrink-0 items-center gap-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground disabled:opacity-30"
                onClick={() => onMoveUp(index)}
                disabled={disabled || index === 0}
                aria-label={`Subir a ${item.nombre} ${item.apellido}`}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground disabled:opacity-30"
                onClick={() => onMoveDown(index)}
                disabled={disabled || index === items.length - 1}
                aria-label={`Bajar a ${item.nombre} ${item.apellido}`}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onRemove(index)}
                disabled={disabled}
                aria-label={`Quitar a ${item.nombre} ${item.apellido}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
