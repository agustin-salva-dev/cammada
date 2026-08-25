"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Users, MapPin, Shield, Globe, User } from "lucide-react";
import type { EquipoPublico } from "@/features/equipos/actions/public";
import { EquipoLuchadorItem } from "./EquipoLuchadorItem";

interface EquipoFichaDialogProps {
  equipo: EquipoPublico;
  totalLuchadores: number;
  totalVictorias: number;
  totalDerrotas: number;
  totalExportados: number;
  trigger?: React.ReactNode;
}

export function EquipoFichaDialog({
  equipo,
  totalLuchadores,
  totalVictorias,
  totalDerrotas,
  totalExportados,
  trigger,
}: EquipoFichaDialogProps) {
  const ubicacion =
    [equipo.ciudad, equipo.pais]
      .filter((val) => val && val !== "Desconocida" && val !== "Desconocido")
      .join(", ") || "No especificada";

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="w-full hover:text-primary transition-colors"
            disabled={totalLuchadores === 0}
          >
            <Users className="h-3.5 w-3.5 mr-1.5" />
            Ver plantel completo ({totalLuchadores})
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="max-h-[85vh] overflow-y-auto max-w-2xl"
      >
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-primary font-semibold uppercase tracking-wider flex items-center gap-1">
                <Shield size={13} />
                Ficha de Gimnasio / Equipo
              </span>
              <DialogTitle className="text-2xl font-bold font-heading text-foreground mt-1">
                {equipo.nombre}
              </DialogTitle>
            </div>
            <Badge className="text-xs font-semibold bg-primary text-primary-foreground">
              {totalLuchadores}{" "}
              {totalLuchadores === 1 ? "Peleador" : "Peleadores"}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs">
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                Ubicación
              </span>
              <span className="font-medium text-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                {ubicacion}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                Récord Acumulado
              </span>
              <span className="font-mono font-bold mt-0.5 block text-foreground">
                <span className="text-emerald-500">
                  {totalVictorias} Victorias
                </span>{" "}
                -{" "}
                <span className="text-rose-500">
                  {totalDerrotas} Derrotas
                </span>
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                Talento Exportado
              </span>
              <span className="font-semibold text-foreground mt-0.5 flex items-center gap-1">
                <Globe size={12} className="text-sky-500" />
                {totalExportados}{" "}
                {totalExportados === 1 ? "atleta" : "atletas"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
              <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                <User className="h-4 w-4 text-primary" />
                Plantel de Peleadores Registrados:
              </h3>
              <span className="text-xs text-muted-foreground">
                {totalLuchadores} atletas
              </span>
            </div>

            {totalLuchadores === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No hay luchadores registrados en este equipo.
              </p>
            ) : (
              <div
                className="space-y-2.5 max-h-80 overflow-y-auto pr-1"
                role="list"
                aria-label={`Peleadores de ${equipo.nombre}`}
              >
                {equipo.luchadores.map((l) => (
                  <EquipoLuchadorItem key={l.id} luchador={l} />
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
