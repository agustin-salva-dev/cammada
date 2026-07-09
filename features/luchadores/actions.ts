"use server";

import { db } from "@/lib/db";
import { luchadorSchema } from "./zod";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import type { ActionResult } from "@/lib/types";

type LuchadorConDetalle = Prisma.LuchadorGetPayload<{
  include: {
    categoria: true;
    equipo: true;
    records: { include: { modalidad: true } };
  };
}>;

type LuchadorSelect = {
  id: string;
  nombre: string;
  apellido: string;
  apodo: string;
  categoriaId: string;
  equipo: { nombre: string } | null;
};

export async function getLuchadores(): Promise<ActionResult<LuchadorConDetalle[]>> {
  try {
    const luchadores = await db.luchador.findMany({
      include: {
        categoria: true,
        equipo: true,
        records: {
          include: {
            modalidad: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: luchadores };
  } catch (error) {
    console.error("Error al obtener luchadores:", error);
    return { success: false, error: "No se pudieron cargar los luchadores" };
  }
}

export async function getLuchadoresSelect(): Promise<ActionResult<LuchadorSelect[]>> {
  try {
    const luchadores = await db.luchador.findMany({
      select: {
        id: true,
        nombre: true,
        apellido: true,
        apodo: true,
        categoriaId: true,
        equipo: { select: { nombre: true } },
      },
      orderBy: [{ apellido: "asc" }, { nombre: "asc" }],
    });
    return { success: true, data: luchadores };
  } catch (error) {
    console.error("Error al obtener luchadores para select:", error);
    return { success: false, error: "No se pudieron cargar los luchadores" };
  }
}

export async function createLuchador(rawInput: unknown) {
  try {
    const validation = luchadorSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: "Datos inválidos",
        details: validation.error.format(),
      };
    }

    const validatedData = validation.data;
    const nombre = validatedData.nombre || "Sin nombre";
    const apodo = validatedData.apodo || "Sin apodo";
    const apellido = validatedData.apellido || "Sin apellido";
    const pais = validatedData.pais || "Desconocido";
    const ciudad = validatedData.ciudad || "Desconocida";
    const equipo = validatedData.equipo || "Sin equipo";
    const categoria = validatedData.categoria;
    const { edad, altura, ultimoPeso, records } = validatedData;

    const result = await db.$transaction(async (tx) => {
      const dbEquipo = await tx.equipo.upsert({
        where: { nombre: equipo },
        update: {},
        create: { nombre: equipo },
      });

      if (!categoria) {
        throw new Error("La categoría de peso es obligatoria");
      }

      const luchador = await tx.luchador.create({
        data: {
          nombre,
          apodo,
          apellido,
          edad,
          altura,
          ultimoPeso,
          pais,
          ciudad,
          equipoId: dbEquipo.id,
          categoriaId: categoria,
        },
      });

      if (records && records.length > 0) {
        for (const record of records) {
          const modalidadNombre = record.modalidad || "Sin modalidad";
          const dbModalidad = await tx.modalidad.upsert({
            where: { nombre: modalidadNombre },
            update: {},
            create: { nombre: modalidadNombre },
          });

          await tx.recordLuchador.create({
            data: {
              luchadorId: luchador.id,
              modalidadId: dbModalidad.id,
              victorias: record.victorias ?? 0,
              derrotas: record.derrotas ?? 0,
              empates: record.empates ?? 0,
            },
          });
        }
      }

      return luchador;
    });

    revalidatePath("/dashboard/luchadores");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error al crear luchador:", error);
    return { success: false, error: "No se pudo crear el luchador" };
  }
}

export async function updateLuchador(id: string, rawInput: unknown) {
  try {
    const validation = luchadorSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: "Datos inválidos",
        details: validation.error.format(),
      };
    }

    const validatedData = validation.data;
    const nombre = validatedData.nombre || "Sin nombre";
    const apodo = validatedData.apodo || "Sin apodo";
    const apellido = validatedData.apellido || "Sin apellido";
    const pais = validatedData.pais || "Desconocido";
    const ciudad = validatedData.ciudad || "Desconocida";
    const equipo = validatedData.equipo || "Sin equipo";
    const categoria = validatedData.categoria;
    const { edad, altura, ultimoPeso, records } = validatedData;

    const result = await db.$transaction(async (tx) => {
      const dbEquipo = await tx.equipo.upsert({
        where: { nombre: equipo },
        update: {},
        create: { nombre: equipo },
      });

      if (!categoria) {
        throw new Error("La categoría de peso es obligatoria");
      }

      const luchador = await tx.luchador.update({
        where: { id },
        data: {
          nombre,
          apodo,
          apellido,
          edad,
          altura,
          ultimoPeso,
          pais,
          ciudad,
          equipoId: dbEquipo.id,
          categoriaId: categoria,
        },
      });

      await tx.recordLuchador.deleteMany({
        where: { luchadorId: id },
      });

      if (records && records.length > 0) {
        for (const record of records) {
          const modalidadNombre = record.modalidad || "Sin modalidad";
          const dbModalidad = await tx.modalidad.upsert({
            where: { nombre: modalidadNombre },
            update: {},
            create: { nombre: modalidadNombre },
          });

          await tx.recordLuchador.create({
            data: {
              luchadorId: luchador.id,
              modalidadId: dbModalidad.id,
              victorias: record.victorias ?? 0,
              derrotas: record.derrotas ?? 0,
              empates: record.empates ?? 0,
            },
          });
        }
      }

      return luchador;
    });

    revalidatePath("/dashboard/luchadores");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error al editar luchador:", error);
    return { success: false, error: "No se pudo editar el luchador" };
  }
}

