"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { CheckCircle2, TrendingUp, Sparkles, Smartphone } from "lucide-react";
import { StarRating } from "../shared/StarRating";
import { submitNPS } from "../../actions";
import { NPS_LABELS, RETENCION_LABELS } from "../../constants";

export function IndiceImpactoNPS() {
  const [npsScore, setNpsScore] = useState<number | null>(null);
  const [intencionRetorno, setIntencionRetorno] = useState<number>(0);
  const [satisfaccionWeb, setSatisfaccionWeb] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const todoCompleto =
    npsScore !== null && intencionRetorno > 0 && satisfaccionWeb > 0;

  const handleSubmit = () => {
    if (!todoCompleto) {
      toast.error("Por favor completa los 3 indicadores antes de enviar.");
      return;
    }

    startTransition(async () => {
      const result = await submitNPS({
        nps: npsScore,
        intencionRetorno,
        satisfaccionWeb,
      });

      if (result.success) {
        setSubmitted(true);
        toast.success(
          "¡Gracias! Tus respuestas ayudan a medir el éxito del evento.",
        );
      } else {
        toast.error(result.error);
      }
    });
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 flex flex-col items-center gap-3 text-center animate-in fade-in duration-300">
        <CheckCircle2 className="w-12 h-12 text-green-400" />
        <p className="text-xl font-bold text-green-300">
          ¡Gracias por tu valoración!
        </p>
        <p className="text-sm text-muted-foreground max-w-md">
          Tus respuestas son muy valiosas para seguir mejorando y preparar un
          evento aún mejor en cada edición.
        </p>
      </div>
    );
  }

  return (
    <section
      id="indice-nps"
      aria-labelledby="nps-heading"
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 sm:p-8 space-y-8"
    >
      <div>
        <div className="flex items-center gap-2 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" /> Tu Valoración
        </div>
        <h2 id="nps-heading" className="text-xl font-bold tracking-tight">
          ¿Cómo evaluás tu experiencia en el evento?
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Respondé 3 breves preguntas para contarnos tu nivel de satisfacción y
          si nos acompañás en la próxima edición.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-yellow-400/20 text-yellow-400 text-xs font-bold shrink-0 mt-0.5">
              1
            </span>
            <div>
              <p className="font-semibold text-sm sm:text-base">
                ¿Qué tan probable es que recomiendes este evento a otros atletas
                o compañeros?
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Recomendación general
              </p>
            </div>
          </div>

          <div className="pl-0 sm:pl-10 space-y-2">
            <div className="grid grid-cols-11 gap-1 sm:gap-1.5">
              {Array.from({ length: 11 }, (_, i) => i).map((score) => {
                const isSelected = npsScore === score;
                return (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setNpsScore(score)}
                    className={[
                      "py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all duration-150 border",
                      isSelected
                        ? "bg-yellow-400 text-black border-yellow-400 shadow-md shadow-yellow-400/20 scale-105"
                        : "border-white/10 bg-white/5 hover:bg-white/15 hover:border-yellow-400/30 text-foreground",
                    ].join(" ")}
                  >
                    {score}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between text-[11px] text-muted-foreground px-1">
              <span>0 = Jamás</span>
              <span className="text-center">
                {npsScore !== null
                  ? NPS_LABELS[npsScore]
                  : "Seleccioná un valor"}
              </span>
              <span>10 = Definitivamente</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3">
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-yellow-400/20 text-yellow-400 text-xs font-bold shrink-0 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
            <div>
              <p className="font-semibold text-sm sm:text-base">
                ¿Tenés pensado competir o asistir a la próxima edición de
                Cammada?
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Asistencia a futuros eventos
              </p>
            </div>
          </div>

          <div className="pl-0 sm:pl-10 space-y-2">
            <StarRating
              value={intencionRetorno}
              onChange={setIntencionRetorno}
              size="lg"
            />
            {intencionRetorno > 0 && (
              <p className="text-xs text-yellow-400 font-medium">
                {RETENCION_LABELS[intencionRetorno]}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3">
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-yellow-400/20 text-yellow-400 text-xs font-bold shrink-0 mt-0.5">
              <Smartphone className="w-3.5 h-3.5" />
            </span>
            <div>
              <p className="font-semibold text-sm sm:text-base">
                ¿Qué tan fácil y ágil te pareció la web para ver tus llaves,
                resultados y cronograma?
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Experiencia de uso en la web
              </p>
            </div>
          </div>

          <div className="pl-0 sm:pl-10 space-y-2">
            <StarRating
              value={satisfaccionWeb}
              onChange={setSatisfaccionWeb}
              size="lg"
              showLabel
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        id="btn-enviar-nps"
        onClick={handleSubmit}
        disabled={!todoCompleto || isPending}
        className={[
          "w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-lg",
          todoCompleto && !isPending
            ? "bg-yellow-400 text-black hover:bg-yellow-300 hover:shadow-yellow-400/25 cursor-pointer"
            : "bg-white/10 text-muted-foreground cursor-not-allowed opacity-60",
        ].join(" ")}
      >
        {isPending ? "Enviando..." : "Enviar mis respuestas"}
      </button>
    </section>
  );
}
