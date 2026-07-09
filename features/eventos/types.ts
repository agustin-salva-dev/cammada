import type { Prisma } from "@prisma/client";

export type EventoConDetalle = Prisma.EventoGetPayload<{
  include: {
    _count: { select: { combates: true } };
    combates: {
      include: {
        peleador1: { select: { id: true; nombre: true; apellido: true; apodo: true } };
        peleador2: { select: { id: true; nombre: true; apellido: true; apodo: true } };
        modalidad: { select: { id: true; nombre: true } };
      };
    };
  };
}>;
