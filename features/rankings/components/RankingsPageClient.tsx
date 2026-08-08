"use client";

import { useState } from "react";
import { Crown, Star, Trophy, Shield, TrendingUp } from "lucide-react";
import type {
  RankingPublico,
  CategoriaPesoPublica,
} from "@/features/rankings/queries";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getApodo(apodo: string): string | null {
  if (!apodo || apodo.trim() === "" || apodo === "Sin apodo") return null;
  return apodo;
}

function formatNombre(nombre: string, apellido: string, apodo: string): string {
  const nick = getApodo(apodo);
  if (nick) return `${nombre} "${nick}" ${apellido}`;
  return `${nombre} ${apellido}`;
}

function formatCategoria(cat: CategoriaPesoPublica): string {
  if (cat.limiteSuperior !== null) {
    return `${cat.nombre} ${cat.limiteSuperior}kg`;
  }
  return cat.nombre;
}

function formatUltimaFight(
  uf: { eventoNumero: number; eventoFecha: Date } | null,
): string {
  if (!uf) return "Sin peleas registradas";
  return `Fight Session #${uf.eventoNumero}`;
}

// ─── Position badge ───────────────────────────────────────────────────────────

function PositionBadge({ pos }: { pos: number }) {
  if (pos === 1) {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/20 text-xs font-black text-yellow-400 ring-1 ring-yellow-500/40">
        1
      </span>
    );
  }
  if (pos === 2) {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-400/10 text-xs font-black text-slate-300 ring-1 ring-slate-400/30">
        2
      </span>
    );
  }
  if (pos === 3) {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-700/15 text-xs font-black text-amber-500 ring-1 ring-amber-600/30">
        3
      </span>
    );
  }
  return (
    <span className="flex h-7 w-7 items-center justify-center text-xs font-semibold text-muted-foreground">
      {pos}
    </span>
  );
}

interface RankingsPageClientProps {
  rankings: RankingPublico[];
}

