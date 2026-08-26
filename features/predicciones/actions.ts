"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getHashedIp } from "@/lib/ip-hash";
import { requirePermission, toAuthError } from "@/lib/action-guard";
import { PERMISSIONS } from "@/constants/permissions";
import type { ActionResult } from "@/lib/types";
import {
  votarPrediccionSchema,
  cancelarVotoPrediccionSchema,
  togglePrediccionCombateSchema,
  bulkTogglePrediccionesSchema,
  resetearVotosCombateSchema,
  resetearVotosEventoSchema,
} from "./zod";
import { MAX_PREDICCIONES_CARTELERA_PRINCIPAL } from "./constants";

function revalidarPredicciones() {
  revalidatePath("/predicciones");
  revalidatePath("/dashboard/predicciones");
}

export async function votarPrediccion(
  rawInput: unknown,
): Promise<ActionResult<{ peleadorId: string }>> {
  try {
    const validation = votarPrediccionSchema.safeParse(rawInput);
    if (!validation.success) {
      return { success: false, error: "Datos de voto inválidos." };
    }

    const { combateId, peleadorId } = validation.data;
    const ipHash = await getHashedIp();

    const combate = await db.combate.findUnique({
      where: { id: combateId },
      select: {
        prediccionHabilitada: true,
        estado: true,
        ganadorId: true,
        peleador1Id: true,
        peleador2Id: true,
        tipo: true,
      },
    });

    if (!combate) {
      return { success: false, error: "Combate no encontrado." };
    }

    if (!combate.prediccionHabilitada) {
      return {
        success: false,
        error: "Las predicciones no están habilitadas para este combate.",
      };
    }

    if (combate.estado === "FINALIZADO" || combate.ganadorId !== null) {
      return {
        success: false,
        error: "Este combate ya finalizó. No se pueden emitir votos.",
      };
    }

    if (combate.estado === "CANCELADO") {
      return { success: false, error: "Este combate fue cancelado." };
    }

    if (
      peleadorId !== combate.peleador1Id &&
      peleadorId !== combate.peleador2Id
    ) {
      return {
        success: false,
        error: "El peleador seleccionado no participa en este combate.",
      };
    }
    await db.votoPrediccion.upsert({
      where: { combateId_ipHash: { combateId, ipHash } },
      create: { combateId, peleadorId, ipHash },
      update: { peleadorId },
    });

    revalidarPredicciones();

    return { success: true, data: { peleadorId } };
  } catch (error) {
    console.error("Error al votar en predicción:", error);
    return {
      success: false,
      error: "Ocurrió un error al registrar tu voto. Intentá de nuevo.",
    };
  }
}

export async function cancelarVotoPrediccion(
  rawInput: unknown,
): Promise<ActionResult<void>> {
  try {
    const validation = cancelarVotoPrediccionSchema.safeParse(rawInput);
    if (!validation.success) {
      return { success: false, error: "ID de combate inválido." };
    }

    const { combateId } = validation.data;
    const ipHash = await getHashedIp();

    await db.votoPrediccion.deleteMany({
      where: { combateId, ipHash },
    });

    revalidarPredicciones();

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error al cancelar voto:", error);
    return { success: false, error: "Ocurrió un error al cancelar tu voto." };
  }
}

export async function togglePrediccionCombate(
  rawInput: unknown,
): Promise<ActionResult<{ prediccionHabilitada: boolean }>> {
  try {
    await requirePermission(PERMISSIONS.PREDICCIONES.GESTIONAR);

    const validation = togglePrediccionCombateSchema.safeParse(rawInput);
    if (!validation.success) {
      return { success: false, error: "Datos inválidos." };
    }

    const { combateId, habilitada } = validation.data;

    const combate = await db.combate.findUnique({
      where: { id: combateId },
      select: { tipo: true, eventoId: true, estado: true },
    });

    if (!combate) {
      return { success: false, error: "Combate no encontrado." };
    }

    if (combate.tipo === "PRELIMINAR") {
      return {
        success: false,
        error: "Los combates preliminares no pueden tener predicciones.",
      };
    }

    if (habilitada && combate.tipo === "CARTELERA_PRINCIPAL") {
      const activosActuales = await db.combate.count({
        where: {
          eventoId: combate.eventoId,
          tipo: "CARTELERA_PRINCIPAL",
          prediccionHabilitada: true,
          id: { not: combateId },
        },
      });

      if (activosActuales >= MAX_PREDICCIONES_CARTELERA_PRINCIPAL) {
        return {
          success: false,
          error: `Se alcanzó el máximo de ${MAX_PREDICCIONES_CARTELERA_PRINCIPAL} predicciones para la Cartelera Principal. Desactivá otra pelea antes de habilitar esta.`,
        };
      }
    }

    await db.combate.update({
      where: { id: combateId },
      data: { prediccionHabilitada: habilitada },
    });

    revalidarPredicciones();

    return { success: true, data: { prediccionHabilitada: habilitada } };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    console.error("Error al toggle predicción:", error);
    return { success: false, error: "Error al actualizar la predicción." };
  }
}

