"use client";

import { useTransition } from "react";
import { RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
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
import {
  togglePrediccionCombate,
  resetearVotosCombate,
} from "@/features/predicciones/actions";
import type { CombatePrediccionAdmin } from "@/features/predicciones/types";
import { TIPO_COMBATE_PREDICCION_LABEL } from "@/features/predicciones/constants";
import type { TipoCombateConPrediccion } from "@/features/predicciones/constants";

interface CombatePrediccionRowProps {
  combate: CombatePrediccionAdmin;
}

export function CombatePrediccionRow({ combate }: CombatePrediccionRowProps) {
  const [isPending, startTransition] = useTransition();

  function handleToggle(checked: boolean) {
    startTransition(async () => {
      const res = await togglePrediccionCombate({
        combateId: combate.id,
        habilitada: checked,
      });
      if (!res.success) {
        toast.error(res.error);
      } else {
        toast.success(
          checked ? "Predicción habilitada" : "Predicción desactivada",
        );
      }
    });
  }

  function handleReset() {
    startTransition(async () => {
      const res = await resetearVotosCombate({ combateId: combate.id });
      if (!res.success) {
        toast.error(res.error);
      } else {
        toast.success(
          `${res.data.eliminados} voto${res.data.eliminados !== 1 ? "s" : ""} eliminados`,
        );
      }
    });
  }

  const tipoLabel =
    TIPO_COMBATE_PREDICCION_LABEL[combate.tipo as TipoCombateConPrediccion] ??
    combate.tipo;

  return (
    <div
      id={`combate-row-${combate.id}`}
      className={`flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 rounded-xl border transition-colors ${
        combate.prediccionHabilitada
          ? "border-primary/20 bg-primary/5"
          : "border-white/10 bg-white/5"
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-white/5 border border-white/10 rounded px-1.5 py-0.5">
            {tipoLabel}
          </span>
          {combate.titulo && (
            <span className="text-[10px] font-bold text-yellow-400">
              🏆 Título
            </span>
          )}
          <span className="text-[10px] text-muted-foreground/50">
            · {combate.categoriaPeso.nombre}
          </span>
        </div>
        <p className="font-semibold text-sm truncate">
          {combate.peleador1.nombre} {combate.peleador1.apellido}
          <span className="text-muted-foreground font-normal mx-1.5">vs</span>
          {combate.peleador2.nombre} {combate.peleador2.apellido}
        </p>

        {combate.totalVotos > 0 && (
          <div className="mt-2 space-y-1">
            <div className="flex rounded-full overflow-hidden h-1.5 bg-white/5">
              <div
                className="bg-primary/60 transition-all duration-500"
                style={{ width: `${combate.porcentajePeleador1}%` }}
              />
              <div
                className="bg-white/15 transition-all duration-500"
                style={{ width: `${combate.porcentajePeleador2}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              {combate.peleador1.apellido}: {combate.porcentajePeleador1}% ·{" "}
              {combate.peleador2.apellido}: {combate.porcentajePeleador2}% ·{" "}
              <span className="text-foreground/60">
                {combate.totalVotos} votos
              </span>
            </p>
          </div>
        )}
        {combate.totalVotos === 0 && (
          <p className="text-[10px] text-muted-foreground/50 mt-1">
            Sin votos aún
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Switch
                id={`switch-prediccion-${combate.id}`}
                checked={combate.prediccionHabilitada}
                onCheckedChange={handleToggle}
                disabled={isPending}
              />
              <label
                htmlFor={`switch-prediccion-${combate.id}`}
                className="text-xs text-muted-foreground cursor-pointer select-none"
              >
                {combate.prediccionHabilitada ? "Activa" : "Inactiva"}
              </label>
            </div>

            {combate.totalVotos > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    id={`btn-reset-votos-${combate.id}`}
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Resetear votos?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Se eliminarán los {combate.totalVotos} votos de la
                      predicción{" "}
                      <strong>
                        {combate.peleador1.apellido} vs{" "}
                        {combate.peleador2.apellido}
                      </strong>
                      . Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleReset}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Eliminar votos
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </>
        )}
      </div>
    </div>
  );
}
