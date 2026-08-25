"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin } from "lucide-react";
import type { EquipoPublico } from "@/features/equipos/actions/public";
import { EquipoFichaDialog } from "./EquipoFichaDialog";

interface EquipoCardProps {
  equipo: EquipoPublico;
}

export function EquipoCard({ equipo }: EquipoCardProps) {
  const totalLuchadores = equipo.luchadores.length;

  const totalVictorias = React.useMemo(
    () =>
      equipo.luchadores.reduce(
        (sum, l) => sum + l.records.reduce((s, r) => s + r.victorias, 0),
        0,
      ),
    [equipo.luchadores],
  );

  const totalDerrotas = React.useMemo(
    () =>
      equipo.luchadores.reduce(
        (sum, l) => sum + l.records.reduce((s, r) => s + r.derrotas, 0),
        0,
      ),
    [equipo.luchadores],
  );

  const totalExportados = React.useMemo(
    () => equipo.luchadores.filter((l) => l.esExportado).length,
    [equipo.luchadores],
  );

  const ubicacionLabel =
    [equipo.ciudad, equipo.pais]
      .filter((val) => val && val !== "Desconocida" && val !== "Desconocido")
      .join(", ") || "Ubicación sin registrar";

  return (
    <Card className="flex flex-col justify-between border-border/80 bg-card/60 backdrop-blur-md hover:border-primary/60 hover:scale-[1.01] transition-all duration-300 shadow-md group">
      <CardHeader className="pb-3 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
            {equipo.nombre}
          </h2>
          <Badge
            variant="outline"
            className="shrink-0 border-primary/30 text-primary bg-primary/10 text-[10px] font-medium"
          >
            <Users className="h-3 w-3 mr-1" />
            {totalLuchadores} {totalLuchadores === 1 ? "atleta" : "atletas"}
          </Badge>
        </div>

        {(equipo.ciudad || equipo.pais) && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {ubicacionLabel}
          </span>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3">
        <div className="rounded-xl border border-border/40 bg-muted/40 group-hover:border-border p-3 flex items-center justify-between">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Récord del equipo
          </span>
          <div className="flex items-center gap-1.5 font-mono font-semibold text-sm">
            <span className="text-emerald-500">{totalVictorias}W</span>
            <span className="text-muted-foreground">-</span>
            <span className="text-rose-500">{totalDerrotas}L</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border/40">
        <EquipoFichaDialog
          equipo={equipo}
          totalLuchadores={totalLuchadores}
          totalVictorias={totalVictorias}
          totalDerrotas={totalDerrotas}
          totalExportados={totalExportados}
        />
      </CardFooter>
    </Card>
  );
}
