"use server";

import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import type { ActionResult } from "@/lib/types";
import { Prisma } from "@prisma/client";

export type EquipoPublico = Prisma.EquipoGetPayload<{
  include: {
    luchadores: {
      include: {
        categoria: true;
        records: { include: { modalidad: true } };
      };
    };
  };
}>;

const getCachedEquiposPublicos = unstable_cache(
  async () =>
    db.equipo.findMany({
      include: {
        luchadores: {
          include: {
            categoria: true,
            records: { include: { modalidad: true } },
          },
        },
      },
      orderBy: { nombre: "asc" },
    }),
  ["equipos-publicos-list"],
  { revalidate: false, tags: ["equipos", "luchadores"] },
);

export async function getEquiposPublicos(): Promise<
  ActionResult<EquipoPublico[]>
> {
  try {
    const equipos = await getCachedEquiposPublicos();
    return { success: true, data: equipos };
  } catch (error) {
    console.error("[getEquiposPublicos] Error:", error);
    return {
      success: false,
      error: "No se pudieron cargar los equipos.",
    };
  }
}
