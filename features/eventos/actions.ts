"use server";

import { db } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { eventoSchema } from "./zod";
import type { ActionResult } from "@/lib/types";
import type { EventoConDetalle } from "./types";
import { requirePermission, toAuthError } from "@/lib/action-guard";
import { PERMISSIONS } from "@/constants/permissions";

import { unstable_cache } from "next/cache";

const DASHBOARD_EVENTOS_PATH = "/dashboard/eventos";

const getCachedEventos = unstable_cache(
  async () => {
    return db.evento.findMany({
      orderBy: { numero: "desc" },
      include: {
        _count: {
          select: { combates: true },
        },
        combates: {
          include: {
            peleador1: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
                apodo: true,
              },
            },
            peleador2: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
                apodo: true,
              },
            },
            modalidad: {
              select: {
                id: true,
                nombre: true,
              },
            },
            categoriaPeso: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
          orderBy: {
            numeroPelea: "asc",
          },
        },
      },
    });
  },
  ["eventos-list"],
  { revalidate: false, tags: ["eventos"] }
);

export async function getEventos(): Promise<ActionResult<EventoConDetalle[]>> {
  try {
    await requirePermission(PERMISSIONS.EVENTOS.VER);

    const eventos = await getCachedEventos();
    return { success: true, data: eventos };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    console.error("Error al obtener eventos:", error);
    return { success: false, error: "No se pudieron cargar los eventos" };
  }
}

export async function getEventoById(id: string) {
  try {
    await requirePermission(PERMISSIONS.EVENTOS.VER);

    const evento = await db.evento.findUnique({
      where: { id },
    });
    if (!evento) {
      return { success: false, error: "Evento no encontrado" };
    }
    return { success: true, data: evento };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    console.error("Error al obtener evento:", error);
    return { success: false, error: "No se pudo obtener el evento" };
  }
}

export async function createEvento(rawInput: unknown) {
  try {
    await requirePermission(PERMISSIONS.EVENTOS.CREAR);

    const validation = eventoSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: "Datos inválidos",
        details: validation.error.format(),
      };
    }

    const {
      numero,
      fecha,
      horaInicio,
      horaFin,
      lugarNombre,
      calle,
      calleNumero,
      estado,
    } = validation.data;

    const evento = await db.evento.create({
      data: {
        numero,
        fecha: new Date(fecha),
        horaInicio,
        horaFin,
        lugarNombre,
        calle,
        calleNumero,
        estado,
      },
    });

    revalidateTag("eventos", "max");
    revalidatePath(DASHBOARD_EVENTOS_PATH);
    return { success: true, data: evento };
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
        error: "Ya existe un evento con ese número.",
      };
    }
    console.error("Error al crear evento:", error);
    return { success: false, error: "No se pudo crear el evento" };
  }
}

export async function updateEvento(id: string, rawInput: unknown) {
  try {
    await requirePermission(PERMISSIONS.EVENTOS.EDITAR);

    const validation = eventoSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: "Datos inválidos",
        details: validation.error.format(),
      };
    }

    const {
      numero,
      fecha,
      horaInicio,
      horaFin,
      lugarNombre,
      calle,
      calleNumero,
      estado,
    } = validation.data;

    const evento = await db.evento.update({
      where: { id },
      data: {
        numero,
        fecha: new Date(fecha),
        horaInicio,
        horaFin,
        lugarNombre,
        calle,
        calleNumero,
        estado,
      },
    });

    revalidateTag("eventos", "max");
    revalidatePath(DASHBOARD_EVENTOS_PATH);
    return { success: true, data: evento };
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
        error: "Ya existe un evento con ese número.",
      };
    }
    console.error("Error al actualizar evento:", error);
    return { success: false, error: "No se pudo actualizar el evento" };
  }
}

export async function deleteEvento(id: string) {
  try {
    await requirePermission(PERMISSIONS.EVENTOS.ELIMINAR);

    const evento = await db.evento.findUnique({
      where: { id },
    });

    if (!evento) {
      return { success: false, error: "El evento no existe" };
    }

    await db.evento.delete({
      where: { id },
    });

    revalidateTag("eventos", "max");
    revalidatePath(DASHBOARD_EVENTOS_PATH);
    return { success: true };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    console.error("Error al eliminar evento:", error);
    return { success: false, error: "No se pudo eliminar el evento" };
  }
}
