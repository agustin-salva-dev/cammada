"use client";

import * as React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Shield, ExternalLink, Globe, Scale } from "lucide-react";
import type { LuchadorPublico } from "@/features/luchadores/actions/public";
import { RecordRow } from "./RecordRow";
import { LuchadorFichaDialog } from "./LuchadorFichaDialog";

interface LuchadorCardProps {
  luchador: LuchadorPublico;
}

export function LuchadorCard({ luchador }: LuchadorCardProps) {
  const apodoLabel = luchador.apodo?.trim()
    ? `"${luchador.apodo.trim()}"`
    : null;

  return (
    <Card className="flex flex-col justify-between border-border/80 bg-card/60 backdrop-blur-md hover:border-primary/60 hover:scale-[1.01] transition-all duration-300 shadow-md group">
      <CardHeader className="pb-3 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <h2 className="text-lg font-bold leading-tight text-foreground">
              {luchador.nombre}{" "}
              {apodoLabel && (
                <span className="text-primary font-heading">{apodoLabel} </span>
              )}
              {luchador.apellido}
            </h2>
          </div>
          {luchador.categoria && (
            <Badge
              variant="outline"
              className="shrink-0 border-primary/30 text-primary bg-primary/10 text-[10px] font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            >
              Peso {luchador.categoria.nombre}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {luchador.equipo?.nombre && (
            <span className="flex items-center gap-1 text-foreground/80 font-medium group-hover:text-primary transition-colors">
              <Shield className="h-3.5 w-3.5 text-primary shrink-0" />
              {luchador.equipo.nombre}
            </span>
          )}
          {(luchador.ciudad || luchador.pais) && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {[luchador.ciudad, luchador.pais].filter(Boolean).join(", ")}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
          {luchador.edad && (
            <span className="flex items-center gap-1">
              <span className="text-foreground font-semibold">
                {luchador.edad}
              </span>{" "}
              años
            </span>
          )}
          {luchador.altura && (
            <span className="flex items-center gap-1">
              <Scale className="h-3 w-3 shrink-0" />
              <span className="text-foreground font-semibold">
                {luchador.altura}
              </span>{" "}
              cm
            </span>
          )}
          {luchador.ultimoPeso && (
            <span className="flex items-center gap-1">
              <span className="text-foreground font-semibold">
                {luchador.ultimoPeso}
              </span>{" "}
              kg
            </span>
          )}
          {luchador.esExportado && (
            <Badge
              variant="secondary"
              className="text-[10px] py-0 px-1.5 text-sky-500 bg-sky-500/10 border-sky-500/20"
            >
              <Globe className="h-3 w-3 mr-1" />
              Exportado
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        {luchador.records.length > 0 ? (
          <div className="rounded-xl border border-border/40 bg-muted/40 group-hover:border-border p-3 flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Récord Oficial
            </span>
            {luchador.records.map((rec) => (
              <RecordRow
                key={rec.id}
                modalidad={rec.modalidad?.nombre ?? "Disciplina"}
                victorias={rec.victorias}
                derrotas={rec.derrotas}
                empates={rec.empates}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            Sin récord registrado.
          </p>
        )}
      </CardContent>

      <CardFooter className="border-t border-border/40 gap-2 flex-wrap">
        <LuchadorFichaDialog luchador={luchador} apodoLabel={apodoLabel} />

        {luchador.linkTapology?.trim() && (
          <Button variant="ghost" size="sm" className="flex-1" asChild>
            <Link
              href={luchador.linkTapology.trim()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ver perfil de ${luchador.nombre} ${luchador.apellido} en Tapology`}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              Tapology
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
