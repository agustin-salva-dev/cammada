"use server";

import { db } from "@/lib/db";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import type { ActionResult } from "@/lib/types";
import { requirePermission, toAuthError } from "@/lib/action-guard";
import { PERMISSIONS } from "@/constants/permissions";
import { Prisma } from "@prisma/client";

export type LuchadorExportadoDetalle = Prisma.LuchadorGetPayload<{
  include: {
    categoria: true;
    equipo: true;
    records: {
      include: {
        modalidad: true;
      };
    };
  };
}>;

const getCachedExportadosPublicos = unstable_cache(
  async () => {
    return db.luchador.findMany({
      where: {
        esExportado: true,
      },
      include: {
        categoria: true,
        equipo: true,
        records: {
          include: {
            modalidad: true,
          },
        },
      },
      orderBy: [{ ordenExportado: "asc" }, { updatedAt: "desc" }],
    });
  },
  ["exportados-publicos-list"],
  { revalidate: false, tags: ["exportados"] },
);

export async function getExportadosPublicos(): Promise<
  ActionResult<LuchadorExportadoDetalle[]>
> {
  try {
    const exportados = await getCachedExportadosPublicos();
    return { success: true, data: exportados };
  } catch (error) {
    console.error("Error al obtener talento exportado público:", error);
    return { success: false, error: "No se pudo cargar el talento exportado." };
  }
}

export async function getExportadosDashboard(): Promise<
  ActionResult<LuchadorExportadoDetalle[]>
> {
  try {
    await requirePermission(PERMISSIONS.EXPORTADOS.VER);

    const exportados = await db.luchador.findMany({
      where: {
        esExportado: true,
      },
      include: {
        categoria: true,
        equipo: true,
        records: {
          include: {
            modalidad: true,
          },
        },
      },
      orderBy: [{ ordenExportado: "asc" }, { updatedAt: "desc" }],
    });

    return { success: true, data: exportados };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    console.error("Error al obtener luchadores exportados:", error);
    return {
      success: false,
      error: "No se pudieron cargar los peleadores exportados.",
    };
  }
}

export async function addExportadosBatch(
  ids: string[],
): Promise<ActionResult<number>> {
  try {
    await requirePermission(PERMISSIONS.EXPORTADOS.GESTIONAR);

    if (!ids || ids.length === 0) {
      return { success: false, error: "Seleccioná al menos un luchador." };
    }

    const updated = await db.luchador.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        esExportado: true,
      },
    });

    revalidateTag("exportados", "max");
    revalidateTag("luchadores", "max");
    revalidatePath("/dashboard/exportados");
    revalidatePath("/talento-exportado");

    return { success: true, data: updated.count };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    console.error("Error al agregar exportados en lote:", error);
    return {
      success: false,
      error: "No se pudieron agregar los peleadores seleccionados.",
    };
  }
}

export async function removeExportadosBatch(
  ids: string[],
): Promise<ActionResult<number>> {
  try {
    await requirePermission(PERMISSIONS.EXPORTADOS.GESTIONAR);

    if (!ids || ids.length === 0) {
      return { success: false, error: "Seleccioná al menos un luchador." };
    }

    const updated = await db.luchador.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        esExportado: false,
      },
    });

    revalidateTag("exportados", "max");
    revalidateTag("luchadores", "max");
    revalidatePath("/dashboard/exportados");
    revalidatePath("/talento-exportado");

    return { success: true, data: updated.count };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    console.error("Error al remover exportados en lote:", error);
    return {
      success: false,
      error: "No se pudieron remover los peleadores seleccionados.",
    };
  }
}

export async function updateOrdenExportados(
  orderedIds: string[],
): Promise<ActionResult<void>> {
  try {
    await requirePermission(PERMISSIONS.EXPORTADOS.GESTIONAR);

    if (!orderedIds || orderedIds.length === 0) {
      return { success: true, data: undefined };
    }

    await db.$transaction(
      orderedIds.map((id, index) =>
        db.luchador.update({
          where: { id },
          data: { ordenExportado: index },
        }),
      ),
    );

    revalidateTag("exportados", "max");
    revalidatePath("/dashboard/exportados");
    revalidatePath("/talento-exportado");

    return { success: true, data: undefined };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    console.error("Error al reordenar luchadores exportados:", error);
    return {
      success: false,
      error: "No se pudo actualizar el orden de los peleadores.",
    };
  }
}
