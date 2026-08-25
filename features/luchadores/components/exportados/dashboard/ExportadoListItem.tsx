"use client";

import * as React from "react";
import {
  GripVertical,
  Trash2,
  ExternalLink,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { LuchadorExportadoDetalle } from "@/features/luchadores/actions/exportados";

interface ExportadoListItemProps {
  luchador: LuchadorExportadoDetalle;
  index: number;
  totalCount: number;
  isSelected: boolean;
  isDragging: boolean;
  canManage: boolean;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onToggleSelect: (id: string) => void;
  onMoveItem: (fromIndex: number, toIndex: number) => void;
  onRemoveSingle: (id: string) => void;
}

export function ExportadoListItem({
  luchador,
  index,
  totalCount,
  isSelected,
  isDragging,
  canManage,
  onDragStart,
  onDragOver,
  onDragEnd,
  onToggleSelect,
  onMoveItem,
  onRemoveSingle,
}: ExportadoListItemProps) {
  const apodoText = luchador.apodo?.trim()
    ? ` "${luchador.apodo.trim()}" `
    : " ";
  const fullName = `${luchador.nombre}${apodoText}${luchador.apellido}`;

  return (
    <div
      draggable={canManage}
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
        isDragging
          ? "opacity-50 border-primary border-dashed bg-primary/5"
          : isSelected
            ? "border-primary bg-primary/5 shadow-xs"
            : "border-border bg-card hover:border-border/80"
      }`}
    >
      <div className="flex items-center gap-3.5">
        {canManage && (
          <div
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1"
            title="Arrastrar para reordenar"
          >
            <GripVertical className="h-5 w-5" />
          </div>
        )}

        {canManage && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(luchador.id)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
          />
        )}

        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
            {index + 1}
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground text-sm sm:text-base">
              {fullName}
            </span>
            {luchador.categoria?.nombre && (
              <Badge variant="secondary" className="text-xs font-normal">
                {luchador.categoria.nombre}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
            <span>Equipo: {luchador.equipo?.nombre || "Sin equipo"}</span>
            {luchador.records && luchador.records.length > 0 && (
              <>
                <span>•</span>
                <span>
                  {luchador.records
                    .map(
                      (r) =>
                        `${r.modalidad?.nombre || "Récord"}: ${r.victorias}W-${r.derrotas}L-${r.empates}D`,
                    )
                    .join(" | ")}
                </span>
              </>
            )}
            {luchador.linkTapology && (
              <>
                <span>•</span>
                <a
                  href={luchador.linkTapology}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  Tapology <ExternalLink className="h-3 w-3" />
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {canManage && (
          <div className="flex items-center gap-1 mr-2 border-r border-border pr-2">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={index === 0}
              onClick={() => onMoveItem(index, index - 1)}
              title="Subir de posición"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={index === totalCount - 1}
              onClick={() => onMoveItem(index, index + 1)}
              title="Bajar de posición"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        )}

        {canManage && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onRemoveSingle(luchador.id)}
            title="Quitar de exportados"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