export async function bulkTogglePredicciones(
  rawInput: unknown,
): Promise<ActionResult<{ actualizados: number }>> {
  try {
    await requirePermission(PERMISSIONS.PREDICCIONES.GESTIONAR);

    const validation = bulkTogglePrediccionesSchema.safeParse(rawInput);
    if (!validation.success) {
      return { success: false, error: "Datos inválidos." };
    }

    const { eventoId, combateIds, habilitada } = validation.data;

    if (habilitada) {
      const combatesAProcesar = await db.combate.findMany({
        where: { id: { in: combateIds }, eventoId },
        select: { id: true, tipo: true },
      });

      const preliminares = combatesAProcesar.filter(
        (c) => c.tipo === "PRELIMINAR",
      );
      if (preliminares.length > 0) {
        return {
          success: false,
          error: "Los combates preliminares no pueden tener predicciones.",
        };
      }

      const principalNuevos = combatesAProcesar.filter(
        (c) => c.tipo === "CARTELERA_PRINCIPAL",
      );

      if (principalNuevos.length > 0) {
        const yaActivos = await db.combate.count({
          where: {
            eventoId,
            tipo: "CARTELERA_PRINCIPAL",
            prediccionHabilitada: true,
            id: { notIn: combateIds },
          },
        });

        if (
          yaActivos + principalNuevos.length >
          MAX_PREDICCIONES_CARTELERA_PRINCIPAL
        ) {
          return {
            success: false,
            error: `Esta operación superaría el límite de ${MAX_PREDICCIONES_CARTELERA_PRINCIPAL} predicciones para la Cartelera Principal.`,
          };
        }
      }
    }

    const resultado = await db.combate.updateMany({
      where: {
        id: { in: combateIds },
        eventoId,
        tipo: { not: "PRELIMINAR" },
      },
      data: { prediccionHabilitada: habilitada },
    });

    revalidarPredicciones();

    return { success: true, data: { actualizados: resultado.count } };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    console.error("Error en bulk toggle predicciones:", error);
    return { success: false, error: "Error al actualizar las predicciones." };
  }
}

export async function resetearVotosCombate(
  rawInput: unknown,
): Promise<ActionResult<{ eliminados: number }>> {
  try {
    await requirePermission(PERMISSIONS.PREDICCIONES.GESTIONAR);

    const validation = resetearVotosCombateSchema.safeParse(rawInput);
    if (!validation.success) {
      return { success: false, error: "ID de combate inválido." };
    }

    const { combateId } = validation.data;

    const resultado = await db.votoPrediccion.deleteMany({
      where: { combateId },
    });

    revalidarPredicciones();

    return { success: true, data: { eliminados: resultado.count } };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    console.error("Error al resetear votos del combate:", error);
    return { success: false, error: "Error al eliminar los votos." };
  }
}

export async function resetearVotosEvento(
  rawInput: unknown,
): Promise<ActionResult<{ eliminados: number }>> {
  try {
    await requirePermission(PERMISSIONS.PREDICCIONES.GESTIONAR);

    const validation = resetearVotosEventoSchema.safeParse(rawInput);
    if (!validation.success) {
      return { success: false, error: "ID de evento inválido." };
    }

    const { eventoId } = validation.data;

    const resultado = await db.votoPrediccion.deleteMany({
      where: { combate: { eventoId } },
    });

    revalidarPredicciones();

    return { success: true, data: { eliminados: resultado.count } };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    console.error("Error al resetear votos del evento:", error);
    return { success: false, error: "Error al eliminar los votos del evento." };
  }
}
