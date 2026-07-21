"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Medal } from "lucide-react";
import type { CombatePublicoDetalle } from "@/features/eventos/queries";
import { toCombateDetalleData } from "../../utils/eventHelpers";
import { FighterName } from "./FighterName";

const ModalDetalleCombate = dynamic(
  () =>
    import("@/features/combates/components/ModalDetalleCombate").then(
      (mod) => mod.ModalDetalleCombate,
    ),
  { ssr: false },
);

interface CombateRowProps {
  combate: CombatePublicoDetalle;
  eventoNumero: number;
}

export const CombateRow = React.memo(function CombateRow({
  combate,
  eventoNumero,
}: CombateRowProps) {
  const isFinished = combate.estado === "FINALIZADO" || !!combate.ganadorId;
  const isP1Winner = isFinished && combate.ganadorId === combate.peleador1.id;
  const isP2Winner = isFinished && combate.ganadorId === combate.peleador2.id;
  const detalleData = toCombateDetalleData(combate, eventoNumero);

  return (
    <ModalDetalleCombate
      combate={detalleData}
      trigger={
        <div
          role="button"
          tabIndex={0}
          className="group/row relative flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 hover:border-primary/50 backdrop-blur-md transition-all duration-300 overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 p-3 sm:p-0"
        >
          <div className="flex items-center justify-between sm:justify-center px-2 sm:px-3 sm:py-4 sm:min-w-11 sm:border-r pb-2 sm:pb-0 border-b sm:border-b-0 border-white/5">
            <span className="text-xs font-bold text-primary font-heading">
              #{combate.numeroPelea}
            </span>
            <div className="flex sm:hidden items-center gap-1.5 flex-wrap justify-end">
              {combate.titulo && (
                <Medal size={13} className="text-yellow-400" />
              )}
              <span className="text-[9px] text-muted-foreground bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-full">
                {combate.modalidad.nombre}
              </span>
              <span className="text-[9px] text-muted-foreground bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-full">
                {combate.categoriaPeso.nombre}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center flex-1 min-w-0 py-1 sm:py-3 gap-2 sm:gap-0">
            <div
              className={`flex flex-col items-center sm:items-end justify-center flex-1 w-full sm:w-auto px-2 sm:px-4 text-center sm:text-right min-w-0 ${
                isFinished && !isP1Winner ? "opacity-50" : ""
              }`}
            >
              <FighterName
                luchador={combate.peleador1}
                className="truncate max-w-full"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-full">
                {combate.peleador1.equipo?.nombre ?? ""}
              </span>
              {isFinished && (
                <span
                  className={`text-[9px] font-black mt-1 px-1.5 py-0.5 rounded-sm ${
                    isP1Winner
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-destructive/20 text-destructive"
                  }`}
                >
                  {isP1Winner ? "GANADOR" : "DERROTA"}
                </span>
              )}
            </div>

            <div className="flex items-center justify-center px-2 py-0.5 sm:py-3 shrink-0 gap-1 my-1 sm:my-0">
              <span className="text-[10px] font-bold bg-primary py-0.5 px-2 rounded-lg text-primary-foreground">
                vs
              </span>
              <span className="hidden sm:inline">
                {combate.titulo && (
                  <Medal size={13} className="text-yellow-400 ml-1" />
                )}
              </span>
            </div>

            <div
              className={`flex flex-col items-center sm:items-start justify-center flex-1 w-full sm:w-auto px-2 sm:px-4 text-center sm:text-left min-w-0 ${
                isFinished && !isP2Winner ? "opacity-50" : ""
              }`}
            >
              <FighterName
                luchador={combate.peleador2}
                className="truncate max-w-full"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-full">
                {combate.peleador2.equipo?.nombre ?? ""}
              </span>
              {isFinished && (
                <span
                  className={`text-[9px] font-black mt-1 px-1.5 py-0.5 rounded-sm ${
                    isP2Winner
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-destructive/20 text-destructive"
                  }`}
                >
                  {isP2Winner ? "GANADOR" : "DERROTA"}
                </span>
              )}
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end justify-center px-3 py-3 gap-1 shrink-0 border-l border-white/5 min-w-30">
            <span className="text-[9px] text-muted-foreground bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-full whitespace-nowrap truncate max-w-32.5">
              {combate.modalidad.nombre}
            </span>
            <span className="text-[9px] text-muted-foreground bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-full whitespace-nowrap truncate max-w-32.5">
              {combate.categoriaPeso.nombre}
            </span>
            {isFinished && combate.viaVictoria && (
              <span className="text-[9px] text-amber-400/80 whitespace-nowrap truncate max-w-32.5">
                {combate.viaVictoria}
              </span>
            )}
          </div>
        </div>
      }
    />
  );
});
