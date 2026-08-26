import { Crosshair } from "lucide-react";

export function EmptyStatePredicciones() {
  return (
    <div
      id="predicciones-empty-state"
      className="flex flex-col items-center justify-center text-center py-20 px-6 gap-5"
    >
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Crosshair className="w-9 h-9 text-primary/60" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary/30 animate-pulse" />
      </div>
      <div className="space-y-2 max-w-sm">
        <h2 className="text-xl font-bold">Predicciones no disponibles</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Aún no hay una cartelera confirmada con predicciones habilitadas, y
          tampoco hay historial de predicciones de eventos anteriores
          registradas.
        </p>
        <p className="text-xs text-muted-foreground/60">
          Volvé pronto cuando se confirme la cartelera del próximo evento.
        </p>
      </div>
    </div>
  );
}
