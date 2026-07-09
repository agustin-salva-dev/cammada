"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { modalidadSchema } from "./zod";
import type { Prisma } from "@prisma/client";
import type { ActionResult } from "@/lib/types";

type ModalidadSelect = { id: string; nombre: string };
type ModalidadConCount = Prisma.ModalidadGetPayload<{
  include: { _count: { select: { records: true } } };
}>;

export async function getModalidades(): Promise<ActionResult<ModalidadConCount[]>> {
  try {
    const modalidades = await db.modalidad.findMany({
      include: {
        _count: {
          select: { records: true },
        },
      },
      orderBy: {
        nombre: "asc",
      },
    });
    return { success: true, data: modalidades };
  } catch (error) {
    console.error("Error al obtener modalidades:", error);
    return { success: false, error: "No se pudieron cargar las modalidades" };
  }
}

export async function getModalidadesSelect(): Promise<ActionResult<ModalidadSelect[]>> {
  try {
    const modalidades = await db.modalidad.findMany({
      select: {
        id: true,
        nombre: true,
      },
      orderBy: {
        nombre: "asc",
      },
    });
    return { success: true, data: modalidades };
  } catch (error) {
    console.error("Error al obtener modalidades para select:", error);
    return { success: false, error: "No se pudieron cargar las modalidades" };
  }
}

export async function createModalidad(rawInput: unknown) {
  try {
    const validation = modalidadSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: "Datos inválidos",
        details: validation.error.format(),
      };
    }

    const { nombre } = validation.data;

    const modalidad = await db.modalidad.create({
      data: { nombre },
    });

    revalidatePath("/dashboard/modalidades");
    revalidatePath("/dashboard/luchadores");
    return { success: true, data: modalidad };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return {
        success: false,
        error: "Ya existe una modalidad con ese nombre.",
      };
    }
    console.error("Error al crear modalidad:", error);
    return { success: false, error: "No se pudo crear la modalidad" };
  }
}

export async function updateModalidad(id: string, rawInput: unknown) {
  try {
    const validation = modalidadSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: "Datos inválidos",
        details: validation.error.format(),
      };
    }

    const { nombre } = validation.data;

    const modalidad = await db.modalidad.update({
      where: { id },
      data: { nombre },
    });

    revalidatePath("/dashboard/modalidades");
    revalidatePath("/dashboard/luchadores");
    return { success: true, data: modalidad };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return {
        success: false,
        error: "Ya existe una modalidad con ese nombre.",
      };
    }
    console.error("Error al actualizar modalidad:", error);
    return { success: false, error: "No se pudo actualizar la modalidad" };
  }
}

export async function deleteModalidad(id: string) {
  try {
    const modalidad = await db.modalidad.findUnique({
      where: { id },
      include: {
        _count: {
          select: { records: true },
        },
      },
    });

    if (!modalidad) {
      return { success: false, error: "La modalidad no existe" };
    }

    if (modalidad._count.records > 0) {
      return {
        success: false,
        error: `No se puede eliminar: la modalidad tiene ${modalidad._count.records} record(s) de luchador(es) asociado(s).`,
      };
    }

    await db.modalidad.delete({
      where: { id },
    });

    revalidatePath("/dashboard/modalidades");
    revalidatePath("/dashboard/luchadores");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar modalidad:", error);
    return { success: false, error: "No se pudo eliminar la modalidad" };
  }
}
