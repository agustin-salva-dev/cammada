"use client";

import { useState, useTransition } from "react";
import { Shield, CheckCircle2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import {
  votarPrediccion,
  cancelarVotoPrediccion,
} from "@/features/predicciones/actions";
import type {
  CombatePrediccionPublico,
  PeleadorPrediccion,
} from "@/features/predicciones/types";
import { TIPO_COMBATE_PREDICCION_LABEL } from "@/features/predicciones/constants";
import type { TipoCombateConPrediccion } from "@/features/predicciones/constants";

const COLORES_AVATAR = [
  "bg-red-500/20 text-red-400 border-red-500/30",
  "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "bg-green-500/20 text-green-400 border-green-500/30",
  "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
];

function getColorAvatar(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return COLORES_AVATAR[Math.abs(hash) % COLORES_AVATAR.length];
}

function AvatarPeleador({ peleador }: { peleador: PeleadorPrediccion }) {
  const iniciales =
    `${peleador.nombre[0] ?? ""}${peleador.apellido[0] ?? ""}`.toUpperCase();
  const colorClass = getColorAvatar(peleador.id);
  return (
    <div
      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border flex items-center justify-center text-lg font-black shrink-0 ${colorClass}`}
    >
      {iniciales}
    </div>
  );
}

function BarraVotos({
  pct1,
  pct2,
  total,
  nombre1,
  nombre2,
}: {
  pct1: number;
  pct2: number;
  total: number;
  nombre1: string;
  nombre2: string;
}) {
  return (
    <div className="space-y-1.5 w-full">
      <div className="flex rounded-full overflow-hidden h-2.5 bg-white/5">
        <div
          className="bg-primary transition-all duration-700 ease-out"
          style={{ width: `${pct1}%` }}
        />
        <div
          className="bg-white/20 transition-all duration-700 ease-out"
          style={{ width: `${pct2}%` }}
        />
      </div>
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>
          <span className="font-semibold text-foreground">{pct1}%</span>{" "}
          {nombre1}
        </span>
        <span className="text-muted-foreground/60">{total} votos</span>
        <span>
          {nombre2}{" "}
          <span className="font-semibold text-foreground">{pct2}%</span>
        </span>
      </div>
    </div>
  );
}

interface CardPrediccionCombateProps {
  combate: CombatePrediccionPublico;
}

export function CardPrediccionCombate({ combate }: CardPrediccionCombateProps) {
  const [miVotoId, setMiVotoId] = useState<string | null>(combate.miVotoId);
  const [votos, setVotos] = useState({
    total: combate.totalVotos,
    pel1: combate.votosPeleador1,
    pel2: combate.votosPeleador2,
    pct1: combate.porcentajePeleador1,
    pct2: combate.porcentajePeleador2,
  });
  const [isPending, startTransition] = useTransition();

  const estaFinalizado =
    combate.estado === "FINALIZADO" || combate.ganadorId !== null;
  const comunidadAcerto =
    estaFinalizado && miVotoId && miVotoId === combate.ganadorId;

  function calcularNuevoPct(total: number, pel1: number, pel2: number) {
    return {
      pct1: total === 0 ? 0 : Math.round((pel1 / total) * 100),
      pct2: total === 0 ? 0 : Math.round((pel2 / total) * 100),
    };
  }

  function handleVotar(peleadorId: string) {
    if (estaFinalizado || isPending) return;

    // Actualización optimista
    let nuevoTotal = votos.total;
    let nuevoPel1 = votos.pel1;
    let nuevoPel2 = votos.pel2;
    const anteriorVotoId = miVotoId;

    if (anteriorVotoId === peleadorId) {
      return;
    }

    if (anteriorVotoId === combate.peleador1.id) nuevoPel1--;
    else if (anteriorVotoId === combate.peleador2.id) nuevoPel2--;

    if (!anteriorVotoId) nuevoTotal++;
    if (peleadorId === combate.peleador1.id) nuevoPel1++;
    else nuevoPel2++;

    const { pct1, pct2 } = calcularNuevoPct(nuevoTotal, nuevoPel1, nuevoPel2);
    setMiVotoId(peleadorId);
    setVotos({
      total: nuevoTotal,
      pel1: nuevoPel1,
      pel2: nuevoPel2,
      pct1,
      pct2,
    });

    startTransition(async () => {
      const res = await votarPrediccion({ combateId: combate.id, peleadorId });
      if (!res.success) {
        setMiVotoId(anteriorVotoId);
        setVotos({
          total: combate.totalVotos,
          pel1: combate.votosPeleador1,
          pel2: combate.votosPeleador2,
          pct1: combate.porcentajePeleador1,
          pct2: combate.porcentajePeleador2,
        });
        toast.error(res.error);
      }
    });
  }

  function handleCancelar() {
    if (isPending || !miVotoId) return;

    const anteriorVotoId = miVotoId;
    const nuevoTotal = votos.total - 1;
    let nuevoPel1 = votos.pel1;
    let nuevoPel2 = votos.pel2;

    if (anteriorVotoId === combate.peleador1.id) nuevoPel1--;
    else nuevoPel2--;

    const { pct1, pct2 } = calcularNuevoPct(nuevoTotal, nuevoPel1, nuevoPel2);
    setMiVotoId(null);
    setVotos({
      total: nuevoTotal,
      pel1: nuevoPel1,
      pel2: nuevoPel2,
      pct1,
      pct2,
    });

    startTransition(async () => {
      const res = await cancelarVotoPrediccion({ combateId: combate.id });
      if (!res.success) {
        setMiVotoId(anteriorVotoId);
        setVotos({
          total: combate.totalVotos,
          pel1: combate.votosPeleador1,
          pel2: combate.votosPeleador2,
          pct1: combate.porcentajePeleador1,
          pct2: combate.porcentajePeleador2,
        });
        toast.error(res.error);
      }
    });
  }

  const tipoCombateLabel = estaFinalizado
    ? "Finalizado"
    : (TIPO_COMBATE_PREDICCION_LABEL[
        combate.tipo as TipoCombateConPrediccion
      ] ?? combate.tipo);

  return (
    <article
      id={`card-prediccion-${combate.id}`}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 sm:p-5 space-y-4 hover:border-white/20 transition-colors"
    >
      <div className="flex flex-wrap items-center gap-2">
        {combate.titulo && (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-2 py-0.5">
            <Shield className="w-2.5 h-2.5" /> Título
          </span>
        )}
        <span className="text-xs text-muted-foreground">
          {tipoCombateLabel}
        </span>
        <span className="text-xs text-muted-foreground/50">·</span>
        <span className="text-xs text-muted-foreground">
          {combate.categoriaPeso.nombre}
        </span>
        {estaFinalizado && (
          <span className="ml-auto text-[10px] font-semibold text-muted-foreground bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
            Finalizado
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        <button
          id={`btn-votar-${combate.id}-p1`}
          onClick={() => handleVotar(combate.peleador1.id)}
          disabled={estaFinalizado || isPending}
          className={`flex-1 flex sm:flex-col items-center gap-3 sm:gap-2 p-3 sm:p-4 rounded-xl border transition-all duration-200 text-left sm:text-center group disabled:cursor-default ${
            miVotoId === combate.peleador1.id
              ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
              : "border-white/10 bg-white/5 hover:border-primary hover:bg-primary/10 disabled:hover:border-white/10 disabled:hover:bg-white/5"
          } ${combate.ganadorId === combate.peleador1.id ? "border-green-500/40 bg-green-500/5" : ""}`}
        >
          <AvatarPeleador peleador={combate.peleador1} />
          <div className="flex-1 sm:flex-none min-w-0">
            <p className="font-bold text-sm sm:text-base truncate">
              {combate.peleador1.nombre} {combate.peleador1.apellido}
            </p>
            {combate.peleador1.apodo && (
              <p className="text-xs text-muted-foreground italic truncate">
                &ldquo;{combate.peleador1.apodo}&rdquo;
              </p>
            )}
            <p className="text-[11px] text-muted-foreground/70 mt-0.5">
              {combate.peleador1.victorias}V-{combate.peleador1.derrotas}D
              {combate.peleador1.empates > 0
                ? `-${combate.peleador1.empates}E`
                : ""}
            </p>
          </div>
          {miVotoId === combate.peleador1.id && (
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 sm:mx-auto" />
          )}
          {combate.ganadorId === combate.peleador1.id && (
            <span className="text-[10px] font-bold text-green-400 bg-green-500/10 rounded-full px-2 py-0.5">
              Ganador
            </span>
          )}
        </button>

        <div className="flex sm:flex-col items-center justify-center gap-1 px-1">
          <div className="h-px sm:h-full sm:w-px w-full bg-white/10 flex-1" />
          <span className="text-xs font-black text-muted-foreground/40 shrink-0">
            VS
          </span>
          <div className="h-px sm:h-full sm:w-px w-full bg-white/10 flex-1" />
        </div>

        <button
          id={`btn-votar-${combate.id}-p2`}
          onClick={() => handleVotar(combate.peleador2.id)}
          disabled={estaFinalizado || isPending}
          className={`flex-1 flex sm:flex-col items-center gap-3 sm:gap-2 p-3 sm:p-4 rounded-xl border transition-all duration-200 text-left sm:text-center group disabled:cursor-default ${
            miVotoId === combate.peleador2.id
              ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
              : "border-white/10 bg-white/5 hover:border-primary hover:bg-primary/10 disabled:hover:border-white/10 disabled:hover:bg-white/5"
          } ${combate.ganadorId === combate.peleador2.id ? "border-green-500/40 bg-green-500/5" : ""}`}
        >
          <AvatarPeleador peleador={combate.peleador2} />
          <div className="flex-1 sm:flex-none min-w-0">
            <p className="font-bold text-sm sm:text-base truncate">
              {combate.peleador2.nombre} {combate.peleador2.apellido}
            </p>
            {combate.peleador2.apodo && (
              <p className="text-xs text-muted-foreground italic truncate">
                &ldquo;{combate.peleador2.apodo}&rdquo;
              </p>
            )}
            <p className="text-[11px] text-muted-foreground/70 mt-0.5">
              {combate.peleador2.victorias}V-{combate.peleador2.derrotas}D
              {combate.peleador2.empates > 0
                ? `-${combate.peleador2.empates}E`
                : ""}
            </p>
          </div>
          {miVotoId === combate.peleador2.id && (
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 sm:mx-auto" />
          )}
          {combate.ganadorId === combate.peleador2.id && (
            <span className="text-[10px] font-bold text-green-400 bg-green-500/10 rounded-full px-2 py-0.5">
              Ganador
            </span>
          )}
        </button>
      </div>

      <BarraVotos
        pct1={votos.pct1}
        pct2={votos.pct2}
        total={votos.total}
        nombre1={combate.peleador1.apellido}
        nombre2={combate.peleador2.apellido}
      />

      <div className="flex items-center justify-between gap-3 min-h-6">
        {isPending ? (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="w-3 h-3 animate-spin" /> Registrando...
          </span>
        ) : miVotoId ? (
          <div className="flex items-center gap-3 w-full">
            <span className="flex items-center gap-1.5 text-xs text-primary font-medium">
              <CheckCircle2 className="w-3 h-3" />
              {comunidadAcerto
                ? "Acertaste ✅"
                : estaFinalizado
                  ? "Votaste"
                  : "Tu voto registrado"}
            </span>
            {!estaFinalizado && (
              <button
                id={`btn-cancelar-voto-${combate.id}`}
                onClick={handleCancelar}
                disabled={isPending}
                className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground hover:text-red-400 transition-colors"
              >
                <X className="w-3 h-3" /> Cancelar voto
              </button>
            )}
          </div>
        ) : !estaFinalizado ? (
          <span className="text-xs text-muted-foreground/60">
            Tocá un peleador para votar
          </span>
        ) : null}
      </div>
    </article>
  );
}
