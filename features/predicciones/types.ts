import type { Prisma } from "@prisma/client";

export const combatePrediccionInclude = {
  peleador1: {
    select: {
      id: true,
      nombre: true,
      apellido: true,
      apodo: true,
      ciudad: true,
      equipo: { select: { id: true, nombre: true } },
      records: { select: { victorias: true, derrotas: true, empates: true } },
    },
  },
  peleador2: {
    select: {
      id: true,
      nombre: true,
      apellido: true,
      apodo: true,
      ciudad: true,
      equipo: { select: { id: true, nombre: true } },
      records: { select: { victorias: true, derrotas: true, empates: true } },
    },
  },
  categoriaPeso: { select: { id: true, nombre: true } },
  modalidad: { select: { id: true, nombre: true } },
  ganador: { select: { id: true, nombre: true, apellido: true } },
  votosPrediccion: { select: { peleadorId: true } },
} as const;

export type CombatePrediccionRaw = Prisma.CombateGetPayload<{
  include: typeof combatePrediccionInclude;
}>;

export interface PeleadorPrediccion {
  id: string;
  nombre: string;
  apellido: string;
  apodo: string;
  ciudad: string;
  equipo: { id: string; nombre: string };
  victorias: number;
  derrotas: number;
  empates: number;
}

export interface CombatePrediccionPublico {
  id: string;
  tipo: string;
  numeroPelea: number;
  estado: string;
  peleador1: PeleadorPrediccion;
  peleador2: PeleadorPrediccion;
  categoriaPeso: { id: string; nombre: string };
  modalidad: { id: string; nombre: string };
  titulo: boolean;
  totalVotos: number;
  votosPeleador1: number;
  votosPeleador2: number;
  porcentajePeleador1: number;
  porcentajePeleador2: number;
  ganadorId: string | null;
  prediccionHabilitada: boolean;
  miVotoId: string | null;
}

export interface EventoPrediccionPublico {
  id: string;
  numero: number;
  fecha: Date;
  estado: string;
  combates: CombatePrediccionPublico[];
  totalVotosEvento: number;
}

export interface SelectorEventoPrediccion {
  id: string;
  numero: number;
  fecha: Date;
  estado: string;
  tieneCombatesConPredicciones: boolean;
}

export interface CombatePrediccionAdmin {
  id: string;
  tipo: string;
  numeroPelea: number;
  estado: string;
  prediccionHabilitada: boolean;
  titulo: boolean;
  peleador1: Pick<PeleadorPrediccion, "id" | "nombre" | "apellido" | "apodo">;
  peleador2: Pick<PeleadorPrediccion, "id" | "nombre" | "apellido" | "apodo">;
  categoriaPeso: { id: string; nombre: string };
  totalVotos: number;
  votosPeleador1: number;
  votosPeleador2: number;
  porcentajePeleador1: number;
  porcentajePeleador2: number;
}

export interface EventoPrediccionAdmin {
  id: string;
  numero: number;
  fecha: Date;
  estado: string;
  combates: CombatePrediccionAdmin[];
  totalVotosEvento: number;
  combatesConPredicciones: number;
}

export interface EstadisticasPrediccionDashboard {
  totalCombatesActivos: number;
  totalVotos: number;
  combatesPrincipalActivos: number;
}
