"use server";

import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/action-guard";
import { Prisma } from "@prisma/client";

interface LuchadorResumen {
  id: string;
  nombre: string;
  apellido: string;
  apodo: string;
  equipo: { id: string; nombre: string };
}

interface CombateDestacado {
  id: string;
  tipo: string;
  titulo: boolean;
  rounds: number;
  duracionRounds: number;
  estado: string;
  modalidad: { nombre: string };
  categoriaPeso: { nombre: string };
  peleador1: LuchadorResumen;
  peleador2: LuchadorResumen;
}

interface CategoriaConConteo {
  nombre: string;
  cantidad: number;
}

interface EquipoConConteo {
  nombre: string;
  cantidad: number;
}

interface PeleadorConPeleas {
  id: string;
  nombre: string;
  apellido: string;
  apodo: string;
  equipo: string;
  totalPeleas: number;
}

export interface EventoDropdownItem {
  id: string;
  numero: number;
  fecha: Date;
  estado: string;
}

export interface DashboardData {
  evento: {
    id: string;
    numero: number;
    fecha: Date;
    horaInicio: string;
    horaFin: string;
    lugarNombre: string;
    calle: string;
    calleNumero: string;
    estado: string;
    totalCombates: number;
    combatesPorTipo: Record<string, number>;
    combatesPorEstado: Record<string, number>;
    peleasDeTitulo: number;
  };
  combatesDestacados: CombateDestacado[];
  topCategorias: CategoriaConConteo[];
  topEquiposEvento: EquipoConConteo[];
  topPeleadoresGlobal: PeleadorConPeleas[];
  topEquiposGlobal: EquipoConConteo[];
  kpisGlobales: {
    totalEventos: number;
    totalLuchadores: number;
    totalEquipos: number;
    totalCombates: number;
  };
}

function contarPorClave<T>(
  items: T[],
  keyFn: (item: T) => string,
): Record<string, number> {
  const conteo: Record<string, number> = {};
  for (const item of items) {
    const key = keyFn(item);
    conteo[key] = (conteo[key] ?? 0) + 1;
  }
  return conteo;
}

function topN(
  record: Record<string, number>,
  n: number,
): { nombre: string; cantidad: number }[] {
  return Object.entries(record)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, n);
}

async function getTopPeleadoresGlobal(
  limit: number,
): Promise<PeleadorConPeleas[]> {
  const rows = await db.$queryRaw<
    Array<{
      id: string;
      nombre: string;
      apellido: string;
      apodo: string;
      equipoNombre: string;
      totalPeleas: number;
    }>
  >(Prisma.sql`
    SELECT
      l.id,
      l.nombre,
      l.apellido,
      l.apodo,
      e.nombre AS "equipoNombre",
      COUNT(c.id)::int AS "totalPeleas"
    FROM "Luchador" l
    JOIN "Equipo" e ON l."equipoId" = e.id
    JOIN "Combate" c ON (c."peleador1Id" = l.id OR c."peleador2Id" = l.id)
    GROUP BY l.id, l.nombre, l.apellido, l.apodo, e.nombre
    ORDER BY "totalPeleas" DESC
    LIMIT ${limit}
  `);

  return rows.map((r) => ({
    id: r.id,
    nombre: r.nombre,
    apellido: r.apellido,
    apodo: r.apodo,
    equipo: r.equipoNombre,
    totalPeleas: r.totalPeleas,
  }));
}

async function getTopEquiposGlobal(limit: number): Promise<EquipoConConteo[]> {
  const rows = await db.$queryRaw<
    Array<{ nombre: string; cantidad: number }>
  >(Prisma.sql`
    SELECT
      e.nombre,
      COUNT(DISTINCT l.id)::int AS cantidad
    FROM "Equipo" e
    JOIN "Luchador" l ON l."equipoId" = e.id
    JOIN "Combate" c ON (c."peleador1Id" = l.id OR c."peleador2Id" = l.id)
    GROUP BY e.id, e.nombre
    ORDER BY cantidad DESC
    LIMIT ${limit}
  `);

  return rows.map((r) => ({ nombre: r.nombre, cantidad: r.cantidad }));
}

export async function getDashboardData(
  eventoId?: string,
): Promise<
  { success: true; data: DashboardData } | { success: false; error: string }
