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

export function ModalDetalleEvento({
  trigger,
  evento,
}: ModalDetalleEventoProps) {
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
              Cartelera
            </h3>
            <div className="grid gap-3">
              <CarteleraSlot
                icon={<Star className="h-4 w-4 text-yellow-500" />}
                label="Pelea Estelar"
                description="Aún no asignada"
                isEmpty
              />
              <CarteleraSlot
                icon={<Zap className="h-4 w-4 text-orange-500" />}
                label="Pelea Co-Estelar"
                description="Aún no asignada"
                isEmpty
              />
              <CarteleraSlot
                icon={<Trophy className="h-4 w-4 text-blue-500" />}
                label="Cartelera Principal"
                description="Sin peleas asignadas"
                isEmpty
              />
              <CarteleraSlot
                icon={<Swords className="h-4 w-4 text-muted-foreground" />}
                label="Peleas Preliminares"
                description="Sin peleas asignadas"
                isEmpty
              />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
              Peleas por modalidad
            </h3>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground text-center">
                Las estadísticas por modalidad estarán disponibles una vez que
                se registren peleas para este evento.
              </p>
            </div>
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
  isEmpty,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  isEmpty?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
        isEmpty
          ? "border-dashed border-border/50 bg-muted/5"
          : "border-border/40 bg-card"
      }`}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted/30">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
