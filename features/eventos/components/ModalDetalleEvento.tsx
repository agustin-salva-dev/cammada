"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  Swords,
  Trophy,
  Star,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ESTADO_LABELS, type EstadoEvento } from "../zod";

import type { TipoCombate } from "@/features/combates/zod";

interface CombateSimplificado {
  id: string;
  tipo: TipoCombate;
  peleador1: {
    id: string;
    nombre: string;
    apellido: string;
    apodo: string | null;
  };
  peleador2: {
    id: string;
    nombre: string;
    apellido: string;
    apodo: string | null;
  };
  modalidad: {
    id: string;
    nombre: string;
  };
}

interface ModalDetalleEventoProps {
  trigger: React.ReactNode;
  evento: {
    numero: number;
    fecha: string;
    horaInicio: string;
    horaFin: string;
    lugarNombre: string;
    calle: string;
    calleNumero: string;
    estado: EstadoEvento;
  };
  combates?: CombateSimplificado[];
}

const ESTADO_BADGE_VARIANT: Record<
  EstadoEvento,
  "default" | "secondary" | "destructive" | "outline" | "green"
> = {
  BORRADOR: "secondary",
  PROGRAMADO: "outline",
  CONFIRMADO: "green",
  FINALIZADO: "default",
  CANCELADO: "destructive",
};

function formatFecha(fechaStr: string): string {
  const date = new Date(fechaStr);
  return date.toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getFightLabel(combate: CombateSimplificado) {
  const p1 = combate.peleador1;
  const p2 = combate.peleador2;
  const p1Name = p1.apodo ? `${p1.nombre} "${p1.apodo}" ${p1.apellido}` : `${p1.nombre} ${p1.apellido}`;
  const p2Name = p2.apodo ? `${p2.nombre} "${p2.apodo}" ${p2.apellido}` : `${p2.nombre} ${p2.apellido}`;
  return `${p1Name} vs ${p2Name}`;
}

export function ModalDetalleEvento({
  trigger,
  evento,
  combates = [],
}: ModalDetalleEventoProps) {
  const peleaEstelar = combates.find((c) => c.tipo === "ESTELAR");
  const peleaCoEstelar = combates.find((c) => c.tipo === "CO_ESTELAR");
  const carteleraPrincipal = combates.filter((c) => c.tipo === "CARTELERA_PRINCIPAL");
  const preliminares = combates.filter((c) => c.tipo === "PRELIMINAR");

  // Calcular estadísticas por modalidad
  const modalidadCounts = combates.reduce((acc, c) => {
    const name = c.modalidad.nombre;
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const hasModalidades = Object.keys(modalidadCounts).length > 0;

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className="sm:max-w-2xl flex flex-col gap-0 p-0"
        showCloseButton
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <DialogTitle className="text-xl">
              Cammada Fight Session #{evento.numero}
            </DialogTitle>
            <Badge variant={ESTADO_BADGE_VARIANT[evento.estado]}>
              {ESTADO_LABELS[evento.estado]}
            </Badge>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 flex flex-col gap-6 max-h-[70vh] overflow-y-auto">
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoItem
              icon={<Calendar className="h-4 w-4" />}
              label="Fecha"
              value={formatFecha(evento.fecha)}
            />
            <InfoItem
              icon={<Clock className="h-4 w-4" />}
              label="Horario"
              value={`${evento.horaInicio} — ${evento.horaFin}`}
            />
            <InfoItem
              icon={<Building2 className="h-4 w-4" />}
              label="Lugar"
              value={evento.lugarNombre}
            />
            <InfoItem
              icon={<MapPin className="h-4 w-4" />}
              label="Dirección"
              value={`${evento.calle} ${evento.calleNumero}`}
            />
          </section>

          <section>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Swords className="h-4 w-4 text-primary" />
              Cartelera ({combates.length} {combates.length === 1 ? "pelea" : "peleas"})
            </h3>
            <div className="grid gap-3">
              <CarteleraSlot
                icon={<Star className="h-4 w-4 text-yellow-500" />}
                label="Pelea Estelar"
                description={
                  peleaEstelar
                    ? getFightLabel(peleaEstelar)
                    : "Aún no asignada"
                }
                subDescription={peleaEstelar ? peleaEstelar.modalidad.nombre : undefined}
                isEmpty={!peleaEstelar}
              />
              <CarteleraSlot
                icon={<Zap className="h-4 w-4 text-orange-500" />}
                label="Pelea Co-Estelar"
                description={
                  peleaCoEstelar
                    ? getFightLabel(peleaCoEstelar)
                    : "Aún no asignada"
                }
                subDescription={peleaCoEstelar ? peleaCoEstelar.modalidad.nombre : undefined}
                isEmpty={!peleaCoEstelar}
              />
              <CarteleraSlot
                icon={<Trophy className="h-4 w-4 text-blue-500" />}
                label="Cartelera Principal"
                description={
                  carteleraPrincipal.length > 0
                    ? `${carteleraPrincipal.length} ${carteleraPrincipal.length === 1 ? "pelea asignada" : "peleas asignadas"}`
                    : "Sin peleas asignadas"
                }
                isEmpty={carteleraPrincipal.length === 0}
                fights={carteleraPrincipal}
              />
              <CarteleraSlot
                icon={<Swords className="h-4 w-4 text-muted-foreground" />}
                label="Peleas Preliminares"
                description={
                  preliminares.length > 0
                    ? `${preliminares.length} ${preliminares.length === 1 ? "pelea asignada" : "peleas asignadas"}`
                    : "Sin peleas asignadas"
                }
                isEmpty={preliminares.length === 0}
                fights={preliminares}
              />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
              Peleas por modalidad
            </h3>
            {hasModalidades ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Object.entries(modalidadCounts).map(([name, count]) => (
                  <div
                    key={name}
                    className="flex flex-col gap-1 rounded-lg border border-border/40 bg-muted/10 p-3 text-center"
                  >
                    <span className="text-xs text-muted-foreground uppercase font-medium tracking-wider">
                      {name}
                    </span>
                    <span className="text-lg font-bold text-foreground">
                      {count} {count === 1 ? "pelea" : "peleas"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                <p className="text-sm text-muted-foreground text-center">
                  Las estadísticas por modalidad estarán disponibles una vez que
                  se registren peleas para este evento.
                </p>
              </div>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/40 bg-muted/10 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate capitalize">
          {value}
        </p>
      </div>
    </div>
  );
}

function CarteleraSlot({
  icon,
  label,
  description,
  subDescription,
  isEmpty,
  fights = [],
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  subDescription?: string;
  isEmpty?: boolean;
  fights?: CombateSimplificado[];
}) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-lg border p-3 transition-colors ${
        isEmpty
          ? "border-dashed border-border/50 bg-muted/5"
          : "border-border/40 bg-card"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted/30">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">
            {description}
            {subDescription && (
              <span className="text-primary font-medium ml-1.5">
                • {subDescription}
              </span>
            )}
          </p>
        </div>
      </div>

      {fights.length > 0 && (
        <div className="pl-11 pr-2 flex flex-col gap-1.5 border-t border-border/30 pt-2 mt-1">
          {fights.map((f) => (
            <div key={f.id} className="flex justify-between items-center text-xs">
              <span className="text-foreground/90 font-medium">
                {getFightLabel(f)}
              </span>
              <span className="text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full text-[10px]">
                {f.modalidad.nombre}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
