"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MapPin,
  Shield,
  ExternalLink,
  Swords,
  Calendar,
  User,
} from "lucide-react";
import type { LuchadorPublico } from "@/features/luchadores/actions/public";
import { RecordRow } from "./RecordRow";
import { LuchadorCombateItem } from "./LuchadorCombateItem";
import {
  getLuchadorTotales,
  getCombatesOrdenados,
} from "@/features/luchadores/utils/luchador-combates";

interface LuchadorFichaDialogProps {
  luchador: LuchadorPublico;
  apodoLabel: string | null;
  trigger?: React.ReactNode;
}

export function LuchadorFichaDialog({
  luchador,
  apodoLabel,
  trigger,
}: LuchadorFichaDialogProps) {
  const { victorias, derrotas, empates } = React.useMemo(
    () => getLuchadorTotales(luchador.records),
    [luchador.records],
  );

  const todosLosCombates = React.useMemo(
    () =>
      getCombatesOrdenados(
        luchador.combatesComoPel1,
        luchador.combatesComoPel2,
      ),
    [luchador.combatesComoPel1, luchador.combatesComoPel2],
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 hover:text-primary transition-colors"
          >
            <Swords className="h-3.5 w-3.5 mr-1.5" />
            Ver ficha completa
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="max-h-[85vh] overflow-y-auto max-w-xl"
      >
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-primary font-semibold uppercase tracking-wider flex items-center gap-1">
                <User size={13} />
                Ficha Técnica del Peleador
              </span>
              <DialogTitle className="text-2xl font-bold font-heading text-foreground mt-1">
                {luchador.nombre}{" "}
                {apodoLabel && (
                  <span className="text-primary">{apodoLabel} </span>
                )}
                {luchador.apellido}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Ficha técnica y estadísticas de {luchador.nombre} {luchador.apellido}
              </DialogDescription>
            </div>
            {luchador.categoria && (
              <Badge className="text-xs font-semibold bg-primary text-primary-foreground">
                Peso {luchador.categoria.nombre}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs">
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                Equipo / Gimnasio
              </span>
              <span className="font-medium text-foreground flex items-center gap-1 mt-0.5">
                <Shield className="h-3 w-3 text-primary shrink-0" />
                {luchador.equipo?.nombre || "Sin equipo"}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                Ubicación
              </span>
              <span className="font-medium text-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                {[luchador.ciudad, luchador.pais].filter(Boolean).join(", ") ||
                  "Desconocido"}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                Edad
              </span>
              <span className="font-semibold text-foreground mt-0.5 block">
                {luchador.edad ? `${luchador.edad} años` : "—"}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                Altura
              </span>
              <span className="font-semibold text-foreground mt-0.5 block">
                {luchador.altura ? `${luchador.altura} cm` : "—"}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                Último Peso
              </span>
              <span className="font-semibold text-foreground mt-0.5 block">
                {luchador.ultimoPeso ? `${luchador.ultimoPeso} kg` : "—"}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                Récord Total
              </span>
              <span className="font-mono font-bold mt-0.5 block text-foreground">
                <span className="text-emerald-500">{victorias}W</span> -{" "}
                <span className="text-rose-500">{derrotas}L</span> -{" "}
                <span className="text-amber-500">{empates}D</span>
              </span>
            </div>
          </div>

          {luchador.records.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Récord por Modalidad
              </h3>
              <div className="rounded-xl border border-border/60 bg-muted/30 p-3 space-y-1">
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
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
              <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                <Swords className="h-4 w-4 text-primary" />
                Sus peleas registradas en Cammada:
              </h3>
              <span className="text-xs font-semibold text-muted-foreground">
                {todosLosCombates.length}{" "}
                {todosLosCombates.length === 1 ? "pelea" : "peleas"}
              </span>
            </div>

            {todosLosCombates.length === 0 ? (
              <div className="p-5 text-center rounded-xl border border-dashed border-border/80 bg-muted/10 text-muted-foreground text-xs">
                <Calendar className="h-6 w-6 mx-auto mb-1.5 text-muted-foreground/40" />
                Aún no registra combates finalizados en Cammada.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {todosLosCombates.map((combate) => (
                  <LuchadorCombateItem
                    key={combate.id}
                    combate={combate}
                    luchadorId={luchador.id}
                  />
                ))}
              </div>
            )}
          </div>

          {luchador.linkTapology?.trim() && (
            <div className="pt-2 border-t border-border/40">
              <Button
                variant="outline"
                size="sm"
                className="w-full hover:text-primary transition-colors"
                asChild
              >
                <Link
                  href={luchador.linkTapology.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver perfil de ${luchador.nombre} en Tapology`}
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Ver Perfil Oficial en Tapology
                </Link>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
