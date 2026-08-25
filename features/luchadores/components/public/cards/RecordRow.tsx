import * as React from "react";

interface RecordRowProps {
  modalidad: string;
  victorias: number;
  derrotas: number;
  empates: number;
}

export function RecordRow({
  modalidad,
  victorias,
  derrotas,
  empates,
}: RecordRowProps) {
  return (
    <div className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0">
      <span className="font-medium text-sm text-foreground">{modalidad}</span>
      <div className="flex items-center gap-1 font-mono font-semibold">
        <span className="text-emerald-500">{victorias}W</span>
        <span className="text-muted-foreground">-</span>
        <span className="text-rose-500">{derrotas}L</span>
        <span className="text-muted-foreground">-</span>
        <span className="text-amber-500">{empates}D</span>
      </div>
    </div>
  );
}
