import React from "react";
import { Star, Zap, Trophy, Swords } from "lucide-react";
import type { SearchableSelectOption } from "@/components/ui/searchable-select";
import type { CombatePublicoDetalle } from "@/features/eventos/queries";
import type { CombateDetalleData } from "@/features/combates/components/ModalDetalleCombate";

// ─── Event Mappings ──────────────────────────────────────────────────────────

export const ESTADO_LABEL: Record<string, string> = {
  BORRADOR: "Borrador",
  PROGRAMADO: "Próximo Evento",
  CONFIRMADO: "Confirmado",
  FINALIZADO: "Evento Finalizado",
  CANCELADO: "Cancelado",
};

export const ESTADO_COLOR: Record<string, string> = {
  BORRADOR: "bg-muted/60 text-muted-foreground border-border",
  PROGRAMADO: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  CONFIRMADO: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  FINALIZADO: "bg-primary/10 text-primary border-primary/30",
  CANCELADO: "bg-destructive/10 text-destructive border-destructive/30",
};

export const TIPO_ORDER = [
  "ESTELAR",
  "CO_ESTELAR",
  "CARTELERA_PRINCIPAL",
  "PRELIMINAR",
] as const;
export type TipoKey = (typeof TIPO_ORDER)[number];

export const TIPO_LABEL: Record<TipoKey, string> = {
  ESTELAR: "Pelea Estelar",
  CO_ESTELAR: "Pelea Co-Estelar",
  CARTELERA_PRINCIPAL: "Cartelera Principal",
  PRELIMINAR: "Preliminares",
};

export const TIPO_ICON: Record<TipoKey, React.ReactNode> = {
  ESTELAR: React.createElement(Star, {
    size: 15,
    className: "text-yellow-400",
  }),
  CO_ESTELAR: React.createElement(Zap, {
    size: 15,
    className: "text-orange-400",
  }),
  CARTELERA_PRINCIPAL: React.createElement(Trophy, {
    size: 15,
    className: "text-blue-400",
  }),
  PRELIMINAR: React.createElement(Swords, {
    size: 15,
    className: "text-muted-foreground",
  }),
};

export const COLLAPSIBLE_TYPES: TipoKey[] = [
  "CARTELERA_PRINCIPAL",
  "PRELIMINAR",
];

export const ALL_FILTER_KEY = "__ALL__";

const MESES_CORTOS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

const MESES_LARGOS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const DIAS_SEMANA = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

export function formatFechaCorta(fecha: Date): string {
  const d = new Date(fecha);
  return `${d.getUTCDate()} de ${MESES_CORTOS[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}

export function formatFechaLarga(fecha: Date): string {
  const d = new Date(fecha);
  return `${DIAS_SEMANA[d.getUTCDay()]}, ${d.getUTCDate()} de ${MESES_LARGOS[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}

export function groupByModalidadBase(
  combates: { modalidad: { nombre: string } }[],
): Record<string, number> {
  return combates.reduce(
    (acc, c) => {
      const base = getBaseName(c.modalidad.nombre);
      acc[base] = (acc[base] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

export function getBaseName(rawName: string): string {
  return rawName.replace(/\s*(amateur|pro|semipro)\s*/gi, "").trim() || rawName;
}

export function toOption(value: string, label: string): SearchableSelectOption {
  return { value, label };
}

export function toCombateDetalleData(
  c: CombatePublicoDetalle,
  eventoNumero: number,
): CombateDetalleData {
  const apodoOrEmpty = (a: string | null) => a ?? "";
  return {
    id: c.id,
    peleador1: {
      nombre: c.peleador1.nombre,
      apellido: c.peleador1.apellido,
      apodo: apodoOrEmpty(c.peleador1.apodo),
      equipo: { nombre: c.peleador1.equipo?.nombre ?? "Sin equipo" },
    },
    peleador2: {
      nombre: c.peleador2.nombre,
      apellido: c.peleador2.apellido,
      apodo: apodoOrEmpty(c.peleador2.apodo),
      equipo: { nombre: c.peleador2.equipo?.nombre ?? "Sin equipo" },
    },
    rounds: c.rounds,
    duracionRounds: c.duracionRounds,
    titulo: c.titulo,
    tipo: c.tipo as CombateDetalleData["tipo"],
    estado: c.estado as CombateDetalleData["estado"],
    numeroPelea: c.numeroPelea,
    horarioEstimado: c.horarioEstimado,
    categoriaPeso: {
      nombre: c.categoriaPeso.nombre,
      limiteInferior: c.categoriaPeso.limiteInferior,
      limiteSuperior: c.categoriaPeso.limiteSuperior,
    },
    modalidad: { nombre: c.modalidad.nombre },
    evento: { numero: eventoNumero },
    ganador: c.ganador
      ? {
          nombre: c.ganador.nombre,
          apellido: c.ganador.apellido,
          apodo: apodoOrEmpty(c.ganador.apodo),
        }
      : null,
    viaVictoria: c.viaVictoria,
    roundFin: c.roundFin,
    minutoFin: c.minutoFin,
    segundoFin: c.segundoFin,
  };
}
