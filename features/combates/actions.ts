"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { combateSchema } from "./zod";
import type { ActionResult } from "@/lib/types";
import type { CombateConDetalle } from "./types";

const DASHBOARD_COMBATES_PATH = "/dashboard/combates";

const COMBATE_INCLUDE = {
  peleador1: { include: { equipo: true, categoria: true } },
  peleador2: { include: { equipo: true, categoria: true } },
  ganador: { select: { id: true, nombre: true, apellido: true, apodo: true } },
  evento: { select: { id: true, numero: true, fecha: true } },
  categoriaPeso: { select: { id: true, nombre: true } },
  modalidad: { select: { id: true, nombre: true } },
} as const;

export async function getCombates(): Promise<ActionResult<CombateConDetalle[]>> {
  try {
    const combates = await db.combate.findMany({
      include: COMBATE_INCLUDE,
      orderBy: [{ evento: { numero: "desc" } }, { numeroPelea: "asc" }],
    });
    return { success: true, data: combates };
  } catch (error) {
    console.error("Error al obtener combates:", error);
    return { success: false, error: "No se pudieron cargar los combates" };
  }
}

export async function createCombate(rawInput: unknown) {
  try {
    const validation = combateSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: "Datos inválidos",
        details: validation.error.format(),
      };
    }

    const data = validation.data;

    const combate = await db.combate.create({
      data: {
        peleador1Id: data.peleador1Id,
        peleador2Id: data.peleador2Id,
        rounds: data.rounds,
        duracionRounds: data.duracionRounds,
        eventoId: data.eventoId,
        tipo: data.tipo,
        numeroPelea: data.numeroPelea,
        horarioEstimado: data.horarioEstimado || null,
        categoriaPesoId: data.categoriaPesoId,
        modalidadId: data.modalidadId,
        titulo: data.titulo,
        estado: data.estado,
        ganadorId: data.ganadorId || null,
        viaVictoria: data.viaVictoria || null,
        roundFin: data.roundFin !== "" ? (data.roundFin as number) : null,
        minutoFin: data.minutoFin !== "" ? (data.minutoFin as number) : null,
        segundoFin: data.segundoFin !== "" ? (data.segundoFin as number) : null,
      },
      include: COMBATE_INCLUDE,
    });

    revalidatePath(DASHBOARD_COMBATES_PATH);
    return { success: true, data: combate };
  } catch (error) {
    console.error("Error al crear combate:", error);
    return { success: false, error: "No se pudo crear el combate" };
  }
}

export async function updateCombate(id: string, rawInput: unknown) {
  try {
    const validation = combateSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: "Datos inválidos",
        details: validation.error.format(),
      };
    }

    const data = validation.data;

    const combate = await db.combate.update({
      where: { id },
      data: {
        peleador1Id: data.peleador1Id,
        peleador2Id: data.peleador2Id,
        rounds: data.rounds,
        duracionRounds: data.duracionRounds,
        eventoId: data.eventoId,
        tipo: data.tipo,
        numeroPelea: data.numeroPelea,
        horarioEstimado: data.horarioEstimado || null,
        categoriaPesoId: data.categoriaPesoId,
        modalidadId: data.modalidadId,
        titulo: data.titulo,
        estado: data.estado,
        ganadorId: data.ganadorId || null,
        viaVictoria: data.viaVictoria || null,
        roundFin: data.roundFin !== "" ? (data.roundFin as number) : null,
        minutoFin: data.minutoFin !== "" ? (data.minutoFin as number) : null,
        segundoFin: data.segundoFin !== "" ? (data.segundoFin as number) : null,
      },
      include: COMBATE_INCLUDE,
    });

    revalidatePath(DASHBOARD_COMBATES_PATH);
    return { success: true, data: combate };
  } catch (error) {
    console.error("Error al actualizar combate:", error);
    return { success: false, error: "No se pudo actualizar el combate" };
  }
}

export async function deleteCombate(id: string) {
  try {
    const combate = await db.combate.findUnique({ where: { id } });

    if (!combate) {
      return { success: false, error: "El combate no existe" };
    }

    await db.combate.delete({ where: { id } });

    revalidatePath(DASHBOARD_COMBATES_PATH);
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar combate:", error);
    return { success: false, error: "No se pudo eliminar el combate" };
  }
}
