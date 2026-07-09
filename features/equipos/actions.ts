"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { equipoSchema } from "./zod";
import { Prisma } from "@prisma/client";
import type { ActionResult } from "@/lib/types";
import { requirePermission, toAuthError } from "@/lib/action-guard";
import { PERMISSIONS } from "@/constants/permissions";

type EquipoConCount = Prisma.EquipoGetPayload<{
  include: { _count: { select: { luchadores: true } } };
}>;

export async function getEquipos(): Promise<ActionResult<EquipoConCount[]>> {
  try {
    await requirePermission(PERMISSIONS.EQUIPOS.VER);

    const equipos = await db.equipo.findMany({
      include: {
        _count: {
          select: { luchadores: true },
        },
      },
      orderBy: {
        nombre: "asc",
      },
    });
    return { success: true, data: equipos };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    console.error("Error al obtener equipos:", error);
    return { success: false, error: "No se pudieron cargar los equipos" };
  }
}

export async function getEquipoById(id: string) {
  try {
    await requirePermission(PERMISSIONS.EQUIPOS.VER);

    const equipo = await db.equipo.findUnique({
      where: { id },
      include: {
        luchadores: true,
        _count: {
          select: { luchadores: true },
        },
      },
    });
    if (!equipo) {
      return { success: false, error: "Equipo no encontrado" };
    }
    return { success: true, data: equipo };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    console.error("Error al obtener equipo:", error);
    return { success: false, error: "No se pudo obtener el equipo" };
  }
}

export async function createEquipo(rawInput: unknown) {
  try {
    await requirePermission(PERMISSIONS.EQUIPOS.CREAR);

    const validation = equipoSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: "Datos inválidos",
        details: validation.error.format(),
      };
    }

    const { nombre, pais, ciudad } = validation.data;

    const equipo = await db.equipo.create({
      data: { nombre, pais, ciudad },
    });

    revalidatePath("/dashboard/equipos");
    return { success: true, data: equipo };
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
        error: `Ya existe un equipo con el nombre indicado.`,
      };
    }
    console.error("Error al crear equipo:", error);
    return { success: false, error: "No se pudo crear el equipo" };
  }
}

export async function updateEquipo(id: string, rawInput: unknown) {
  try {
    await requirePermission(PERMISSIONS.EQUIPOS.EDITAR);

    const validation = equipoSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: "Datos inválidos",
        details: validation.error.format(),
      };
    }

    const { nombre, pais, ciudad } = validation.data;

    const equipo = await db.equipo.update({
      where: { id },
      data: { nombre, pais, ciudad },
    });

    revalidatePath("/dashboard/equipos");
    return { success: true, data: equipo };
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
        error: `Ya existe un equipo con el nombre indicado.`,
      };
    }
    console.error("Error al actualizar equipo:", error);
    return { success: false, error: "No se pudo actualizar el equipo" };
  }
}

export async function deleteEquipo(id: string) {
  try {
    await requirePermission(PERMISSIONS.EQUIPOS.ELIMINAR);

    const equipo = await db.equipo.findUnique({
      where: { id },
      include: {
        _count: {
          select: { luchadores: true },
        },
      },
    });

    if (!equipo) {
      return { success: false, error: "El equipo no existe" };
    }

    if (equipo._count.luchadores > 0) {
      return {
        success: false,
        error: `No se puede eliminar: el equipo tiene ${equipo._count.luchadores} luchador(es) asociado(s).`,
      };
    }

    await db.equipo.delete({
      where: { id },
    });

    revalidatePath("/dashboard/equipos");
    return { success: true };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    console.error("Error al eliminar equipo:", error);
    return { success: false, error: "No se pudo eliminar el equipo" };
  }
}
