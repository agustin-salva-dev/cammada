"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ThumbsUp, Lightbulb } from "lucide-react";
import { votarSugerencia } from "../../actions";
import { CATEGORIA_LABELS, ROL_LABELS } from "../../constants";
import type { OpinionPublica } from "../../types";

interface TopSugerenciasProps {
  sugerencias: OpinionPublica[];
}

export function TopSugerencias({ sugerencias }: TopSugerenciasProps) {
  if (sugerencias.length === 0) {
    return (
      <section
        id="top-sugerencias"
        aria-labelledby="sugerencias-heading"
        className="space-y-4"
      >
        <h2
          id="sugerencias-heading"
          className="text-xl font-bold flex items-center gap-2"
        >
          <span>💡</span> Sugerencias de la Comunidad
        </h2>
        <div className="rounded-xl border border-white/10 bg-white/5 p-10 text-center">
          <Lightbulb className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-sm">
            Todavía no hay sugerencias publicadas. ¡Dejá la tuya sumando tu
            opinión!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="top-sugerencias"
      aria-labelledby="sugerencias-heading"
      className="space-y-4"
    >
      <div>
        <h2
          id="sugerencias-heading"
          className="text-xl font-bold flex items-center gap-2"
        >
          <span>💡</span> Sugerencias más votadas
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Las mejores propuestas de la comunidad para mejorar la experiencia del
          torneo.
        </p>
      </div>

      <div className="space-y-3">
        {sugerencias.map((s, index) => (
          <SugerenciaItem key={s.id} sugerencia={s} rank={index + 1} />
        ))}
      </div>
    </section>
  );
}

function SugerenciaItem({
  sugerencia,
  rank,
}: {
  sugerencia: OpinionPublica;
  rank: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [localVotos, setLocalVotos] = useState(sugerencia.conteoVotos);
  const [yaVoto, setYaVoto] = useState(false);

  const catInfo = CATEGORIA_LABELS[sugerencia.categoria] ?? {
    label: sugerencia.categoria,
    emoji: "💬",
  };
  const rolLabel =
    ROL_LABELS[sugerencia.rolParticipante] ?? sugerencia.rolParticipante;

  const rankColors: Record<number, string> = {
    1: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    2: "text-gray-300 bg-gray-300/10 border-gray-300/20",
    3: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  };

  const handleVote = () => {
    if (yaVoto || isPending) return;
    startTransition(async () => {
      const result = await votarSugerencia({ opinionId: sugerencia.id });
      if (result.success) {
        setLocalVotos((v) => v + 1);
        setYaVoto(true);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <article className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4 hover:border-white/20 transition-colors">
      <div
        className={[
          "flex items-center justify-center w-8 h-8 rounded-lg border text-sm font-bold shrink-0",
          rankColors[rank] ??
            "text-muted-foreground bg-white/5 border-white/10",
        ].join(" ")}
      >
        {rank}
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">
            {catInfo.emoji} {catInfo.label}
          </span>
        </div>
        <h3 className="font-medium text-sm leading-snug">
          {sugerencia.titulo}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {sugerencia.descripcion}
        </p>
        <p className="text-xs text-muted-foreground">
          Por{" "}
          <span className="text-foreground/70">{sugerencia.nombreUsuario}</span>{" "}
          · {rolLabel}
        </p>
      </div>

      <div className="shrink-0 flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={handleVote}
          disabled={yaVoto || isPending}
          aria-label={yaVoto ? "Ya votaste" : `Votar (${localVotos} votos)`}
          className={[
            "flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
            yaVoto
              ? "bg-yellow-400/20 text-yellow-400 cursor-default"
              : isPending
                ? "opacity-60 cursor-not-allowed bg-white/5"
                : "bg-white/10 hover:bg-yellow-400/10 hover:text-yellow-400 cursor-pointer",
          ].join(" ")}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{localVotos}</span>
        </button>
      </div>
    </article>
  );
}
