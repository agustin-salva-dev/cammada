"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getHashedIp } from "@/lib/ip-hash";
import { checkRateLimit } from "@/lib/rate-limiter";
import { requirePermission, toAuthError } from "@/lib/action-guard";
import { PERMISSIONS } from "@/constants/permissions";
import type { ActionResult } from "@/lib/types";
import {
  opinionSchema,
  valoracionesSchema,
  npsSchema,
  votarSugerenciaSchema,
  respuestaOficialSchema,
  moderarOpinionSchema,
  eliminarOpinionSchema,
  eliminarOpinionesSchema,
} from "./zod";
import {
  OPINION_RATE_LIMIT,
  VALORACION_RATE_LIMIT,
  NPS_RATE_LIMIT,
} from "./constants";

async function checkOpinionRateLimit(
  ipHash: string,
  prefix: string,
): Promise<{ allowed: boolean; error?: string }> {
  const key = `${prefix}:${ipHash}`;
  const result = await checkRateLimit(key);

  if (!result.allowed) {
    const horasRestantes = result.remainingMs
      ? Math.ceil(result.remainingMs / (1000 * 60 * 60))
      : 24;
    return {
      allowed: false,
      error: `Has alcanzado el límite de envíos. Intenta de nuevo en ${horasRestantes}h.`,
    };
  }

  return { allowed: true };
}

export async function submitOpinion(
  rawInput: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const validation = opinionSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: "Datos inválidos. Por favor verifica los campos.",
      };
    }

    const ipHash = await getHashedIp();

    const rateLimitResult = await checkOpinionRateLimit(
      ipHash,
      OPINION_RATE_LIMIT.prefix,
    );
    if (!rateLimitResult.allowed) {
      return { success: false, error: rateLimitResult.error! };
    }

    const {
      nombreUsuario,
      rolParticipante,
      tipo,
      titulo,
      descripcion,
      categoria,
      estrellas,
    } = validation.data;

    const opinion = await db.opinion.create({
      data: {
        nombreUsuario: nombreUsuario || "Anónimo",
        rolParticipante,
        tipo,
        titulo,
        descripcion,
        categoria,
        estrellas: estrellas ?? null,
        estado: "PENDIENTE",
        ipHash,
      },
      select: { id: true },
    });

    return { success: true, data: { id: opinion.id } };
  } catch (error) {
    console.error("Error submitting opinion:", error);
    return {
      success: false,
      error: "Error interno del servidor. Por favor intenta de nuevo.",
    };
  }
}

export async function submitValoraciones(
  rawInput: unknown,
): Promise<ActionResult<{ count: number }>> {
  try {
    const validation = valoracionesSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: "Datos inválidos. Por favor verifica los campos.",
      };
    }

    const ipHash = await getHashedIp();

    const rateLimitResult = await checkOpinionRateLimit(
      ipHash,
      VALORACION_RATE_LIMIT.prefix,
    );
    if (!rateLimitResult.allowed) {
      return { success: false, error: rateLimitResult.error! };
    }

    const valoraciones = validation.data;

    const created = await db.valoracionAspecto.createMany({
      data: valoraciones.map((v) => ({
        categoria: v.categoria,
        estrellas: v.estrellas,
        ipHash,
      })),
    });

    revalidatePath("/opiniones");

    return { success: true, data: { count: created.count } };
  } catch (error) {
    console.error("Error submitting valoraciones:", error);
    return {
      success: false,
      error: "Error interno del servidor. Por favor intenta de nuevo.",
    };
  }
}

export async function submitNPS(
  rawInput: unknown,
): Promise<ActionResult<null>> {
  try {
    const validation = npsSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: "Datos inválidos. Por favor verifica los campos.",
      };
    }

    const ipHash = await getHashedIp();

    const rateLimitResult = await checkOpinionRateLimit(
      ipHash,
      NPS_RATE_LIMIT.prefix,
    );
    if (!rateLimitResult.allowed) {
      return { success: false, error: rateLimitResult.error! };
    }

    const { nps, intencionRetorno, satisfaccionWeb } = validation.data;

    await db.indiceImpactoNPS.create({
      data: {
        ipHash,
        nps,
        intencionRetorno,
        satisfaccionWeb,
      },
    });

    revalidatePath("/opiniones");
    revalidatePath("/opinar");

    return { success: true, data: null };
  } catch (error) {
    console.error("Error al enviar NPS:", error);
    return {
      success: false,
      error: "No se pudo enviar tu respuesta. Intenta de nuevo.",
    };
  }
}

