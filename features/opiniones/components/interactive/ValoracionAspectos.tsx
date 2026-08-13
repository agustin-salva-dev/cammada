"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { StarRating } from "../shared/StarRating";
import { submitValoraciones } from "../../actions";
import { CATEGORIA_LABELS } from "../../constants";

const CATEGORIAS_VALORABLES = [
  "WEB_PLATAFORMA",
  "ORGANIZACION",
  "LUGAR_INSTALACIONES",
  "KIT_PREMIACION",
] as const;

type CategoriaKey = (typeof CATEGORIAS_VALORABLES)[number];

export function ValoracionAspectos() {
  const [valoraciones, setValoraciones] = useState<Record<CategoriaKey, number>>(
    {} as Record<CategoriaKey, number>,
  );
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleChange = (cat: CategoriaKey, val: number) => {
    setValoraciones((prev) => ({ ...prev, [cat]: val }));
  };

  const todasValorizadas = CATEGORIAS_VALORABLES.every(
    (cat) => (valoraciones[cat] ?? 0) > 0,
  );

  const handleSubmit = () => {
    if (!todasValorizadas) {
      toast.error("Por favor califica todos los aspectos antes de enviar.");
      return;
    }

    const data = CATEGORIAS_VALORABLES.map((cat) => ({
      categoria: cat,
      estrellas: valoraciones[cat],
    }));

    startTransition(async () => {
      const result = await submitValoraciones(data);
      if (result.success) {
        setSubmitted(true);
        toast.success("¡Gracias! Tus valoraciones fueron enviadas.");
      } else {
        toast.error(result.error);
      }
    });
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 flex flex-col items-center gap-3 text-center">
        <CheckCircle2 className="w-10 h-10 text-green-400" />
        <p className="text-lg font-semibold">¡Valoraciones enviadas!</p>
        <p className="text-sm text-muted-foreground">
          Gracias por ayudarnos a mejorar. Tus valoraciones contribuyen a nuestras estadísticas.
        </p>
      </div>
    );
  }

  return (
    <section
      id="valoracion-aspectos"
      aria-labelledby="valoracion-heading"
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 space-y-6"
    >
      <div>
        <h2 id="valoracion-heading" className="text-lg font-semibold">
          Valorá los aspectos del evento
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Calificá cada área del 1 al 5. Todas son obligatorias.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CATEGORIAS_VALORABLES.map((cat) => {
          const info = CATEGORIA_LABELS[cat];
          return (
            <div
              key={cat}
              className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{info.emoji}</span>
                  <h3 className="font-medium text-sm">{info.label}</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{info.descripcion}</p>
              </div>
              <StarRating
                value={valoraciones[cat] ?? 0}
                onChange={(val) => handleChange(cat, val)}
                size="lg"
                showLabel
              />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        id="btn-enviar-valoraciones"
        onClick={handleSubmit}
        disabled={!todasValorizadas || isPending}
        className={[
          "w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200",
          todasValorizadas && !isPending
            ? "bg-yellow-400 text-black hover:bg-yellow-300 cursor-pointer"
            : "bg-white/10 text-muted-foreground cursor-not-allowed opacity-60",
        ].join(" ")}
      >
        {isPending ? "Enviando..." : "Enviar valoraciones"}
      </button>
    </section>
  );
}
