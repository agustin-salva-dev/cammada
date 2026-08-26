import { NextRequest, NextResponse } from "next/server";
import { getPrediccionesEvento } from "@/features/predicciones/queries";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ eventoId: string }> }
) {
  const { eventoId } = await params;

  if (!eventoId) {
    return NextResponse.json({ error: "eventoId requerido" }, { status: 400 });
  }

  const evento = await getPrediccionesEvento(eventoId);

  if (!evento) {
    return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
  }

  return NextResponse.json(evento);
}
