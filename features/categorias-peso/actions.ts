"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { categoriaPesoSchema } from "./zod";
import type { Prisma } from "@prisma/client";
import type { ActionResult } from "@/lib/types";

type CategoriaPesoConCount = Prisma.CategoriaPesoGetPayload<{
  include: { _count: { select: { luchadores: true } } };
}>;

type CategoriaPesoSelect = {
  id: string;
  nombre: string;
  limiteInferior: number | null;
  limiteSuperior: number | null;
};

export async function getCategoriasPeso(): Promise<ActionResult<CategoriaPesoConCount[]>> {
  try {
    const categorias = await db.categoriaPeso.findMany({
      include: {
        _count: {
          select: { luchadores: true },
        },
      },
      orderBy: {
        orden: "asc",
      },
    });
    return { success: true, data: categorias };
  } catch (error) {
    console.error("Error al obtener categorías de peso:", error);
    return {
      success: false,
      error: "No se pudieron cargar las categorías de peso",
    };
  }
}

export async function getCategoriasPesoSelect(): Promise<ActionResult<CategoriaPesoSelect[]>> {
  try {
    const categorias = await db.categoriaPeso.findMany({
      select: {
        id: true,
        nombre: true,
        limiteInferior: true,
        limiteSuperior: true,
      },
      orderBy: {
        orden: "asc",
      },
    });
    return { success: true, data: categorias };
  } catch (error) {
    console.error("Error al obtener categorías para select:", error);
    return {
      success: false,
      error: "No se pudieron cargar las categorías",
    };
  }
}

export async function createCategoriaPeso(rawInput: unknown) {
  try {
    const validation = categoriaPesoSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: "Datos inválidos",
        details: validation.error.format(),
      };
    }

    const { nombre, orden, limiteInferior, limiteSuperior } = validation.data;

    const result = await db.$transaction(async (tx) => {
      const categoria = await tx.categoriaPeso.create({
        data: {
          nombre,
          orden,
          limiteInferior: limiteInferior ?? null,
          limiteSuperior: limiteSuperior ?? null,
        },
      });

      await ajustarRangosContiguos(tx);

      return categoria;
    });

    revalidatePath("/dashboard/categorias-peso");
    revalidatePath("/dashboard/luchadores");
    return { success: true, data: result };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return {
        success: false,
        error: "Ya existe una categoría con ese nombre.",
      };
    }
    console.error("Error al crear categoría de peso:", error);
    return { success: false, error: "No se pudo crear la categoría de peso" };
  }
}

export async function updateCategoriaPeso(id: string, rawInput: unknown) {
  try {
    const validation = categoriaPesoSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: "Datos inválidos",
        details: validation.error.format(),
      };
    }

    const { nombre, orden, limiteInferior, limiteSuperior } = validation.data;

    const result = await db.$transaction(async (tx) => {
      const categoria = await tx.categoriaPeso.update({
        where: { id },
        data: {
          nombre,
          orden,
          limiteInferior: limiteInferior ?? null,
          limiteSuperior: limiteSuperior ?? null,
        },
      });

      await ajustarRangosContiguos(tx);

      return categoria;
    });

    revalidatePath("/dashboard/categorias-peso");
    revalidatePath("/dashboard/luchadores");
    return { success: true, data: result };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return {
        success: false,
        error: "Ya existe una categoría con ese nombre.",
      };
    }
    console.error("Error al actualizar categoría de peso:", error);
    return {
      success: false,
      error: "No se pudo actualizar la categoría de peso",
    };
  }
}

export async function deleteCategoriaPeso(id: string) {
  try {
    const categoria = await db.categoriaPeso.findUnique({
      where: { id },
      include: {
        _count: {
          select: { luchadores: true },
        },
      },
    });

    if (!categoria) {
      return { success: false, error: "La categoría no existe" };
    }

    if (categoria._count.luchadores > 0) {
      return {
        success: false,
        error: `No se puede eliminar: la categoría tiene ${categoria._count.luchadores} luchador(es) asociado(s).`,
      };
    }

    await db.$transaction(async (tx) => {
      await tx.categoriaPeso.delete({
        where: { id },
      });

      // Reajustar rangos contiguos tras eliminar
      await ajustarRangosContiguos(tx);
    });

    revalidatePath("/dashboard/categorias-peso");
    revalidatePath("/dashboard/luchadores");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar categoría de peso:", error);
    return {
      success: false,
      error: "No se pudo eliminar la categoría de peso",
    };
  }
}

async function ajustarRangosContiguos(
  tx: Parameters<Parameters<typeof db.$transaction>[0]>[0],
) {
  const todas = await tx.categoriaPeso.findMany({
    orderBy: { orden: "asc" },
  });

  for (let i = 1; i < todas.length; i++) {
    const anterior = todas[i - 1];
    const actual = todas[i];

    if (
      anterior.limiteSuperior !== null &&
      actual.limiteInferior !== anterior.limiteSuperior
    ) {
      await tx.categoriaPeso.update({
        where: { id: actual.id },
        data: { limiteInferior: anterior.limiteSuperior },
      });
      todas[i] = { ...actual, limiteInferior: anterior.limiteSuperior };
    }
  }
}