export async function deleteLuchador(id: string) {
  try {
    await db.luchador.delete({
      where: { id },
    });
    revalidatePath("/dashboard/luchadores");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar luchador:", error);
    return { success: false, error: "No se pudo eliminar el luchador" };
  }
}

export async function fetchTapologyFighter(slugOrUrl: string) {
  try {
    if (!slugOrUrl) {
      return {
        success: false,
        error: "Debe ingresar una URL o ID de Tapology",
      };
    }

    let slug = slugOrUrl.split("?")[0].replace(/\/+$/, "");
    if (slug.includes("/fighters/")) {
      const parts = slug.split("/fighters/");
      slug = parts[parts.length - 1];
    } else if (slug.includes("/")) {
      const parts = slug.split("/");
      slug = parts[parts.length - 1];
    }
    slug = slug.trim();

    const apiKey =
      process.env.RAPIDAPI_KEY ||
      "ce57bab601msh58a4c73a4723b40p16e3f7jsn00afa3838bfd";
    const apiHost =
      process.env.RAPIDAPI_HOST || "unofficial-tapology-api.p.rapidapi.com";

    const url = `https://${apiHost}/api/v2/fighters/${slug}?fields=firstname%2Clastname%2Cnickname%2Cage%2Cdate_of_birth%2Cweight_class%2Cfull_record%2Cwins%2Closses%2Cdraws%2Cno_contest%2Ctko_ko%2Csubmission%2Cdecision%2Clast_weigh_in`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": apiHost,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error:
            "Luchador no encontrado en Tapology. Verifique el ID o la URL.",
        };
      }
      return {
        success: false,
        error: `Error de la API de Tapology (${response.status})`,
      };
    }

    const json = await response.json();
    const data = json.data;

    if (!data) {
      return {
        success: false,
        error: "No se encontraron datos para este luchador.",
      };
    }

    let pesoKg: number | undefined;
    if (data.last_weigh_in) {
      const lbsMatch = data.last_weigh_in.match(/(\d+(?:\.\d+)?)\s*lbs/i);
      if (lbsMatch) {
        const lbs = parseFloat(lbsMatch[1]);
        if (!isNaN(lbs)) {
          pesoKg = Math.round(lbs * 0.45359237 * 10) / 10;
        }
      }
    }

    const TAPOLOGY_WEIGHT_MAP: Record<string, string> = {
      strawweight: "Paja",
      flyweight: "Mosca",
      bantamweight: "Gallo",
      featherweight: "Pluma",
      lightweight: "Ligero",
      welterweight: "Wélter",
      middleweight: "Mediano",
      "light heavyweight": "Semipesado",
      lightheavyweight: "Semipesado",
      heavyweight: "Pesado",
      "super heavyweight": "Superpesado",
      superheavyweight: "Superpesado",
    };

    let categoriaId = "";
    if (data.weight_class) {
      const weightClassLower = data.weight_class.toLowerCase();
      let nombreEsp = "";
      for (const [key, value] of Object.entries(TAPOLOGY_WEIGHT_MAP)) {
        if (weightClassLower.includes(key)) {
          nombreEsp = value;
          break;
        }
      }

      if (nombreEsp) {
        const dbCat = await db.categoriaPeso.findFirst({
          where: { nombre: { equals: nombreEsp, mode: "insensitive" } },
        });
        if (dbCat) {
          categoriaId = dbCat.id;
        }
      }
    }

    const initialRecord = {
      id: crypto.randomUUID(),
      modalidad: "" as const,
      victorias: Number(data.wins) || 0,
      derrotas: Number(data.losses) || 0,
      empates: Number(data.draws) || 0,
    };

    const mappedFighter = {
      nombre: data.firstname || "",
      apellido: data.lastname || "",
      apodo: data.nickname || "",
      edad: data.age ? Number(data.age) : undefined,
      ultimoPeso: pesoKg,
      categoria: categoriaId,
      pais: "Argentina",
      ciudad: "Salta",
      equipo: "",
      records: [initialRecord],
    };

    return { success: true, data: mappedFighter };
  } catch (error) {
    console.error("Error al obtener luchador de Tapology:", error);
    return {
      success: false,
      error: "Ocurrió un error inesperado al consultar Tapology.",
    };
  }
}
