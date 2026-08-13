import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";
import type {
  OpinionPublica,
  MetricasGenerales,
  MetricaCategoria,
  NPSResultados,
} from "./types";

const respuestaOficialSelect = {
  id: true,
  contenido: true,
  createdAt: true,
  usuario: {
    select: {
      nombre: true,
      rol: true,
    },
  },
} as const;

async function fetchPublicOpiniones(): Promise<OpinionPublica[]> {
  const opiniones = await db.opinion.findMany({
    where: { estado: "APROBADA" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      nombreUsuario: true,
      rolParticipante: true,
      tipo: true,
      titulo: true,
      descripcion: true,
      categoria: true,
      estrellas: true,
      conteoVotos: true,
      createdAt: true,
      respuesta: {
        select: respuestaOficialSelect,
      },
    },
  });

  return opiniones;
}

export const getPublicOpiniones = unstable_cache(
  fetchPublicOpiniones,
  ["public-opiniones-list"],
  { revalidate: 60, tags: ["opiniones"] },
);

async function fetchTopSugerencias(): Promise<OpinionPublica[]> {
  const sugerencias = await db.opinion.findMany({
    where: { estado: "APROBADA", tipo: "SUGERENCIA" },
    orderBy: { conteoVotos: "desc" },
    take: 10,
    select: {
      id: true,
      nombreUsuario: true,
      rolParticipante: true,
      tipo: true,
      titulo: true,
      descripcion: true,
      categoria: true,
      estrellas: true,
      conteoVotos: true,
      createdAt: true,
      respuesta: {
        select: respuestaOficialSelect,
      },
    },
  });

  return sugerencias;
}

export const getTopSugerencias = unstable_cache(
  fetchTopSugerencias,
  ["public-sugerencias-top"],
  { revalidate: 60, tags: ["opiniones"] },
);

async function fetchMetricasGenerales(): Promise<MetricasGenerales> {
  const categorias = [
    "WEB_PLATAFORMA",
    "ORGANIZACION",
    "LUGAR_INSTALACIONES",
    "KIT_PREMIACION",
  ] as const;

  const metricas: MetricaCategoria[] = await Promise.all(
    categorias.map(async (cat) => {
      const valoraciones = await db.valoracionAspecto.findMany({
        where: { categoria: cat },
        select: { estrellas: true },
      });

      const total = valoraciones.length;
      const promedio =
        total > 0
          ? valoraciones.reduce((sum, v) => sum + v.estrellas, 0) / total
          : 0;

      const distribucion = [1, 2, 3, 4, 5].map((estrella) => {
        const cantidad = valoraciones.filter(
          (v) => v.estrellas === estrella,
        ).length;
        return {
          estrellas: estrella,
          cantidad,
          porcentaje: total > 0 ? Math.round((cantidad / total) * 100) : 0,
        };
      });

      return {
        categoria: cat,
        promedio: Math.round(promedio * 10) / 10,
        total,
        distribucion,
      };
    }),
  );

  const opinionesConEstrellas = await db.opinion.findMany({
    where: { estado: "APROBADA", estrellas: { not: null } },
    select: { estrellas: true },
  });

  const totalGeneral = opinionesConEstrellas.length;
  const promedioGeneral =
    totalGeneral > 0
      ? opinionesConEstrellas.reduce((sum, o) => sum + (o.estrellas ?? 0), 0) /
        totalGeneral
      : 0;

  const distribucionGeneral = [1, 2, 3, 4, 5].map((estrella) => {
    const cantidad = opinionesConEstrellas.filter(
      (o) => o.estrellas === estrella,
    ).length;
    return {
      estrellas: estrella,
      cantidad,
      porcentaje:
        totalGeneral > 0 ? Math.round((cantidad / totalGeneral) * 100) : 0,
    };
  });

  const totalOpiniones = await db.opinion.count({
    where: { estado: "APROBADA" },
  });

  return {
    promedioGeneral: Math.round(promedioGeneral * 10) / 10,
    totalOpiniones,
    distribucionGeneral,
    metricas,
  };
}

export const getMetricasGenerales = unstable_cache(
  fetchMetricasGenerales,
  ["public-opiniones-metricas"],
  { revalidate: 300, tags: ["opiniones", "valoraciones"] },
);

async function fetchNPSResultados(): Promise<NPSResultados> {
  const respuestas = await db.indiceImpactoNPS.findMany({
    select: { nps: true, intencionRetorno: true, satisfaccionWeb: true },
  });

  const total = respuestas.length;

  if (total === 0) {
    return {
      npsScore: 0,
      totalRespuestas: 0,
      distribucion: {
        promotores: { cantidad: 0, porcentaje: 0 },
        pasivos: { cantidad: 0, porcentaje: 0 },
        detractores: { cantidad: 0, porcentaje: 0 },
      },
      promedioRetencion: 0,
      promedioSatisfaccionWeb: 0,
    };
  }

  const promotores = respuestas.filter((r) => r.nps >= 9).length;
  const pasivos = respuestas.filter((r) => r.nps >= 7 && r.nps <= 8).length;
  const detractores = respuestas.filter((r) => r.nps <= 6).length;

  const npsScore = Math.round(((promotores - detractores) / total) * 100);

  const promedioRetencion =
    Math.round(
      (respuestas.reduce((sum, r) => sum + r.intencionRetorno, 0) / total) * 10,
    ) / 10;

  const promedioSatisfaccionWeb =
    Math.round(
      (respuestas.reduce((sum, r) => sum + r.satisfaccionWeb, 0) / total) * 10,
    ) / 10;

  return {
    npsScore,
    totalRespuestas: total,
    distribucion: {
      promotores: {
        cantidad: promotores,
        porcentaje: Math.round((promotores / total) * 100),
      },
      pasivos: {
        cantidad: pasivos,
        porcentaje: Math.round((pasivos / total) * 100),
      },
      detractores: {
        cantidad: detractores,
        porcentaje: Math.round((detractores / total) * 100),
      },
    },
    promedioRetencion,
    promedioSatisfaccionWeb,
  };
}

export const getNPSResultados = unstable_cache(
  fetchNPSResultados,
  ["public-nps-resultados"],
  { revalidate: 300, tags: ["nps"] },
);

export async function getOpinionesDashboard(estado?: string) {
  const opiniones = await db.opinion.findMany({
    where: estado
      ? { estado: estado as "PENDIENTE" | "APROBADA" | "RECHAZADA" }
      : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      nombreUsuario: true,
      rolParticipante: true,
      tipo: true,
      titulo: true,
      descripcion: true,
      categoria: true,
      estrellas: true,
      estado: true,
      conteoVotos: true,
      createdAt: true,
      respuesta: {
        select: respuestaOficialSelect,
      },
    },
  });

  return opiniones;
}

export async function getEstadisticasModeracion() {
  const [pendientes, aprobadas, rechazadas] = await Promise.all([
    db.opinion.count({ where: { estado: "PENDIENTE" } }),
    db.opinion.count({ where: { estado: "APROBADA" } }),
    db.opinion.count({ where: { estado: "RECHAZADA" } }),
  ]);

  return {
    pendientes,
    aprobadas,
    rechazadas,
    total: pendientes + aprobadas + rechazadas,
  };
}
