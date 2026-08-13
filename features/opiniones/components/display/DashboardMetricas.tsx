"use client";

import { StarDisplay } from "../shared/StarRating";
import { CATEGORIA_LABELS } from "../../constants";
import type { MetricasGenerales, NPSResultados } from "../../types";
import { TrendingUp, Smartphone, Award } from "lucide-react";

interface DashboardMetricasProps {
  metricas: MetricasGenerales;
  npsResultados?: NPSResultados;
}

export function DashboardMetricas({
  metricas,
  npsResultados,
}: DashboardMetricasProps) {
  const {
    promedioGeneral,
    totalOpiniones,
    distribucionGeneral,
    metricas: categorias,
  } = metricas;

  return (
    <section
      id="metricas-generales"
      aria-labelledby="metricas-heading"
      className="space-y-8"
    >
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className="flex flex-col items-center sm:items-start">
          <span className="text-7xl font-black text-yellow-400 leading-none">
            {promedioGeneral > 0 ? promedioGeneral.toFixed(1) : "—"}
          </span>
          <span className="text-sm text-muted-foreground mt-1">
            de 5 estrellas
          </span>
        </div>

        <div className="flex-1 space-y-3 w-full max-w-xs sm:max-w-none">
          {[5, 4, 3, 2, 1].map((estrella) => {
            const entry = distribucionGeneral.find(
              (d) => d.estrellas === estrella,
            );
            const porcentaje = entry?.porcentaje ?? 0;
            const cantidad = entry?.cantidad ?? 0;
            return (
              <div key={estrella} className="flex items-center gap-2 text-sm">
                <span className="w-4 text-right text-muted-foreground">
                  {estrella}
                </span>
                <span className="text-yellow-400 text-xs">★</span>
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all duration-700"
                    style={{ width: `${porcentaje}%` }}
                    role="progressbar"
                    aria-valuenow={porcentaje}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${estrella} estrellas: ${porcentaje}%`}
                  />
                </div>
                <span className="w-8 text-right text-muted-foreground text-xs">
                  {cantidad}
                </span>
              </div>
            );
          })}
        </div>

        <div className="text-center sm:text-right shrink-0">
          <p className="text-3xl font-bold">{totalOpiniones}</p>
          <p className="text-sm text-muted-foreground">opiniones públicas</p>
        </div>
      </div>

      {npsResultados && npsResultados.totalRespuestas > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-yellow-400/20 text-yellow-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-yellow-400">
                {npsResultados.npsScore > 0
                  ? `+${npsResultados.npsScore}`
                  : npsResultados.npsScore}
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                Net Promoter Score (NPS)
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-500/20 text-green-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-green-400">
                {npsResultados.promedioRetencion.toFixed(1)} / 5.0
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                Intención de Retorno
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-blue-400">
                {npsResultados.promedioSatisfaccionWeb.toFixed(1)} / 5.0
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                Experiencia Digital Web
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 id="metricas-heading" className="text-lg font-semibold mb-4">
          Valoración por aspecto
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categorias.map((metrica) => {
            const catInfo = CATEGORIA_LABELS[metrica.categoria] ?? {
              label: metrica.categoria,
              emoji: "⭐",
              descripcion: "",
            };

            return (
              <div
                key={metrica.categoria}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 space-y-3 hover:border-yellow-400/30 transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{catInfo.emoji}</span>
                  <h3 className="font-medium text-sm leading-tight">
                    {catInfo.label}
                  </h3>
                </div>

                <StarDisplay value={metrica.promedio} total={metrica.total} />

                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map((estrella) => {
                    const entry = metrica.distribucion.find(
                      (d) => d.estrellas === estrella,
                    );
                    const porcentaje = entry?.porcentaje ?? 0;
                    return (
                      <div key={estrella} className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground w-2">
                          {estrella}
                        </span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-yellow-400/70"
                            style={{ width: `${porcentaje}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
