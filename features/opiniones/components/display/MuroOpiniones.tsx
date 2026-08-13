"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ThumbsUp, MessageSquare, ChevronDown } from "lucide-react";
import { StarDisplay } from "../shared/StarRating";
import { votarSugerencia } from "../../actions";
import { CATEGORIA_LABELS, ROL_LABELS } from "../../constants";
import type { OpinionPublica } from "../../types";

interface MuroOpinionesProps {
  opiniones: OpinionPublica[];
}

type Orden =
  | "reciente"
  | "antigua"
  | "mayor_puntuacion"
  | "menor_puntuacion"
  | "mas_votos";
type FiltroCategoria = "todas" | string;
type FiltroEstrellas = "todas" | string;

const ORDEN_OPTIONS: { value: Orden; label: string }[] = [
  { value: "reciente", label: "Más recientes" },
  { value: "antigua", label: "Más antiguas" },
  { value: "mayor_puntuacion", label: "Mayor puntuación" },
  { value: "menor_puntuacion", label: "Menor puntuación" },
  { value: "mas_votos", label: "Más votadas" },
];

function formatRelativeTime(date: Date): string {
  const d = date instanceof Date ? date : new Date(date);
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "hace un momento";
  if (minutes < 60) return `hace ${minutes} min`;
  if (hours < 24) return `hace ${hours}h`;
  if (days < 30) return `hace ${days} días`;
  return d.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function OpinionCard({
  opinion,
  onVote,
}: {
  opinion: OpinionPublica;
  onVote: (id: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();
  const [localVotos, setLocalVotos] = useState(opinion.conteoVotos);
  const [yaVoto, setYaVoto] = useState(false);

  const catInfo = CATEGORIA_LABELS[opinion.categoria] ?? {
    label: opinion.categoria,
    emoji: "💬",
  };
  const rolLabel =
    ROL_LABELS[opinion.rolParticipante] ?? opinion.rolParticipante;
  const esSugerencia = opinion.tipo === "SUGERENCIA";

  const handleVoto = () => {
    if (yaVoto || isPending) return;
    startTransition(async () => {
      await onVote(opinion.id);
      setLocalVotos((v) => v + 1);
      setYaVoto(true);
    });
  };

  return (
    <article
      className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 space-y-4 hover:border-white/20 transition-colors duration-200"
      aria-label={`Opinión: ${opinion.titulo}`}
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-white/10">
            {catInfo.emoji} {catInfo.label}
          </span>
          {esSugerencia && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-400/20 text-yellow-400">
              💡 Sugerencia
            </span>
          )}
        </div>
        {opinion.estrellas && <StarDisplay value={opinion.estrellas} />}
      </div>

      <div>
        <h3 className="font-semibold text-base">{opinion.titulo}</h3>
        <p className="text-sm text-muted-foreground mt-1.5 whitespace-pre-line leading-relaxed">
          {opinion.descripcion}
        </p>
      </div>

      {opinion.respuesta && (
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
              ✦ Respuesta de la Organización
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            {opinion.respuesta.contenido}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-blue-300">
              {opinion.respuesta.usuario.nombre}
            </span>
            <span>·</span>
            <span className="capitalize">
              {opinion.respuesta.usuario.rol.toLowerCase()}
            </span>
            <span>·</span>
            <time
              dateTime={new Date(opinion.respuesta.createdAt).toISOString()}
            >
              {formatRelativeTime(opinion.respuesta.createdAt)}
            </time>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/80">
            {opinion.nombreUsuario}
          </span>
          <span>·</span>
          <span>{rolLabel}</span>
          <span>·</span>
          <time dateTime={new Date(opinion.createdAt).toISOString()}>
            {formatRelativeTime(opinion.createdAt)}
          </time>
        </div>

        {esSugerencia && (
          <button
            type="button"
            onClick={handleVoto}
            disabled={yaVoto || isPending}
            aria-label={
              yaVoto
                ? "Ya votaste esta sugerencia"
                : `Votar sugerencia (${localVotos} votos)`
            }
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
              yaVoto
                ? "bg-yellow-400/20 text-yellow-400 cursor-default"
                : isPending
                  ? "bg-white/10 text-muted-foreground opacity-60 cursor-not-allowed"
                  : "bg-white/10 hover:bg-yellow-400/10 hover:text-yellow-400 cursor-pointer",
            ].join(" ")}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{localVotos}</span>
          </button>
        )}
      </div>
    </article>
  );
}

export function MuroOpiniones({ opiniones }: MuroOpinionesProps) {
  const [orden, setOrden] = useState<Orden>("reciente");
  const [filtroCategoria, setFiltroCategoria] =
    useState<FiltroCategoria>("todas");
  const [filtroEstrellas, setFiltroEstrellas] =
    useState<FiltroEstrellas>("todas");
  const [mostrarTodas, setMostrarTodas] = useState(false);

  const handleVote = async (id: string) => {
    const result = await votarSugerencia({ opinionId: id });
    if (!result.success) toast.error(result.error);
  };

  let filtradas = opiniones.filter((o) => {
    if (filtroCategoria !== "todas" && o.categoria !== filtroCategoria)
      return false;
    if (filtroEstrellas !== "todas" && String(o.estrellas) !== filtroEstrellas)
      return false;
    return true;
  });

  filtradas = [...filtradas].sort((a, b) => {
    switch (orden) {
      case "reciente":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "antigua":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "mayor_puntuacion":
        return (b.estrellas ?? 0) - (a.estrellas ?? 0);
      case "menor_puntuacion":
        return (a.estrellas ?? 0) - (b.estrellas ?? 0);
      case "mas_votos":
        return b.conteoVotos - a.conteoVotos;
      default:
        return 0;
    }
  });

  const PAGE_SIZE = 6;
  const visibles = mostrarTodas ? filtradas : filtradas.slice(0, PAGE_SIZE);

  return (
    <section
      id="muro-opiniones"
      aria-labelledby="muro-heading"
      className="space-y-6"
    >
      <div>
        <h2 id="muro-heading" className="text-lg font-semibold">
          Opiniones de la comunidad
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {filtradas.length} opinión{filtradas.length !== 1 ? "es" : ""}{" "}
          publicada{filtradas.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          id="filtro-orden"
          value={orden}
          onChange={(e) => setOrden(e.target.value as Orden)}
          className="rounded-lg border border-border text-foreground px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
          aria-label="Ordenar por"
        >
          {ORDEN_OPTIONS.map((o) => (
            <option
              key={o.value}
              value={o.value}
              className="bg-popover text-popover-foreground"
            >
              {o.label}
            </option>
          ))}
        </select>

        <select
          id="filtro-categoria"
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="rounded-lg border border-border text-foreground px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
          aria-label="Filtrar por categoría"
        >
          <option value="todas" className="bg-popover text-popover-foreground">
            Todas las categorías
          </option>
          {Object.entries(CATEGORIA_LABELS).map(([key, val]) => (
            <option
              key={key}
              value={key}
              className="bg-popover text-popover-foreground"
            >
              {val.emoji} {val.label}
            </option>
          ))}
        </select>

        <select
          id="filtro-estrellas"
          value={filtroEstrellas}
          onChange={(e) => setFiltroEstrellas(e.target.value)}
          className="rounded-lg border border-border text-foreground px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
          aria-label="Filtrar por estrellas"
        >
          <option value="todas" className="bg-popover text-popover-foreground">
            Todas las puntuaciones
          </option>
          {[5, 4, 3, 2, 1].map((s) => (
            <option
              key={s}
              value={String(s)}
              className="bg-popover text-popover-foreground"
            >
              {"★".repeat(s)} {s} estrella{s !== 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      {filtradas.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-10 text-center">
          <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-sm">
            {opiniones.length === 0
              ? "Todavía no hay opiniones publicadas. ¡Sé el primero!"
              : "No hay opiniones que coincidan con los filtros seleccionados."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {visibles.map((opinion) => (
              <OpinionCard
                key={opinion.id}
                opinion={opinion}
                onVote={handleVote}
              />
            ))}
          </div>

          {filtradas.length > PAGE_SIZE && !mostrarTodas && (
            <button
              type="button"
              id="btn-ver-mas-opiniones"
              onClick={() => setMostrarTodas(true)}
              className="flex items-center gap-2 mx-auto px-5 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-sm transition-colors cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
              Ver {filtradas.length - PAGE_SIZE} opiniones más
            </button>
          )}
        </>
      )}
    </section>
  );
}