> {
  try {
    await getAuthenticatedUser();
    const evento = eventoId
      ? await db.evento.findUnique({
          where: { id: eventoId },
          include: {
            combates: {
              include: {
                peleador1: {
                  include: { equipo: { select: { id: true, nombre: true } } },
                },
                peleador2: {
                  include: { equipo: { select: { id: true, nombre: true } } },
                },
                modalidad: { select: { nombre: true } },
                categoriaPeso: { select: { nombre: true } },
              },
              orderBy: { numeroPelea: "asc" },
            },
          },
        })
      : await db.evento.findFirst({
          orderBy: { numero: "desc" },
          include: {
            combates: {
              include: {
                peleador1: {
                  include: { equipo: { select: { id: true, nombre: true } } },
                },
                peleador2: {
                  include: { equipo: { select: { id: true, nombre: true } } },
                },
                modalidad: { select: { nombre: true } },
                categoriaPeso: { select: { nombre: true } },
              },
              orderBy: { numeroPelea: "asc" },
            },
          },
        });

    if (!evento) {
      return { success: false, error: "No se encontraron eventos" };
    }

    const combates = evento.combates;

    const combatesDestacados: CombateDestacado[] = combates
      .filter((c) => c.tipo === "ESTELAR" || c.tipo === "CO_ESTELAR")
      .map((c) => ({
        id: c.id,
        tipo: c.tipo,
        titulo: c.titulo,
        rounds: c.rounds,
        duracionRounds: c.duracionRounds,
        estado: c.estado,
        modalidad: { nombre: c.modalidad.nombre },
        categoriaPeso: { nombre: c.categoriaPeso.nombre },
        peleador1: {
          id: c.peleador1.id,
          nombre: c.peleador1.nombre,
          apellido: c.peleador1.apellido,
          apodo: c.peleador1.apodo,
          equipo: c.peleador1.equipo,
        },
        peleador2: {
          id: c.peleador2.id,
          nombre: c.peleador2.nombre,
          apellido: c.peleador2.apellido,
          apodo: c.peleador2.apodo,
          equipo: c.peleador2.equipo,
        },
      }));

    const conteoCategorias = contarPorClave(
      combates,
      (c) => c.categoriaPeso.nombre,
    );
    const topCategorias = topN(conteoCategorias, 5);

    const equiposPorEvento: Record<string, Set<string>> = {};
    for (const c of combates) {
      const e1 = c.peleador1.equipo.nombre;
      const e2 = c.peleador2.equipo.nombre;
      if (!equiposPorEvento[e1]) equiposPorEvento[e1] = new Set();
      if (!equiposPorEvento[e2]) equiposPorEvento[e2] = new Set();
      equiposPorEvento[e1].add(c.peleador1.id);
      equiposPorEvento[e2].add(c.peleador2.id);
    }
    const topEquiposEvento = Object.entries(equiposPorEvento)
      .map(([nombre, luchadores]) => ({ nombre, cantidad: luchadores.size }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);

    const combatesPorTipo = contarPorClave(combates, (c) => c.tipo);
    const combatesPorEstado = contarPorClave(combates, (c) => c.estado);
    const peleasDeTitulo = combates.filter((c) => c.titulo).length;
    const [topPeleadoresGlobal, topEquiposGlobal] = await Promise.all([
      getTopPeleadoresGlobal(5),
      getTopEquiposGlobal(5),
    ]);

    const [totalEventos, totalLuchadores, totalEquipos, totalCombates] =
      await Promise.all([
        db.evento.count(),
        db.luchador.count(),
        db.equipo.count(),
        db.combate.count(),
      ]);

    return {
      success: true,
      data: {
        evento: {
          id: evento.id,
          numero: evento.numero,
          fecha: evento.fecha,
          horaInicio: evento.horaInicio,
          horaFin: evento.horaFin,
          lugarNombre: evento.lugarNombre,
          calle: evento.calle,
          calleNumero: evento.calleNumero,
          estado: evento.estado,
          totalCombates: combates.length,
          combatesPorTipo,
          combatesPorEstado,
          peleasDeTitulo,
        },
        combatesDestacados,
        topCategorias,
        topEquiposEvento,
        topPeleadoresGlobal,
        topEquiposGlobal,
        kpisGlobales: {
          totalEventos,
          totalLuchadores,
          totalEquipos,
          totalCombates,
        },
      },
    };
  } catch (error) {
    console.error("Error al obtener datos del dashboard:", error);
    return {
      success: false,
      error: "No se pudieron cargar los datos del dashboard",
    };
  }
}

export async function getEventosDropdownList(): Promise<
  | { success: true; data: EventoDropdownItem[] }
  | { success: false; error: string }
> {
  try {
    await getAuthenticatedUser();
    const eventos = await db.evento.findMany({
      select: {
        id: true,
        numero: true,
        fecha: true,
        estado: true,
      },
      orderBy: { numero: "desc" },
    });
    return { success: true, data: eventos };
  } catch (error) {
    console.error("Error al obtener lista de eventos:", error);
    return { success: false, error: "No se pudieron cargar los eventos" };
  }
}
