"use server";

import { db } from "@/lib/db";
import { luchadorSchema } from "./zod";
import { revalidatePath } from "next/cache";

export async function getLuchadores() {
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

export async function createLuchador(rawInput: unknown) {
  try {
    const validation = luchadorSchema.safeParse(rawInput);
    if (!validation.success) {
      return { success: false, error: "Datos inválidos", details: validation.error.format() };
    }

    const validatedData = validation.data;
    const nombre = validatedData.nombre || "Sin nombre";
    const apodo = validatedData.apodo || "Sin apodo";
    const apellido = validatedData.apellido || "Sin apellido";
    const pais = validatedData.pais || "Desconocido";
    const ciudad = validatedData.ciudad || "Desconocida";
    const equipo = validatedData.equipo || "Sin equipo";
    const categoria = validatedData.categoria || "Sin categoría";
    const { edad, altura, ultimoPeso, records } = validatedData;

    const result = await db.$transaction(async (tx) => {
      // 1. Obtener o crear Equipo
      const dbEquipo = await tx.equipo.upsert({
        where: { nombre: equipo },
        update: {},
        create: { nombre: equipo },
      });

      // 2. Obtener o crear Categoría de Peso
      const dbCategoria = await tx.categoriaPeso.upsert({
        where: { nombre: categoria },
        update: {},
        create: { nombre: categoria },
      });

      // 3. Crear Luchador
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
          categoriaId: dbCategoria.id,
        },
      });

      // 4. Crear los registros de modalidad
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
      return { success: false, error: "Datos inválidos", details: validation.error.format() };
    }

    const validatedData = validation.data;
    const nombre = validatedData.nombre || "Sin nombre";
    const apodo = validatedData.apodo || "Sin apodo";
    const apellido = validatedData.apellido || "Sin apellido";
    const pais = validatedData.pais || "Desconocido";
    const ciudad = validatedData.ciudad || "Desconocida";
    const equipo = validatedData.equipo || "Sin equipo";
    const categoria = validatedData.categoria || "Sin categoría";
    const { edad, altura, ultimoPeso, records } = validatedData;

    const result = await db.$transaction(async (tx) => {
      // 1. Obtener o crear Equipo
      const dbEquipo = await tx.equipo.upsert({
        where: { nombre: equipo },
        update: {},
        create: { nombre: equipo },
      });

      // 2. Obtener o crear Categoría de Peso
      const dbCategoria = await tx.categoriaPeso.upsert({
        where: { nombre: categoria },
        update: {},
        create: { nombre: categoria },
      });

      // 3. Actualizar Luchador
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
          categoriaId: dbCategoria.id,
        },
      });

      // 4. Actualizar Récords (Eliminar antiguos y crear los nuevos)
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
