"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const MAX_RESULTS_PER_CATEGORY = 5;

export type SearchResult = {
  id: string;
  label: string;
  description?: string;
  category: "luchadores" | "equipos" | "combates" | "eventos";
  url: string;
  rawData: unknown;
};

export async function searchEntities(
  query: string,
): Promise<{ success: boolean; data?: SearchResult[]; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "No autenticado" };
  }

  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return { success: true, data: [] };
  }

  const userRole = session.user.role ?? "AYUDANTE";

  const rolConfig = await db.rolConfig.findUnique({
    where: { nombre: userRole },
    select: { permisos: true },
  });

  const permisos = rolConfig?.permisos ?? [];
  const results: SearchResult[] = [];

  const searches: Promise<void>[] = [];

  if (permisos.includes("luchadores:ver")) {
    searches.push(
      db.luchador
        .findMany({
          where: {
            OR: [
              { nombre: { contains: trimmed, mode: "insensitive" } },
              { apellido: { contains: trimmed, mode: "insensitive" } },
              { apodo: { contains: trimmed, mode: "insensitive" } },
            ],
          },
          include: {
            categoria: { select: { id: true, nombre: true } },
            equipo: { select: { id: true, nombre: true } },
            records: {
              include: {
                modalidad: { select: { id: true, nombre: true } },
              },
            },
          },
          take: MAX_RESULTS_PER_CATEGORY,
        })
        .then((luchadores) => {
          for (const l of luchadores) {
            results.push({
              id: l.id,
              label: `${l.nombre} "${l.apodo}" ${l.apellido}`,
              category: "luchadores",
              url: `/dashboard/luchadores`,
              rawData: JSON.parse(JSON.stringify(l)),
            });
          }
        }),
    );
  }

  if (permisos.includes("equipos:ver")) {
    searches.push(
      db.equipo
        .findMany({
          where: {
            nombre: { contains: trimmed, mode: "insensitive" },
          },
          select: { id: true, nombre: true, pais: true, ciudad: true },
          take: MAX_RESULTS_PER_CATEGORY,
        })
        .then((equipos) => {
          for (const e of equipos) {
            results.push({
              id: e.id,
              label: e.nombre,
              description: e.pais,
              category: "equipos",
              url: `/dashboard/equipos`,
              rawData: e,
            });
          }
        }),
    );
  }

  if (permisos.includes("combates:ver")) {
    searches.push(
      db.combate
        .findMany({
          where: {
            OR: [
              {
                peleador1: {
                  OR: [
                    { nombre: { contains: trimmed, mode: "insensitive" } },
                    { apellido: { contains: trimmed, mode: "insensitive" } },
                    { apodo: { contains: trimmed, mode: "insensitive" } },
                  ],
                },
              },
              {
                peleador2: {
                  OR: [
                    { nombre: { contains: trimmed, mode: "insensitive" } },
                    { apellido: { contains: trimmed, mode: "insensitive" } },
                    { apodo: { contains: trimmed, mode: "insensitive" } },
                  ],
                },
              },
            ],
          },
          include: {
            peleador1: {
              select: { nombre: true, apellido: true },
            },
            peleador2: {
              select: { nombre: true, apellido: true },
            },
            evento: {
              select: { numero: true },
            },
          },
          take: MAX_RESULTS_PER_CATEGORY,
        })
        .then((combates) => {
          for (const c of combates) {
            results.push({
              id: c.id,
              label: `${c.peleador1.nombre} ${c.peleador1.apellido} vs ${c.peleador2.nombre} ${c.peleador2.apellido}`,
              description: `Evento #${c.evento.numero}`,
              category: "combates",
              url: `/dashboard/combates`,
              rawData: JSON.parse(JSON.stringify(c)),
            });
          }
        }),
    );
  }

  if (permisos.includes("eventos:ver")) {
    searches.push(
      db.evento
        .findMany({
          where: {
            OR: [
              { lugarNombre: { contains: trimmed, mode: "insensitive" } },
              ...(isFinite(Number(trimmed))
                ? [{ numero: Number(trimmed) }]
                : []),
            ],
          },
          take: MAX_RESULTS_PER_CATEGORY,
          orderBy: { numero: "desc" },
        })
        .then((eventos) => {
          for (const ev of eventos) {
            const formattedDate = ev.fecha.toISOString().split("T")[0];
            results.push({
              id: ev.id,
              label: `Evento #${ev.numero}`,
              description: ev.lugarNombre,
              category: "eventos",
              url: `/dashboard/eventos`,
              rawData: {
                ...ev,
                fecha: formattedDate,
              },
            });
          }
        }),
    );
  }

  await Promise.all(searches);

  return { success: true, data: results };
}

export async function getModalSelectOptions() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "No autenticado" };
  }

  try {
    const [luchadores, eventos, categorias, modalidades] = await Promise.all([
      db.luchador.findMany({
        select: { id: true, nombre: true, apellido: true, apodo: true },
        orderBy: [{ apellido: "asc" }, { nombre: "asc" }],
      }),
      db.evento.findMany({
        select: { id: true, numero: true },
        orderBy: { numero: "desc" },
      }),
      db.categoriaPeso.findMany({
        select: { id: true, nombre: true },
        orderBy: { orden: "asc" },
      }),
      db.modalidad.findMany({
        select: { id: true, nombre: true },
        orderBy: { nombre: "asc" },
      }),
    ]);

    return {
      success: true,
      data: {
        luchadores: luchadores.map((l) => ({
          id: l.id,
          nombre: l.nombre,
          apellido: l.apellido,
          apodo: l.apodo ?? "Sin apodo",
        })),
        eventos: eventos.map((e) => ({
          id: e.id,
          numero: e.numero,
        })),
        categorias: categorias.map((c) => ({
          id: c.id,
          nombre: c.nombre,
        })),
        modalidades: modalidades.map((m) => ({
          id: m.id,
          nombre: m.nombre,
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching modal select options:", error);
    return {
      success: false,
      error: "No se pudieron obtener las opciones de formulario",
    };
  }
}
