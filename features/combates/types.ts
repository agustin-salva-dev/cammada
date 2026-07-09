import type { Prisma } from "@prisma/client";

export type CombateConDetalle = Prisma.CombateGetPayload<{
  include: {
    peleador1: { include: { equipo: true; categoria: true } };
    peleador2: { include: { equipo: true; categoria: true } };
    ganador: { select: { id: true; nombre: true; apellido: true; apodo: true } };
    evento: { select: { id: true; numero: true; fecha: true } };
    categoriaPeso: { select: { id: true; nombre: true } };
    modalidad: { select: { id: true; nombre: true } };
  };
}>;