export async function votarSugerencia(
  rawInput: unknown,
): Promise<ActionResult<{ conteoVotos: number }>> {
  try {
    const validation = votarSugerenciaSchema.safeParse(rawInput);
    if (!validation.success) {
      return { success: false, error: "ID de sugerencia inválido." };
    }

    const { opinionId } = validation.data;
    const ipHash = await getHashedIp();

    const opinion = await db.opinion.findUnique({
      where: { id: opinionId },
      select: { tipo: true, estado: true },
    });

    if (
      !opinion ||
      opinion.tipo !== "SUGERENCIA" ||
      opinion.estado !== "APROBADA"
    ) {
      return { success: false, error: "Sugerencia no encontrada." };
    }

    try {
      await db.$transaction(async (tx) => {
        await tx.votoOpinion.create({
          data: { opinionId, ipHash },
        });
        await tx.opinion.update({
          where: { id: opinionId },
          data: { conteoVotos: { increment: 1 } },
        });
      });
    } catch (e: unknown) {
      if (
        typeof e === "object" &&
        e !== null &&
        "code" in e &&
        (e as { code: string }).code === "P2002"
      ) {
        return { success: false, error: "Ya has votado por esta sugerencia." };
      }
      throw e;
    }

    revalidatePath("/opiniones");

    const updated = await db.opinion.findUnique({
      where: { id: opinionId },
      select: { conteoVotos: true },
    });

    return { success: true, data: { conteoVotos: updated?.conteoVotos ?? 0 } };
  } catch (error) {
    console.error("Error al votar sugerencia:", error);
    return {
      success: false,
      error: "No se pudo registrar el voto. Intenta de nuevo.",
    };
  }
}

export async function moderarOpinion(
  rawInput: unknown,
): Promise<ActionResult<null>> {
  try {
    await requirePermission(PERMISSIONS.OPINIONES.MODERAR);

    const validation = moderarOpinionSchema.safeParse(rawInput);
    if (!validation.success) {
      return { success: false, error: "Datos inválidos." };
    }

    const { opinionId, estado } = validation.data;

    await db.opinion.update({
      where: { id: opinionId },
      data: { estado },
    });

    revalidatePath("/opiniones");

    return { success: true, data: null };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    console.error("Error al moderar opinión:", error);
    return { success: false, error: "No se pudo moderar la opinión." };
  }
}

export async function responderOpinion(
  rawInput: unknown,
): Promise<ActionResult<null>> {
  try {
    const user = await requirePermission(PERMISSIONS.OPINIONES.RESPONDER);

    const validation = respuestaOficialSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: "Datos inválidos. Por favor verifica los campos.",
      };
    }

    const { opinionId, contenido } = validation.data;

    const opinion = await db.opinion.findUnique({
      where: { id: opinionId },
      select: { estado: true },
    });

    if (!opinion) {
      return { success: false, error: "Opinión no encontrada." };
    }

    if (opinion.estado !== "APROBADA") {
      return {
        success: false,
        error: "Solo se puede responder a opiniones aprobadas.",
      };
    }

    await db.respuestaOficial.upsert({
      where: { opinionId },
      create: {
        opinionId,
        usuarioId: user.id,
        contenido,
      },
      update: {
        contenido,
        usuarioId: user.id,
      },
    });

    revalidatePath("/opiniones");

    return { success: true, data: null };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    console.error("Error al responder opinión:", error);
    return { success: false, error: "No se pudo enviar la respuesta." };
  }
}

export async function eliminarRespuesta(
  opinionId: string,
): Promise<ActionResult<null>> {
  try {
    await requirePermission(PERMISSIONS.OPINIONES.MODERAR);

    await db.respuestaOficial.delete({ where: { opinionId } });

    revalidatePath("/opiniones");

    return { success: true, data: null };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    console.error("Error al eliminar respuesta:", error);
    return { success: false, error: "No se pudo eliminar la respuesta." };
  }
}

export async function eliminarOpinion(
  rawInput: unknown,
): Promise<ActionResult<null>> {
  try {
    await requirePermission(PERMISSIONS.OPINIONES.MODERAR);

    const validation = eliminarOpinionSchema.safeParse(rawInput);
    if (!validation.success) {
      return { success: false, error: "ID de opinión inválido." };
    }

    const { opinionId } = validation.data;

    await db.opinion.delete({
      where: { id: opinionId },
    });

    revalidatePath("/opiniones");
    revalidatePath("/dashboard/opiniones");

    return { success: true, data: null };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    console.error("Error al eliminar opinión:", error);
    return { success: false, error: "No se pudo eliminar la opinión." };
  }
}

export async function eliminarOpiniones(
  rawInput: unknown,
): Promise<ActionResult<{ count: number }>> {
  try {
    await requirePermission(PERMISSIONS.OPINIONES.MODERAR);

    const validation = eliminarOpinionesSchema.safeParse(rawInput);
    if (!validation.success) {
      return { success: false, error: "Selección de opiniones inválida." };
    }

    const { opinionIds } = validation.data;

    const result = await db.opinion.deleteMany({
      where: {
        id: { in: opinionIds },
      },
    });

    revalidatePath("/opiniones");
    revalidatePath("/dashboard/opiniones");

    return { success: true, data: { count: result.count } };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    console.error("Error al eliminar opiniones en lote:", error);
    return { success: false, error: "No se pudieron eliminar las opiniones seleccionadas." };
  }
}

