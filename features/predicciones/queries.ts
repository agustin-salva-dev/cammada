import { db } from "@/lib/db";
import { getHashedIp } from "@/lib/ip-hash";
import { unstable_cache } from "next/cache";
import {
  CACHE_TAG_PREDICCIONES,
  TIPOS_COMBATE_CON_PREDICCION,
} from "./constants";
import { ESTADOS_EVENTO_PUBLICOS } from "@/features/eventos/zod";
import type {
  CombatePrediccionPublico,
  CombatePrediccionAdmin,
  EventoPrediccionPublico,
  EventoPrediccionAdmin,
  EstadisticasPrediccionDashboard,
  PeleadorPrediccion,
  SelectorEventoPrediccion,
} from "./types";

function calcularPorcentajes(total: number, votos: number) {
  if (total === 0) return 0;
  return Math.round((votos / total) * 100);
}

function mapPeleadorRecord(luchador: {
  id: string;
  nombre: string;
  apellido: string;
  apodo: string;
  ciudad: string;
  equipo: { id: string; nombre: string };
  records: { victorias: number; derrotas: number; empates: number }[];
}): PeleadorPrediccion {
  const totales = luchador.records.reduce(
    (acc, r) => ({
      victorias: acc.victorias + r.victorias,
      derrotas: acc.derrotas + r.derrotas,
      empates: acc.empates + r.empates,
    }),
    { victorias: 0, derrotas: 0, empates: 0 },
  );
  return {
    id: luchador.id,
    nombre: luchador.nombre,
    apellido: luchador.apellido,
    apodo: luchador.apodo,
    ciudad: luchador.ciudad,
    equipo: luchador.equipo,
    ...totales,
  };
}

async function fetchEventosConPredicciones(): Promise<
  SelectorEventoPrediccion[]
> {
  const eventos = await db.evento.findMany({
    where: {
      estado: { in: ESTADOS_EVENTO_PUBLICOS },
      combates: {
        some: { prediccionHabilitada: true },
      },
    },
    orderBy: { numero: "desc" },
    select: {
      id: true,
      numero: true,
      fecha: true,
      estado: true,
      _count: {
        select: { combates: { where: { prediccionHabilitada: true } } },
      },
    },
  });

  return eventos.map((e) => ({
    id: e.id,
    numero: e.numero,
    fecha: e.fecha,
    estado: e.estado,
    tieneCombatesConPredicciones: e._count.combates > 0,
  }));
}

export const getEventosConPredicciones = unstable_cache(
  fetchEventosConPredicciones,
  ["public-predicciones-eventos"],
  { revalidate: 60, tags: [CACHE_TAG_PREDICCIONES] },
);

async function fetchPrediccionesEvento(
  eventoId: string,
  ipHash: string,
): Promise<EventoPrediccionPublico | null> {
  const evento = await db.evento.findFirst({
    where: {
      id: eventoId,
      estado: { in: ESTADOS_EVENTO_PUBLICOS },
    },
    select: {
      id: true,
      numero: true,
      fecha: true,
      estado: true,
      combates: {
        where: {
          prediccionHabilitada: true,
          tipo: {
            in: TIPOS_COMBATE_CON_PREDICCION as unknown as (
              | "ESTELAR"
              | "CO_ESTELAR"
              | "CARTELERA_PRINCIPAL"
            )[],
          },
        },
        orderBy: { numeroPelea: "desc" },
        select: {
          id: true,
          tipo: true,
          numeroPelea: true,
          estado: true,
          titulo: true,
          prediccionHabilitada: true,
          ganadorId: true,
          peleador1Id: true,
          peleador2Id: true,
          peleador1: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              apodo: true,
              ciudad: true,
              equipo: { select: { id: true, nombre: true } },
              records: {
                select: { victorias: true, derrotas: true, empates: true },
              },
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
              records: {
                select: { victorias: true, derrotas: true, empates: true },
              },
            },
          },
          categoriaPeso: { select: { id: true, nombre: true } },
          modalidad: { select: { id: true, nombre: true } },
          _count: { select: { votosPrediccion: true } },
          votosPrediccion: {
            where: { ipHash },
            select: { peleadorId: true },
            take: 1,
          },
        },
      },
    },
  });

  if (!evento) return null;

  const combateIds = evento.combates.map((c) => c.id);
  const votosPorCombate = await db.votoPrediccion.groupBy({
    by: ["combateId", "peleadorId"],
    where: { combateId: { in: combateIds } },
    _count: { _all: true },
  });

  const combates: CombatePrediccionPublico[] = evento.combates.map((c) => {
    const totalVotos = c._count.votosPrediccion;
    const votosPel1 =
      votosPorCombate.find(
        (v) => v.combateId === c.id && v.peleadorId === c.peleador1Id,
      )?._count._all ?? 0;
    const votosPel2 =
      votosPorCombate.find(
        (v) => v.combateId === c.id && v.peleadorId === c.peleador2Id,
      )?._count._all ?? 0;

    return {
      id: c.id,
      tipo: c.tipo,
      numeroPelea: c.numeroPelea,
      estado: c.estado,
      titulo: c.titulo,
      prediccionHabilitada: c.prediccionHabilitada,
      ganadorId: c.ganadorId,
      peleador1: mapPeleadorRecord(c.peleador1),
      peleador2: mapPeleadorRecord(c.peleador2),
      categoriaPeso: c.categoriaPeso,
      modalidad: c.modalidad,
      totalVotos,
      votosPeleador1: votosPel1,
      votosPeleador2: votosPel2,
      porcentajePeleador1: calcularPorcentajes(totalVotos, votosPel1),
      porcentajePeleador2: calcularPorcentajes(totalVotos, votosPel2),
      miVotoId: c.votosPrediccion[0]?.peleadorId ?? null,
    };
  });

  return {
    id: evento.id,
    numero: evento.numero,
    fecha: evento.fecha,
    estado: evento.estado,
    combates,
    totalVotosEvento: combates.reduce((sum, c) => sum + c.totalVotos, 0),
  };
}

