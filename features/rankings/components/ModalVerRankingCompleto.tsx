"use client";

import * as React from "react";
import { Medal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface RankingItemView {
  id: string;
  posicion: number;
  luchador: {
    id: string;
    nombre: string;
    apellido: string;
    apodo: string;
    pais: string;
  };
}

interface ModalVerRankingCompletoProps {
  trigger: React.ReactNode;
  titulo: string;
  items: RankingItemView[];
  totalItems: number;
}

function getMedalColor(posicion: number) {
  if (posicion === 1) return "text-yellow-400";
  if (posicion === 2) return "text-slate-400";
  if (posicion === 3) return "text-amber-600";
  return "text-muted-foreground";
}

export function ModalVerRankingCompleto({
  trigger,
  titulo,
  items,
  totalItems,
}: ModalVerRankingCompletoProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="flex max-h-[85vh] w-full max-w-lg flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-border px-6 pt-6 pb-4">
          <DialogTitle className="text-lg">{titulo}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {totalItems} peleador{totalItems !== 1 ? "es" : ""} en este ranking
          </p>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Este ranking no tiene peleadores aún.
            </p>
          ) : (
            <ol className="flex flex-col gap-2">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg border border-border/50 bg-card px-4 py-3 transition-colors hover:bg-accent/20"
                >
                  <div className="flex w-8 shrink-0 items-center justify-center">
                    {item.posicion <= 3 ? (
                      <Medal
                        className={`h-5 w-5 ${getMedalColor(item.posicion)}`}
                      />
                    ) : (
                      <span className="text-sm font-bold text-muted-foreground">
                        #{item.posicion}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold leading-tight">
                      {item.luchador.apellido}, {item.luchador.nombre}
                    </p>
                    {item.luchador.apodo && (
                      <p className="truncate text-xs text-muted-foreground">
                        &quot;{item.luchador.apodo}&quot;
                      </p>
                    )}
                  </div>

                  <Badge variant="outline" className="shrink-0 text-xs">
                    {item.luchador.pais}
                  </Badge>
                </li>
              ))}
            </ol>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
