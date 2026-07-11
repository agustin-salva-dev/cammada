"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { rankingSchema } from "./zod";
import type { ActionResult } from "@/lib/types";
import { requirePermission, toAuthError } from "@/lib/action-guard";
import { PERMISSIONS } from "@/constants/permissions";

const TOP_LIMIT = 15;

export type RankingItemConLuchador = {
  id: string;
  posicion: number;
  luchador: {
    id: string;
    nombre: string;
    apellido: string;
    apodo: string;
    pais: string;
    categoria: { nombre: string } | null;
    equipo: { nombre: string };
  };
};

export type CampeonDetalle = {
  id: string;
  nombre: string;
  apellido: string;
  apodo: string;
  equipo: { nombre: string };
};

export type RankingConDetalle = {
  id: string;
  categoriaPesoId: string | null;
  categoriaPeso: { id: string; nombre: string } | null;
  modalidadId: string;
  modalidad: { id: string; nombre: string };
  campeonId: string | null;
  campeon: CampeonDetalle | null;
  items: RankingItemConLuchador[];
  totalItems: number;
};

export async function getRankings(): Promise<ActionResult<RankingConDetalle[]>> {
  try {
    await requirePermission(PERMISSIONS.RANKINGS.VER);
    const rankings = await db.ranking.findMany({
      include: {
        categoriaPeso: { select: { id: true, nombre: true } },
        modalidad: { select: { id: true, nombre: true } },
        campeon: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            apodo: true,
            equipo: { select: { nombre: true } },
          },
        },
        items: {
          take: TOP_LIMIT,
          orderBy: { posicion: "asc" },
          include: {
            luchador: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
                apodo: true,
                pais: true,
                categoria: { select: { nombre: true } },
                equipo: { select: { nombre: true } },
              },
            },
          },
        },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    const result = rankings.map(({ _count, ...r }) => ({
      ...r,
      totalItems: _count.items,
    }));

    return { success: true, data: result };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    console.error("Error al obtener rankings:", error);
    return { success: false, error: "No se pudieron cargar los rankings" };
  }
}

export async function getRankingById(id: string) {
  try {
    await requirePermission(PERMISSIONS.RANKINGS.VER);
    const ranking = await db.ranking.findUnique({
      where: { id },
      include: {
        categoriaPeso: { select: { id: true, nombre: true } },
        modalidad: { select: { id: true, nombre: true } },
        campeon: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            apodo: true,
            equipo: { select: { nombre: true } },
          },
        },
        items: {
          orderBy: { posicion: "asc" },
          include: {
            luchador: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
                apodo: true,
                pais: true,
                categoria: { select: { nombre: true } },
                equipo: { select: { nombre: true } },
              },
            },
          },
        },
        _count: { select: { items: true } },
      },
    });

    if (!ranking) {
      return { success: false, error: "El ranking no existe" };
    }

    const { _count, ...rest } = ranking;
    return { success: true, data: { ...rest, totalItems: _count.items } };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    console.error("Error al obtener el ranking:", error);
    return { success: false, error: "No se pudo cargar el ranking" };
  }
}

export async function createRanking(rawInput: unknown) {
  try {
    await requirePermission(PERMISSIONS.RANKINGS.CREAR);

    const validation = rankingSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: "Datos inválidos",
        details: validation.error.format(),
      };
    }

    const { modalidadId, categoriaPesoId, campeonId, items } = validation.data;

    const ranking = await db.$transaction(async (tx) => {
      const created = await tx.ranking.create({
        data: {
          modalidadId,
          categoriaPesoId: categoriaPesoId ?? null,
          campeonId: campeonId ?? null,
          items: {
            create: items.map((item) => ({
              luchadorId: item.luchadorId,
              posicion: item.posicion,
            })),
          },
        },
      });
      return created;
    });

    revalidatePath("/dashboard/rankings");
    return { success: true, data: ranking };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return {
        success: false,
        error: "Ya existe un ranking para esa categoría y modalidad.",
      };
    }
    console.error("Error al crear el ranking:", error);
    return { success: false, error: "No se pudo crear el ranking" };
  }
}

export async function updateRankingItems(rankingId: string, rawInput: unknown) {
  try {
    await requirePermission(PERMISSIONS.RANKINGS.EDITAR);

    const validation = rankingSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: "Datos inválidos",
        details: validation.error.format(),
      };
    }

    const { modalidadId, categoriaPesoId, campeonId, items } = validation.data;

    await db.$transaction(async (tx) => {
      await tx.ranking.update({
        where: { id: rankingId },
        data: {
          modalidadId,
          categoriaPesoId: categoriaPesoId ?? null,
          campeonId: campeonId ?? null,
        },
      });

      await tx.rankingItem.deleteMany({ where: { rankingId } });

      if (items.length > 0) {
        await tx.rankingItem.createMany({
          data: items.map((item) => ({
            rankingId,
            luchadorId: item.luchadorId,
            posicion: item.posicion,
          })),
        });
      }
    });

    revalidatePath("/dashboard/rankings");
    return { success: true };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return {
        success: false,
        error: "Ya existe un ranking para esa categoría y modalidad.",
      };
    }
    console.error("Error al actualizar el ranking:", error);
    return { success: false, error: "No se pudo actualizar el ranking" };
  }
}

export async function deleteRanking(id: string) {
  try {
    await requirePermission(PERMISSIONS.RANKINGS.ELIMINAR);

    await db.ranking.delete({ where: { id } });
    revalidatePath("/dashboard/rankings");
    return { success: true };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    console.error("Error al eliminar el ranking:", error);
    return { success: false, error: "No se pudo eliminar el ranking" };
  }
}
