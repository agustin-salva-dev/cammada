"use server";

import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import type { ActionResult } from "@/lib/types";
import { Prisma } from "@prisma/client";
import { ESTADOS_EVENTO_PUBLICOS } from "@/features/eventos/zod";

export type LuchadorPublico = Prisma.LuchadorGetPayload<{
  include: {
    categoria: true;
    equipo: true;
    records: { include: { modalidad: true } };
    combatesComoPel1: {
      include: {
        evento: {
          select: {
            id: true;
            numero: true;
            fecha: true;
            lugarNombre: true;
            estado: true;
          };
        };
        peleador1: {
          select: {
            id: true;
            nombre: true;
            apellido: true;
            apodo: true;
          };
        };
        peleador2: {
          select: {
            id: true;
            nombre: true;
            apellido: true;
            apodo: true;
          };
        };
        ganador: {
          select: {
            id: true;
            nombre: true;
            apellido: true;
            apodo: true;
          };
        };
        categoriaPeso: { select: { id: true; nombre: true } };
        modalidad: { select: { id: true; nombre: true } };
      };
    };
    combatesComoPel2: {
      include: {
        evento: {
          select: {
            id: true;
            numero: true;
            fecha: true;
            lugarNombre: true;
            estado: true;
          };
        };
        peleador1: {
          select: {
            id: true;
            nombre: true;
            apellido: true;
            apodo: true;
          };
        };
        peleador2: {
          select: {
            id: true;
            nombre: true;
            apellido: true;
            apodo: true;
          };
        };
        ganador: {
          select: {
            id: true;
            nombre: true;
            apellido: true;
            apodo: true;
          };
        };
        categoriaPeso: { select: { id: true; nombre: true } };
        modalidad: { select: { id: true; nombre: true } };
      };
    };
  };
}>;

const getCachedLuchadoresPublicos = unstable_cache(
  async () =>
    db.luchador.findMany({
      include: {
        categoria: true,
        equipo: true,
        records: { include: { modalidad: true } },
        combatesComoPel1: {
          where: {
            evento: {
              estado: { in: ESTADOS_EVENTO_PUBLICOS },
            },
          },
          include: {
            evento: {
              select: {
                id: true,
                numero: true,
                fecha: true,
                lugarNombre: true,
                estado: true,
              },
            },
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
            ganador: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
                apodo: true,
              },
            },
            categoriaPeso: { select: { id: true, nombre: true } },
            modalidad: { select: { id: true, nombre: true } },
          },
        },
        combatesComoPel2: {
          where: {
            evento: {
              estado: { in: ESTADOS_EVENTO_PUBLICOS },
            },
          },
          include: {
            evento: {
              select: {
                id: true,
                numero: true,
                fecha: true,
                lugarNombre: true,
                estado: true,
              },
            },
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
            ganador: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
                apodo: true,
              },
            },
            categoriaPeso: { select: { id: true, nombre: true } },
            modalidad: { select: { id: true, nombre: true } },
          },
        },
      },
      orderBy: [{ apellido: "asc" }, { nombre: "asc" }],
    }),
  ["luchadores-publicos-list-v2"],
  { revalidate: false, tags: ["luchadores", "eventos"] },
);

export async function getLuchadoresPublicos(): Promise<
  ActionResult<LuchadorPublico[]>
> {
  try {
    const luchadores = await getCachedLuchadoresPublicos();
    return { success: true, data: luchadores };
  } catch (error) {
    console.error("[getLuchadoresPublicos] Error:", error);
    return {
      success: false,
      error: "No se pudieron cargar los luchadores.",
    };
  }
}
