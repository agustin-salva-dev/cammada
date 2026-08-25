"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import {
  ALL_PERMISSIONS,
  DEFAULT_ROLE_PERMISSIONS,
} from "@/constants/permissions";

const MAX_RESULTS_PER_CATEGORY = 5;
const CACHE_TTL_MS = 60 * 1000;

export type SearchResult = {
  id: string;
  label: string;
  description?: string;
  category: "luchadores" | "equipos";
  url: string;
  rawData: unknown;
};

interface CacheEntry {
  timestamp: number;
  data: SearchResult[];
}

const serverSearchCache = new Map<string, CacheEntry>();

function getFromCache(key: string): SearchResult[] | null {
  const entry = serverSearchCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    serverSearchCache.delete(key);
    return null;
  }
  return entry.data;
}

function setInCache(key: string, data: SearchResult[]): void {
  if (serverSearchCache.size > 200) {
    serverSearchCache.clear();
  }
  serverSearchCache.set(key, { timestamp: Date.now(), data });
}

export async function searchEntities(
  query: string,
): Promise<{ success: boolean; data?: SearchResult[]; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autenticado" };
    }

    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      return { success: true, data: [] };
    }

    const userRole = session.user.role ?? "AYUDANTE";
    const cacheKey = `${userRole}:${trimmed.toLowerCase()}`;
    const cached = getFromCache(cacheKey);
    if (cached) {
      return { success: true, data: cached };
    }

    let permisos: readonly string[] = [];
    if (userRole === "SUPERADMIN") {
      permisos = ALL_PERMISSIONS;
    } else if (userRole === "ADMIN") {
      permisos = DEFAULT_ROLE_PERMISSIONS.ADMIN;
    } else {
      const rolConfig = await db.rolConfig.findUnique({
        where: { nombre: userRole },
        select: { permisos: true },
      });
      permisos = rolConfig?.permisos ?? DEFAULT_ROLE_PERMISSIONS.AYUDANTE;
    }

    const results: SearchResult[] = [];

    const [luchadoresRes, equiposRes] = await Promise.all([
      permisos.includes("luchadores:ver")
        ? db.luchador
            .findMany({
              where: {
                OR: [
                  { nombre: { contains: trimmed, mode: "insensitive" } },
                  { apellido: { contains: trimmed, mode: "insensitive" } },
                  { apodo: { contains: trimmed, mode: "insensitive" } },
                ],
              },
              select: {
                id: true,
                nombre: true,
                apellido: true,
                apodo: true,
                edad: true,
                altura: true,
                ultimoPeso: true,
                pais: true,
                ciudad: true,
                createdAt: true,
                esExportado: true,
                linkTapology: true,
                categoria: { select: { id: true, nombre: true } },
                equipo: { select: { id: true, nombre: true } },
                records: {
                  select: {
                    id: true,
                    victorias: true,
                    derrotas: true,
                    empates: true,
                    modalidad: { select: { id: true, nombre: true } },
                  },
                },
              },
              take: MAX_RESULTS_PER_CATEGORY,
            })
            .catch((err) => {
              console.error("Error al buscar luchadores:", err);
              return [];
            })
        : Promise.resolve([]),

      permisos.includes("equipos:ver")
        ? db.equipo
            .findMany({
              where: {
                nombre: { contains: trimmed, mode: "insensitive" },
              },
              select: { id: true, nombre: true, pais: true, ciudad: true },
              take: MAX_RESULTS_PER_CATEGORY,
            })
            .catch((err) => {
              console.error("Error al buscar equipos:", err);
              return [];
            })
        : Promise.resolve([]),
    ]);

    for (const l of luchadoresRes) {
      const apodoStr = l.apodo ? ` "${l.apodo}"` : "";
      results.push({
        id: l.id,
        label: `${l.nombre}${apodoStr} ${l.apellido}`,
        description: [l.categoria?.nombre, l.equipo?.nombre]
          .filter(Boolean)
          .join(" • "),
        category: "luchadores",
        url: `/dashboard/luchadores`,
        rawData: l,
      });
    }

    for (const e of equiposRes) {
      results.push({
        id: e.id,
        label: e.nombre,
        description: [e.ciudad, e.pais].filter(Boolean).join(", "),
        category: "equipos",
        url: `/dashboard/equipos`,
        rawData: e,
      });
    }

    setInCache(cacheKey, results);

    return { success: true, data: results };
  } catch (globalError) {
    console.error("Error global en searchEntities:", globalError);
    return { success: true, data: [] };
  }
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
          apodo: l.apodo || "",
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
