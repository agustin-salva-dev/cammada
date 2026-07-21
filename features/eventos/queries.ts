import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";
import type { Prisma } from "@prisma/client";

const combateListInclude = {
  peleador1: {
    select: {
      id: true,
      nombre: true,
      apellido: true,
      apodo: true,
      equipo: { select: { nombre: true } },
    },
  },
  peleador2: {
    select: {
      id: true,
      nombre: true,
      apellido: true,
      apodo: true,
      equipo: { select: { nombre: true } },
    },
  },
  modalidad: { select: { id: true, nombre: true } },
  categoriaPeso: {
    select: {
      id: true,
      nombre: true,
      limiteInferior: true,
      limiteSuperior: true,
    },
  },
} as const;

const combateDetailInclude = {
  ...combateListInclude,
  ganador: {
    select: { id: true, nombre: true, apellido: true, apodo: true },
  },
} as const;

const eventoListInclude = {
  combates: {
    include: combateListInclude,
    orderBy: { numeroPelea: "asc" as const },
  },
} as const;

const eventoDetailInclude = {
  combates: {
    include: combateDetailInclude,
    orderBy: { numeroPelea: "asc" as const },
  },
} as const;

export type EventoPublico = Prisma.EventoGetPayload<{
  include: typeof eventoListInclude;
}>;

export type EventoPublicoDetalle = Prisma.EventoGetPayload<{
  include: typeof eventoDetailInclude;
}>;

export type CombatePublico = EventoPublico["combates"][number];
export type CombatePublicoDetalle = EventoPublicoDetalle["combates"][number];

const getCachedPublicEventos = unstable_cache(
  async () => {
    return db.evento.findMany({
      orderBy: { numero: "desc" },
      include: eventoListInclude,
    });
  },
  ["public-eventos-list"],
  { revalidate: 60, tags: ["eventos"] },
);

const getCachedPublicEventoDetail = unstable_cache(
  async (idOrNumero: string) => {
    const asNumber = Number(idOrNumero);
    if (!Number.isNaN(asNumber) && Number.isInteger(asNumber)) {
      return db.evento.findUnique({
        where: { numero: asNumber },
        include: eventoDetailInclude,
      });
    }
    return db.evento.findUnique({
      where: { id: idOrNumero },
      include: eventoDetailInclude,
    });
  },
  ["public-evento-detail"],
  { revalidate: 60, tags: ["eventos"] },
);

export async function getPublicEventos(): Promise<EventoPublico[]> {
  try {
    return await getCachedPublicEventos();
  } catch (error) {
    console.error("Error al obtener eventos públicos:", error);
    return [];
  }
}

export async function getPublicEventoDetail(
  idOrNumero: string,
): Promise<EventoPublicoDetalle | null> {
  try {
    return await getCachedPublicEventoDetail(idOrNumero);
  } catch (error) {
    console.error("Error al obtener detalle de evento público:", error);
    return null;
  }
}
