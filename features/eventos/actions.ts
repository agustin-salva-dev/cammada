"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { eventoSchema } from "./zod";

const DASHBOARD_EVENTOS_PATH = "/dashboard/eventos";

export async function getEventos() {
  try {
    const eventos = await db.evento.findMany({
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
          },
          orderBy: {
            numeroPelea: "asc",
          },
        },
      },
    });
    return { success: true, data: eventos };
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return { success: false, error: "No se pudieron cargar los eventos" };
  }
}

export async function getEventoById(id: string) {
  try {
    const evento = await db.evento.findUnique({
      where: { id },
    });
    if (!evento) {
      return { success: false, error: "Evento no encontrado" };
    }
    return { success: true, data: evento };
  } catch (error) {
    console.error("Error al obtener evento:", error);
    return { success: false, error: "No se pudo obtener el evento" };
  }
}

export async function createEvento(rawInput: unknown) {
  try {
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

    revalidatePath(DASHBOARD_EVENTOS_PATH);
    return { success: true, data: evento };
  } catch (error) {
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

    revalidatePath(DASHBOARD_EVENTOS_PATH);
    return { success: true, data: evento };
  } catch (error) {
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
    const evento = await db.evento.findUnique({
      where: { id },
    });

    if (!evento) {
      return { success: false, error: "El evento no existe" };
    }

    await db.evento.delete({
      where: { id },
    });

    revalidatePath(DASHBOARD_EVENTOS_PATH);
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar evento:", error);
    return { success: false, error: "No se pudo eliminar el evento" };
  }
}
