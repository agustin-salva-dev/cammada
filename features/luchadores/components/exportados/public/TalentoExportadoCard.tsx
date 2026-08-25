"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  StarCheck,
  Shield,
  MapPin,
  Check,
} from "lucide-react";
import type { LuchadorExportadoDetalle } from "@/features/luchadores/actions/exportados";

interface TalentoExportadoCardProps {
  peleador: LuchadorExportadoDetalle;
}

export function TalentoExportadoCard({ peleador }: TalentoExportadoCardProps) {
  const hasApodo = Boolean(peleador.apodo && peleador.apodo.trim().length > 0);
  const apodoFormatted = hasApodo ? `"${peleador.apodo?.trim()}"` : "";

  return (
    <Card className="flex flex-col justify-between overflow-hidden border border-border/80 bg-card/60 backdrop-blur-md hover:border-primary hover:scale-103 transition-all duration-300 shadow-lg hover:shadow-primary/5 group">
      <CardHeader className="py-3 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-xs text-primary font-semibold uppercase tracking-wider flex items-center gap-1">
              <StarCheck size={16} />
              Talento Cammada
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mt-1">
              {peleador.nombre}{" "}
              {hasApodo && (
                <span className="text-primary font-heading">
                  {apodoFormatted}{" "}
                </span>
              )}
              {peleador.apellido}
            </h2>
          </div>

          {peleador.categoria?.nombre && (
            <Badge
              variant="outline"
              className="group-hover:bg-primary group-hover:text-white shrink-0 border-primary/30 text-primary bg-primary/10 font-medium"
            >
              Peso {peleador.categoria.nombre}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-muted-foreground">
          {peleador.equipo?.nombre && (
            <span className="group-hover:text-primary transition-colors flex items-center gap-1 font-medium text-foreground/80">
              <Shield className="h-3.5 w-3.5 text-primary" />
              {peleador.equipo.nombre}
            </span>
          )}
          {(peleador.ciudad || peleador.pais) && (
            <span className="group-hover:text-foreground transition-colors flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
              {[peleador.ciudad, peleador.pais].filter(Boolean).join(", ")}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="rounded-xl border border-border/40 bg-muted/40 group-hover:border-border p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold group-hover:text-foreground transition-colors text-muted-foreground uppercase tracking-wider">
              Récord Oficial Tapology
            </span>
            <Badge
              variant="secondary"
              className="text-[10px] py-0 px-1.5 font-heading text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
            >
              <Check size={16} className="text-emerald-500" />
              Verificado
            </Badge>
          </div>

          {peleador.records && peleador.records.length > 0 ? (
            <div className="flex flex-col gap-1.5 pt-1">
              {peleador.records.map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0"
                >
                  <span className="font-medium text-sm group-hover:text-primary transition-colors text-foreground">
                    {rec.modalidad?.nombre || "Disciplina"}
                  </span>
                  <div className="flex items-center gap-1 font-mono font-semibold">
                    <span className="text-emerald-500">{rec.victorias}W</span>
                    <span className="text-muted-foreground">-</span>
                    <span className="text-rose-500">{rec.derrotas}L</span>
                    <span className="text-muted-foreground">-</span>
                    <span className="text-amber-500">{rec.empates}D</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              Sin récord registrado actualmente.
            </p>
          )}
        </div>
      </CardContent>

      {peleador.linkTapology && peleador.linkTapology.trim().length > 0 && (
        <CardFooter className="border-t border-border/40">
          <Button
            variant="outline"
            size="sm"
            className="w-full hover:text-primary transition-colors"
            asChild
          >
            <a
              href={peleador.linkTapology.trim()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Perfil Oficial en Tapology</span>
              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