export function RankingsPageClient({ rankings }: RankingsPageClientProps) {
  const modalidades = Array.from(
    new Map(rankings.map((r) => [r.modalidad.id, r.modalidad])).values(),
  );

  const [selectedModalidadId, setSelectedModalidadId] = useState<string>(
    modalidades[0]?.id ?? "",
  );

  const rankingsForModalidad = rankings.filter(
    (r) => r.modalidad.id === selectedModalidadId,
  );
  const categoryOptions = rankingsForModalidad.map((r) => ({
    id: r.id,
    label: r.categoriaPeso
      ? formatCategoria(r.categoriaPeso)
      : "Libra por Libra",
    isP4P: !r.categoriaPeso,
  }));

  const [selectedRankingId, setSelectedRankingId] = useState<string>(
    categoryOptions[0]?.id ?? "",
  );

  function handleModalidadChange(modalidadId: string) {
    setSelectedModalidadId(modalidadId);
    const first = rankings.find((r) => r.modalidad.id === modalidadId);
    setSelectedRankingId(first?.id ?? "");
  }

  const selectedRanking =
    rankings.find((r) => r.id === selectedRankingId) ?? null;
  const isP4P = selectedRanking ? !selectedRanking.categoriaPeso : false;

  if (rankings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <Trophy size={52} className="text-primary" />
        <p className="text-muted-foreground text-base sm:text-lg">
          Todavía no hay rankings publicados.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <div className="flex flex-col gap-2">
        <p className="text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Modalidad
        </p>
        <div
          className="flex flex-wrap gap-2 justify-center"
          role="tablist"
          aria-label="Filtrar por modalidad"
        >
          {modalidades.map((mod) => {
            const active = mod.id === selectedModalidadId;
            return (
              <button
                key={mod.id}
                role="tab"
                aria-selected={active}
                onClick={() => handleModalidadChange(mod.id)}
                className={[
                  "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer",
                  "border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                  active
                    ? "bg-primary/15 border-primary/50 text-primary shadow-sm shadow-primary/10"
                    : "bg-white/3 border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground",
                ].join(" ")}
              >
                {mod.nombre}
              </button>
            );
          })}
        </div>
      </div>

      {categoryOptions.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Categoría de Peso
          </p>
          <div
            className="flex flex-wrap gap-2 justify-center"
            role="tablist"
            aria-label="Filtrar por categoría de peso"
          >
            {categoryOptions.map((opt) => {
              const active = opt.id === selectedRankingId;
              return (
                <button
                  key={opt.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedRankingId(opt.id)}
                  className={[
                    "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer",
                    "border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                    opt.isP4P && active
                      ? "bg-yellow-500/15 border-yellow-500/50 text-yellow-400 shadow-sm shadow-yellow-500/10"
                      : opt.isP4P
                        ? "bg-yellow-500/5 border-yellow-500/20 text-yellow-500/70 hover:border-yellow-500/40 hover:text-yellow-400"
                        : active
                          ? "bg-primary/15 border-primary/50 text-primary shadow-sm shadow-primary/10"
                          : "bg-white/3 border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground",
                  ].join(" ")}
                >
                  {opt.isP4P ? (
                    <Star size={13} className="shrink-0" />
                  ) : (
                    <Shield size={13} className="shrink-0" />
                  )}
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="border-t border-border/30" />

      {!selectedRanking ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 rounded-2xl border border-dashed border-white/10 text-center px-4">
          <Trophy size={40} className="text-primary/20" />
          <p className="text-sm text-muted-foreground">
            No hay ranking creado para esta categoría.
          </p>
        </div>
      ) : (
        <RankingView ranking={selectedRanking} isP4P={isP4P} />
      )}
    </div>
  );
}

function RankingView({
  ranking,
  isP4P,
}: {
  ranking: RankingPublico;
  isP4P: boolean;
}) {
  const isEmpty = !ranking.campeon && ranking.items.length === 0;

  const categoryLabel = ranking.categoriaPeso
    ? formatCategoria(ranking.categoriaPeso)
    : "Libra por Libra";

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 rounded-2xl border border-dashed border-white/10 text-center px-4">
        <Trophy size={40} className="text-primary/20" />
        <p className="text-sm text-muted-foreground">
          No hay ranking creado para{" "}
          <span className="text-foreground font-medium">{categoryLabel}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
      {ranking.campeon && (
        <div className="w-full lg:w-72 xl:w-80 shrink-0">
          <ChampionCard
            campeon={ranking.campeon}
            isP4P={isP4P}
            categoryLabel={categoryLabel}
            modalidad={ranking.modalidad.nombre}
          />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <RankingTable items={ranking.items} />
      </div>
    </div>
  );
}

function ChampionCard({
  campeon,
  isP4P,
  categoryLabel,
  modalidad,
}: {
  campeon: RankingPublico["campeon"] & {};
  isP4P: boolean;
  categoryLabel: string;
  modalidad: string;
}) {
  const apodo = getApodo(campeon.apodo);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-yellow-500/30 bg-linear-to-br from-yellow-500/10 via-yellow-500/5 to-transparent p-5 sm:p-6">
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-yellow-400/8 to-transparent" />

      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-500/20 ring-1 ring-yellow-500/40">
          <Crown size={16} className="text-yellow-400" />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-yellow-500/70">
            Campeón
          </p>
          <p className="text-[10px] text-yellow-500/50">
            {categoryLabel} · {modalidad}
          </p>
        </div>
        {isP4P && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold text-yellow-400">
            <Star size={9} />
            P4P
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-xl sm:text-2xl font-heading font-bold leading-tight text-foreground">
          {campeon.nombre}
          <br />
          {apodo && (
            <span className="block text-sm font-normal text-yellow-400/80 italic">
              &ldquo;{apodo}&rdquo;
            </span>
          )}
          {campeon.apellido}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {campeon.equipo.nombre}
        </p>

        {campeon.ultimaFight && (
          <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/8 px-3 py-2">
            <TrendingUp size={12} className="shrink-0 text-primary/70" />
            <p className="text-[10px] text-muted-foreground">
              Última pelea:{" "}
              <span className="text-foreground font-medium">
                {formatUltimaFight(campeon.ultimaFight)}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function RankingTable({
  items,
}: {
  items: RankingPublico["items"];
}) {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 rounded-2xl border border-dashed border-border/40 text-sm text-muted-foreground">
        Sin peleadores en el ranking.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden">
      <div className="grid grid-cols-[2.5rem_1fr_minmax(6rem,auto)_minmax(7rem,auto)] gap-x-4 border-b border-border/40 bg-muted/20 px-4 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 text-center">
          #
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Peleador
        </span>
        <span className="hidden sm:block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Equipo
        </span>
        <span className="hidden md:block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Última Pelea
        </span>
      </div>

      <ol>
        {items.map((item, idx) => {
          const nombreDisplay = formatNombre(
            item.luchador.nombre,
            item.luchador.apellido,
            item.luchador.apodo,
          );
          const isLast = idx === items.length - 1;
          return (
            <li
              key={item.id}
              className={[
                "grid grid-cols-[2.5rem_1fr_minmax(6rem,auto)_minmax(7rem,auto)] gap-x-4 items-center px-4 py-3 transition-colors hover:bg-accent/20",
                !isLast && "border-b border-border/30",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="flex justify-center">
                <PositionBadge pos={item.posicion} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold leading-tight text-foreground">
                  {nombreDisplay}
                </p>
                <p className="sm:hidden text-[10px] text-muted-foreground truncate mt-0.5">
                  {item.luchador.equipo.nombre}
                </p>
              </div>
              <p className="hidden sm:block truncate text-xs text-muted-foreground">
                {item.luchador.equipo.nombre}
              </p>
              <p className="hidden md:block truncate text-xs text-muted-foreground">
                {formatUltimaFight(item.luchador.ultimaFight)}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
