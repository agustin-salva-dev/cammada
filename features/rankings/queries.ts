import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

export type UltimaFightPublica = {
  eventoNumero: number;
  eventoFecha: Date;
};

export type RankingItemPublico = {
  id: string;
  posicion: number;
  luchador: {
    id: string;
    nombre: string;
    apellido: string;
    apodo: string;
    equipo: { nombre: string };
    ultimaFight: UltimaFightPublica | null;
  };
};

export type CampeonPublico = {
  id: string;
  nombre: string;
  apellido: string;
  apodo: string;
  equipo: { nombre: string };
  ultimaFight: UltimaFightPublica | null;
};

export type CategoriaPesoPublica = {
  id: string;
  nombre: string;
  limiteSuperior: number | null;
};

export type RankingPublico = {
  id: string;
  categoriaPesoId: string | null;
  categoriaPeso: CategoriaPesoPublica | null;
  modalidad: { id: string; nombre: string };
  campeon: CampeonPublico | null;
  items: RankingItemPublico[];
};

async function getUltimaFight(
  luchadorId: string,
): Promise<UltimaFightPublica | null> {
  const combate = await db.combate.findFirst({
    where: {
      OR: [{ peleador1Id: luchadorId }, { peleador2Id: luchadorId }],
      estado: "FINALIZADO",
    },
    orderBy: { evento: { fecha: "desc" } },
    select: {
      evento: {
        select: {
          numero: true,
          fecha: true,
        },
      },
    },
  });

  if (!combate) return null;

  return {
    eventoNumero: combate.evento.numero,
    eventoFecha: combate.evento.fecha,
  };
}

async function fetchPublicRankings(): Promise<RankingPublico[]> {
  const rankings = await db.ranking.findMany({
    include: {
      categoriaPeso: {
        select: {
          id: true,
          nombre: true,
          limiteSuperior: true,
        },
      },
      modalidad: { select: { id: true, nombre: true } },
      campeon: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          apodo: true,
          equipo: { select: { nombre: true } },
        },
      },
      items: {
        orderBy: { posicion: "asc" },
        include: {
          luchador: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              apodo: true,
              equipo: { select: { nombre: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const enriched: RankingPublico[] = await Promise.all(
    rankings.map(async (ranking) => {
      let campeon: CampeonPublico | null = null;
      if (ranking.campeon) {
        const ultimaFight = await getUltimaFight(ranking.campeon.id);
        campeon = { ...ranking.campeon, ultimaFight };
      }

      const items: RankingItemPublico[] = await Promise.all(
        ranking.items.map(async (item) => {
          const ultimaFight = await getUltimaFight(item.luchador.id);
          return {
            id: item.id,
            posicion: item.posicion,
            luchador: {
              ...item.luchador,
              ultimaFight,
            },
          };
        }),
      );

      return {
        id: ranking.id,
        categoriaPesoId: ranking.categoriaPesoId,
        categoriaPeso: ranking.categoriaPeso,
        modalidad: ranking.modalidad,
        campeon,
        items,
      };
    }),
  );

  return enriched;
}

const getCachedPublicRankings = unstable_cache(
  fetchPublicRankings,
  ["public-rankings-list"],
  { revalidate: 120, tags: ["rankings"] },
);

export async function getPublicRankings(): Promise<RankingPublico[]> {
  try {
    return await getCachedPublicRankings();
  } catch (error) {
    console.error("Error al obtener rankings públicos:", error);
    return [];
  }
}