export async function getPrediccionesEvento(
  eventoId: string,
): Promise<EventoPrediccionPublico | null> {
  try {
    const ipHash = await getHashedIp();
    return await fetchPrediccionesEvento(eventoId, ipHash);
  } catch (error) {
    console.error("Error al obtener predicciones del evento:", error);
    return null;
  }
}

async function fetchAllEventosDashboard() {
  return db.evento.findMany({
    orderBy: { numero: "desc" },
    select: {
      id: true,
      numero: true,
      fecha: true,
      estado: true,
      combates: {
        where: {
          tipo: {
            in: TIPOS_COMBATE_CON_PREDICCION as unknown as (
              | "ESTELAR"
              | "CO_ESTELAR"
              | "CARTELERA_PRINCIPAL"
            )[],
          },
        },
        orderBy: { numeroPelea: "desc" },
        select: {
          id: true,
          tipo: true,
          numeroPelea: true,
          estado: true,
          titulo: true,
          prediccionHabilitada: true,
          peleador1Id: true,
          peleador2Id: true,
          peleador1: {
            select: { id: true, nombre: true, apellido: true, apodo: true },
          },
          peleador2: {
            select: { id: true, nombre: true, apellido: true, apodo: true },
          },
          categoriaPeso: { select: { id: true, nombre: true } },
          _count: { select: { votosPrediccion: true } },
        },
      },
    },
  });
}

async function buildEventoAdmin(
  evento: Awaited<ReturnType<typeof fetchAllEventosDashboard>>[number],
): Promise<EventoPrediccionAdmin> {
  const combateIds = evento.combates.map((c) => c.id);
  const votosPorCombate = combateIds.length
    ? await db.votoPrediccion.groupBy({
        by: ["combateId", "peleadorId"],
        where: { combateId: { in: combateIds } },
        _count: { _all: true },
      })
    : [];

  const combates: CombatePrediccionAdmin[] = evento.combates.map((c) => {
    const totalVotos = c._count.votosPrediccion;
    const votosPel1 =
      votosPorCombate.find(
        (v) => v.combateId === c.id && v.peleadorId === c.peleador1Id,
      )?._count._all ?? 0;
    const votosPel2 =
      votosPorCombate.find(
        (v) => v.combateId === c.id && v.peleadorId === c.peleador2Id,
      )?._count._all ?? 0;

    return {
      id: c.id,
      tipo: c.tipo,
      numeroPelea: c.numeroPelea,
      estado: c.estado,
      titulo: c.titulo,
      prediccionHabilitada: c.prediccionHabilitada,
      peleador1: c.peleador1,
      peleador2: c.peleador2,
      categoriaPeso: c.categoriaPeso,
      totalVotos,
      votosPeleador1: votosPel1,
      votosPeleador2: votosPel2,
      porcentajePeleador1: calcularPorcentajes(totalVotos, votosPel1),
      porcentajePeleador2: calcularPorcentajes(totalVotos, votosPel2),
    };
  });

  const combatesConPredicciones = combates.filter(
    (c) => c.prediccionHabilitada,
  ).length;

  return {
    id: evento.id,
    numero: evento.numero,
    fecha: evento.fecha,
    estado: evento.estado,
    combates,
    totalVotosEvento: combates.reduce((sum, c) => sum + c.totalVotos, 0),
    combatesConPredicciones,
  };
}

export async function getEventosDashboardPredicciones(): Promise<
  EventoPrediccionAdmin[]
> {
  try {
    const eventos = await fetchAllEventosDashboard();
    return await Promise.all(eventos.map(buildEventoAdmin));
  } catch (error) {
    console.error("Error al obtener dashboard de predicciones:", error);
    return [];
  }
}

export async function getEstadisticasPrediccionesDashboard(
  eventoId: string,
): Promise<EstadisticasPrediccionDashboard> {
  const [totalCombatesActivos, totalVotos, combatesPrincipalActivos] =
    await Promise.all([
      db.combate.count({
        where: { eventoId, prediccionHabilitada: true },
      }),
      db.votoPrediccion.count({
        where: { combate: { eventoId } },
      }),
      db.combate.count({
        where: {
          eventoId,
          prediccionHabilitada: true,
          tipo: "CARTELERA_PRINCIPAL",
        },
      }),
    ]);

  return { totalCombatesActivos, totalVotos, combatesPrincipalActivos };
}
