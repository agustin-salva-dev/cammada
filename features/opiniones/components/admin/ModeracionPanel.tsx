"use client";

import { useState, useTransition, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  MessageSquarePlus,
  Clock,
  Filter,
  Trash2,
  CheckSquare,
  Square,
} from "lucide-react";
import {
  moderarOpinion,
  eliminarOpinion,
  eliminarOpiniones,
} from "../../actions";
import { RespuestaModal } from "./RespuestaModal";
import { StarDisplay } from "../shared/StarRating";
import { ModalConfirmacion } from "@/components/ui/ModalConfirmacion";
import {
  CATEGORIA_LABELS,
  ROL_LABELS,
  ESTADO_OPINION_LABELS,
} from "../../constants";
import type { OpinionModeracion, EstadisticasModeracion } from "../../types";

interface ModeracionPanelProps {
  opiniones: OpinionModeracion[];
  estadisticas: EstadisticasModeracion;
}

type FiltroEstado = "TODAS" | "PENDIENTE" | "APROBADA" | "RECHAZADA";

function formatDate(date: Date): string {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ModeracionPanel({
  opiniones: initialOpiniones,
}: ModeracionPanelProps) {
  const [opiniones, setOpiniones] = useState(initialOpiniones);
  const [filtro, setFiltro] = useState<FiltroEstado>("PENDIENTE");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [respuestaModal, setRespuestaModal] = useState<{
    opinionId: string;
    titulo: string;
    respuestaExistente?: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const estadisticas = useMemo(() => {
    const pendientes = opiniones.filter((o) => o.estado === "PENDIENTE").length;
    const aprobadas = opiniones.filter((o) => o.estado === "APROBADA").length;
    const rechazadas = opiniones.filter((o) => o.estado === "RECHAZADA").length;
    return {
      total: opiniones.length,
      pendientes,
      aprobadas,
      rechazadas,
    };
  }, [opiniones]);

  const filtradas = useMemo(() => {
    return filtro === "TODAS"
      ? opiniones
      : opiniones.filter((o) => o.estado === filtro);
  }, [opiniones, filtro]);

  const isAllFilteredSelected = useMemo(() => {
    if (filtradas.length === 0) return false;
    return filtradas.every((o) => selectedIds.has(o.id));
  }, [filtradas, selectedIds]);

  const handleSelectAllFiltered = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (isAllFilteredSelected) {
        filtradas.forEach((o) => next.delete(o.id));
      } else {
        filtradas.forEach((o) => next.add(o.id));
      }
      return next;
    });
  }, [filtradas, isAllFilteredSelected]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleModerar = useCallback(
    (opinionId: string, estado: "APROBADA" | "RECHAZADA") => {
      startTransition(async () => {
        const result = await moderarOpinion({ opinionId, estado });
        if (result.success) {
          setOpiniones((prev) =>
            prev.map((o) => (o.id === opinionId ? { ...o, estado } : o)),
          );
          toast.success(
            `Opinión ${estado === "APROBADA" ? "aprobada" : "rechazada"} correctamente.`,
          );
        } else {
          toast.error(result.error);
        }
      });
    },
    [],
  );

  const handleEliminarSingle = useCallback(async (opinionId: string) => {
    setDeletingId(opinionId);
    startTransition(async () => {
      const result = await eliminarOpinion({ opinionId });
      setDeletingId(null);
      if (result.success) {
        setOpiniones((prev) => prev.filter((o) => o.id !== opinionId));
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(opinionId);
          return next;
        });
        toast.success("Opinión eliminada de la base de datos.");
      } else {
        toast.error(result.error);
      }
    });
  }, []);

  const handleEliminarSeleccionadas = useCallback(async () => {
    const selectedArray = Array.from(selectedIds);
    if (selectedArray.length === 0) return;

    setIsBulkDeleting(true);
    startTransition(async () => {
      const result = await eliminarOpiniones({ opinionIds: selectedArray });
      setIsBulkDeleting(false);
      if (result.success) {
        const count = result.data.count;
        setOpiniones((prev) => prev.filter((o) => !selectedIds.has(o.id)));
        setSelectedIds(new Set());
        toast.success(
          `${count} opinión(es) eliminada(s) correctamente de la base de datos.`,
        );
      } else {
        toast.error(result.error);
      }
    });
  }, [selectedIds]);

  const handleRespuestaSuccess = useCallback(
    (nuevoContenido: string) => {
      if (!respuestaModal) return;
      const { opinionId } = respuestaModal;
      setOpiniones((prev) =>
        prev.map((o) => {
          if (o.id !== opinionId) return o;
          return {
            ...o,
            respuesta: {
              id: o.respuesta?.id ?? "temp-id",
              contenido: nuevoContenido,
              createdAt: o.respuesta?.createdAt ?? new Date(),
              usuario: o.respuesta?.usuario ?? {
                nombre: "Administrador",
                rol: "ADMIN",
              },
            },
          };
        }),
      );
    },
    [respuestaModal],
  );

  const FILTROS: { value: FiltroEstado; label: string; count: number }[] = [
    { value: "PENDIENTE", label: "Pendientes", count: estadisticas.pendientes },
    { value: "APROBADA", label: "Aprobadas", count: estadisticas.aprobadas },
    { value: "RECHAZADA", label: "Rechazadas", count: estadisticas.rechazadas },
    { value: "TODAS", label: "Todas", count: estadisticas.total },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Pendientes"
          count={estadisticas.pendientes}
          color="yellow"
        />
        <StatCard
          label="Aprobadas"
          count={estadisticas.aprobadas}
          color="green"
        />
        <StatCard
          label="Rechazadas"
          count={estadisticas.rechazadas}
          color="red"
        />
        <StatCard label="Total" count={estadisticas.total} color="blue" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" /> Filtrar:
          </span>
          {FILTROS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFiltro(f.value)}
              className={[
                "px-3 py-1 rounded-lg text-sm font-medium transition-colors border cursor-pointer",
                filtro === f.value
                  ? "bg-yellow-400/20 border-yellow-400/40 text-yellow-400"
                  : "border-white/10 bg-white/5 hover:bg-white/10",
              ].join(" ")}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSelectAllFiltered}
            disabled={filtradas.length === 0}
            className="flex items-center gap-2 text-sm font-medium hover:text-yellow-400 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isAllFilteredSelected ? (
              <CheckSquare className="w-5 h-5 text-yellow-400" />
            ) : (
              <Square className="w-5 h-5 text-muted-foreground" />
            )}
            <span>
              Seleccionar todas{" "}
              {filtro !== "TODAS" && (
                <span className="text-xs text-muted-foreground">
                  ({filtro.toLowerCase()})
                </span>
              )}
            </span>
          </button>
          {selectedIds.size > 0 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-400/20 text-yellow-400 font-semibold">
              {selectedIds.size} seleccionada(s)
            </span>
          )}
        </div>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 transition-colors cursor-pointer"
            >
              Deseleccionar
            </button>

            <ModalConfirmacion
              title="¿Eliminar opiniones seleccionadas?"
              description={`¿Estás seguro de eliminar ${selectedIds.size} opinión(es) seleccionada(s) permanentemente de la base de datos? Esta acción no se puede deshacer.`}
              confirmText={`Eliminar (${selectedIds.size})`}
              cancelText="Cancelar"
              variant="destructive"
              isLoading={isPending || isBulkDeleting}
              onConfirm={handleEliminarSeleccionadas}
              trigger={
                <button
                  type="button"
                  disabled={isPending || isBulkDeleting}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Eliminar seleccionadas ({selectedIds.size})
                </button>
              }
            />
          </div>
        )}
      </div>

      {filtradas.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-10 text-center">
          <Clock className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-sm">
            {filtro === "PENDIENTE"
              ? "No hay opiniones pendientes de revisión. ¡Todo al día!"
              : "No hay opiniones en este estado."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtradas.map((opinion) => {
            const isSelected = selectedIds.has(opinion.id);
            const isDeleting = deletingId === opinion.id;
            const catInfo = CATEGORIA_LABELS[opinion.categoria] ?? {
              emoji: "💬",
              label: opinion.categoria,
            };
            const estadoInfo = ESTADO_OPINION_LABELS[opinion.estado] ?? {
              label: opinion.estado,
              color: "gray",
            };

            return (
              <article
                key={opinion.id}
                className={[
                  "rounded-xl border p-5 space-y-3 transition-all duration-200",
                  isSelected
                    ? "border-yellow-400/50 bg-yellow-400/5 shadow-md"
                    : "border-white/10 bg-white/5 hover:border-white/20",
                  isDeleting ? "opacity-40 pointer-events-none" : "",
                ].join(" ")}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => toggleSelect(opinion.id)}
                      className="text-muted-foreground hover:text-yellow-400 transition-colors cursor-pointer"
                      aria-label={`Seleccionar opinión ${opinion.titulo}`}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>

                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">
                      {catInfo.emoji} {catInfo.label}
                    </span>
                    {opinion.tipo === "SUGERENCIA" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400">
                        💡 Sugerencia
                      </span>
                    )}
                    <span
                      className={[
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        opinion.estado === "PENDIENTE"
                          ? "bg-yellow-400/20 text-yellow-400"
                          : opinion.estado === "APROBADA"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400",
                      ].join(" ")}
                    >
                      {estadoInfo.label}
                    </span>
                  </div>
                  {opinion.estrellas && (
                    <StarDisplay value={opinion.estrellas} />
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-sm">{opinion.titulo}</h3>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line line-clamp-4">
                    {opinion.descripcion}
                  </p>
                </div>

                {opinion.respuesta && (
                  <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3 text-xs space-y-1">
                    <p className="font-semibold text-blue-400">
                      Respuesta oficial:
                    </p>
                    <p className="text-sm">{opinion.respuesta.contenido}</p>
                    <p className="text-muted-foreground">
                      Por{" "}
                      <span className="text-blue-300">
                        {opinion.respuesta.usuario.nombre}
                      </span>{" "}
                      · {opinion.respuesta.usuario.rol.toLowerCase()} ·{" "}
                      {formatDate(opinion.respuesta.createdAt)}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground/80">
                      {opinion.nombreUsuario}
                    </span>{" "}
                    · {ROL_LABELS[opinion.rolParticipante]} ·{" "}
                    {formatDate(opinion.createdAt)}
                    {opinion.conteoVotos > 0 && (
                      <span className="ml-2 text-yellow-400">
                        👍 {opinion.conteoVotos}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap items-center">
                    {(opinion.estado === "APROBADA" || opinion.respuesta) && (
                      <button
                        type="button"
                        onClick={() =>
                          setRespuestaModal({
                            opinionId: opinion.id,
                            titulo: opinion.titulo,
                            respuestaExistente: opinion.respuesta?.contenido,
                          })
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20 cursor-pointer"
                      >
                        <MessageSquarePlus className="w-3.5 h-3.5" />
                        {opinion.respuesta ? "Editar respuesta" : "Responder"}
                      </button>
                    )}

                    {opinion.estado !== "APROBADA" && (
                      <button
                        type="button"
                        onClick={() => handleModerar(opinion.id, "APROBADA")}
                        disabled={isPending}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors border border-green-500/20 disabled:opacity-50 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Aprobar
                      </button>
                    )}

                    {opinion.estado !== "RECHAZADA" && (
                      <button
                        type="button"
                        onClick={() => handleModerar(opinion.id, "RECHAZADA")}
                        disabled={isPending}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20 disabled:opacity-50 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Rechazar
                      </button>
                    )}

                    <ModalConfirmacion
                      title="¿Eliminar opinión?"
                      description={`¿Estás seguro de eliminar la opinión "${opinion.titulo}" permanentemente de la base de datos? Esta acción no se puede deshacer.`}
                      confirmText="Eliminar"
                      cancelText="Cancelar"
                      variant="destructive"
                      isLoading={isPending || isDeleting}
                      onConfirm={() => handleEliminarSingle(opinion.id)}
                      trigger={
                        <button
                          type="button"
                          disabled={isPending || isDeleting}
                          title="Eliminar opinión permanentemente de la base de datos"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/25 transition-colors border border-red-500/20 disabled:opacity-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Eliminar
                        </button>
                      }
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {respuestaModal && (
        <RespuestaModal
          opinionId={respuestaModal.opinionId}
          opinionTitulo={respuestaModal.titulo}
          respuestaExistente={respuestaModal.respuestaExistente}
          onClose={() => setRespuestaModal(null)}
          onSuccess={handleRespuestaSuccess}
        />
      )}
    </div>
  );
}

function StatCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    yellow: "text-yellow-400 border-yellow-400/20 bg-yellow-400/5",
    green: "text-green-400 border-green-400/20 bg-green-400/5",
    red: "text-red-400 border-red-400/20 bg-red-400/5",
    blue: "text-blue-400 border-blue-400/20 bg-blue-400/5",
  };

  return (
    <div
      className={`rounded-xl border p-4 text-center ${colorMap[color] ?? ""}`}
    >
      <p className={`text-2xl font-bold ${colorMap[color]?.split(" ")[0]}`}>
        {count}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
