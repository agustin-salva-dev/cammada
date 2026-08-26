"use client";

import { useState, useTransition } from "react";
import {
  CalendarDays,
  CheckCheck,
  RotateCcw,
  Sparkles,
  Users,
  Vote,
  XCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { CombatePrediccionRow } from "./CombatePrediccionRow";
import {
  bulkTogglePredicciones,
  resetearVotosEvento,
} from "@/features/predicciones/actions";
import type { EventoPrediccionAdmin } from "@/features/predicciones/types";
import { MAX_PREDICCIONES_CARTELERA_PRINCIPAL } from "@/features/predicciones/constants";

interface PrediccionesAdminClientProps {
  eventos: EventoPrediccionAdmin[];
}

export function PrediccionesAdminClient({
  eventos,
}: PrediccionesAdminClientProps) {
  const [eventoSeleccionadoId, setEventoSeleccionadoId] = useState<string>(
    eventos[0]?.id ?? "",
  );
  const [isPending, startTransition] = useTransition();

  const eventoActual =
    eventos.find((e) => e.id === eventoSeleccionadoId) ?? eventos[0] ?? null;

  if (!eventoActual) {
    return (
      <div className="rounded-xl border border-white/10 p-8 text-center text-muted-foreground">
        No hay eventos creados en el sistema.
      </div>
    );
  }

  const estelares = eventoActual.combates.filter(
    (c) => c.tipo === "ESTELAR" || c.tipo === "CO_ESTELAR",
  );
  const carteleraPrincipal = eventoActual.combates.filter(
    (c) => c.tipo === "CARTELERA_PRINCIPAL",
  );

  const principalActivos = carteleraPrincipal.filter(
    (c) => c.prediccionHabilitada,
  ).length;

  function handleHabilitarRecomendados() {
    const estelaresIds = estelares.map((c) => c.id);
    const principalTop10Ids = carteleraPrincipal
      .slice(0, MAX_PREDICCIONES_CARTELERA_PRINCIPAL)
      .map((c) => c.id);

    const combateIds = [...estelaresIds, ...principalTop10Ids];

    if (combateIds.length === 0) {
      toast.info(
        "No hay combates estelares o de cartelera principal en este evento.",
      );
      return;
    }

    startTransition(async () => {
      const res = await bulkTogglePredicciones({
        eventoId: eventoActual.id,
        combateIds,
        habilitada: true,
      });

      if (!res.success) {
        toast.error(res.error);
      } else {
        toast.success(
          `Predicciones habilitadas para ${res.data.actualizados} combates.`,
        );
      }
    });
  }

  function handleDesactivarTodo() {
    const todosIds = eventoActual.combates.map((c) => c.id);
    if (todosIds.length === 0) return;

    startTransition(async () => {
      const res = await bulkTogglePredicciones({
        eventoId: eventoActual.id,
        combateIds: todosIds,
        habilitada: false,
      });

      if (!res.success) {
        toast.error(res.error);
      } else {
        toast.success("Todas las predicciones del evento fueron desactivadas.");
      }
    });
  }

  function handleResetAll() {
    startTransition(async () => {
      const res = await resetearVotosEvento({
        eventoId: eventoActual.id,
      });

      if (!res.success) {
        toast.error(res.error);
      } else {
        toast.success(
          `Se eliminaron ${res.data.eliminados} votos en todo el evento.`,
        );
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <CalendarDays className="w-5 h-5 text-primary shrink-0" />
          <div>
            <label
              htmlFor="select-evento-predicciones"
              className="text-xs text-muted-foreground block"
            >
              Seleccionar Evento
            </label>
            <div className="w-64 mt-1">
              <NativeSelect
                id="select-evento-predicciones"
                value={eventoSeleccionadoId}
                onChange={(e) => setEventoSeleccionadoId(e.target.value)}
              >
                {eventos.map((e) => (
                  <NativeSelectOption key={e.id} value={e.id}>
                    Fight Session #{e.numero} ({e.estado})
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs">
            <Vote className="w-4 h-4 text-primary" />
            <span>
              <strong className="text-foreground">
                {eventoActual.combatesConPredicciones}
              </strong>{" "}
              habilitados
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs">
            <Users className="w-4 h-4 text-yellow-400" />
            <span>
              <strong className="text-foreground">
                {eventoActual.totalVotosEvento}
              </strong>{" "}
              votos totales
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" /> Acciones rápidas de
            cartelera
          </p>
          <p className="text-xs text-muted-foreground">
            Cartelera Principal: {principalActivos} de{" "}
            {MAX_PREDICCIONES_CARTELERA_PRINCIPAL} máximo
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            id="btn-habilitar-recomendados"
            size="sm"
            onClick={handleHabilitarRecomendados}
            disabled={isPending}
            className="gap-1.5 text-xs bg-primary text-black hover:bg-primary/90"
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCheck className="w-3.5 h-3.5" />
            )}
            Habilitar Estelares & Principal (hasta 10)
          </Button>

          <Button
            id="btn-desactivar-todo"
            size="sm"
            variant="outline"
            onClick={handleDesactivarTodo}
            disabled={isPending}
            className="gap-1.5 text-xs border-white/10 hover:bg-white/10"
          >
            <XCircle className="w-3.5 h-3.5" /> Desactivar todo
          </Button>

          {eventoActual.totalVotosEvento > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  id="btn-reset-votos-evento"
                  size="sm"
                  variant="destructive"
                  disabled={isPending}
                  className="gap-1.5 text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Resetear votos del
                  evento
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    ¿Resetear todos los votos de Fight Session #
                    {eventoActual.numero}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Se eliminarán permanentemente los{" "}
                    <strong>{eventoActual.totalVotosEvento} votos</strong>{" "}
                    registrados en todos los combates de este evento.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleResetAll}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Eliminar todos los votos
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {estelares.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            Estelar & Co-Estelar ({estelares.length})
          </h2>
          <div className="grid grid-cols-1 gap-2.5">
            {estelares.map((combate) => (
              <CombatePrediccionRow key={combate.id} combate={combate} />
            ))}
          </div>
        </section>
      )}

      {carteleraPrincipal.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Cartelera Principal ({carteleraPrincipal.length})
            </h2>
            <span
              className={`text-xs ${
                principalActivos >= MAX_PREDICCIONES_CARTELERA_PRINCIPAL
                  ? "text-yellow-400 font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {principalActivos} / {MAX_PREDICCIONES_CARTELERA_PRINCIPAL}{" "}
              activas
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {carteleraPrincipal.map((combate) => (
              <CombatePrediccionRow key={combate.id} combate={combate} />
            ))}
          </div>
        </section>
      )}

      {eventoActual.combates.length === 0 && (
        <div className="rounded-xl border border-white/10 p-8 text-center text-muted-foreground text-sm">
          Este evento no cuenta con combates registrados para cartelera
          principal o estelar.
        </div>
      )}
    </div>
  );
}
