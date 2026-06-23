"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Trash2,
  Pencil,
  Eye,
  Swords,
  Trophy,
  ShieldAlert,
  Calendar,
  Hash,
} from "lucide-react";
import { deleteCombate } from "../actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MyBadge } from "@/components/ui/MyBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  TIPO_COMBATE_LABELS,
  ESTADO_COMBATE_LABELS,
  ESTADO_COMBATE_BADGE_VARIANT,
  TIPO_COMBATE_BADGE_VARIANT,
  type TipoCombate,
  type EstadoCombate,
} from "../zod";
import { ModalCombate, type CombateData } from "./ModalCombate";
import {
  ModalDetalleCombate,
  type CombateDetalleData,
} from "./ModalDetalleCombate";
import type {
  LuchadorOption,
  EventoOption,
  CategoriaOption,
  ModalidadOption,
} from "./CombateForm";

interface CardCombateProps {
  combate: CombateDetalleData & {
    id: string;
    peleador1Id: string;
    peleador2Id: string;
    rounds: number;
    duracionRounds: number;
    eventoId: string;
    tipo: TipoCombate;
    numeroPelea: number;
    horarioEstimado?: string | null;
    categoriaPesoId: string;
    modalidadId: string;
    titulo: boolean;
    estado: EstadoCombate;
    ganadorId?: string | null;
    viaVictoria?: string | null;
    roundFin?: number | null;
    minutoFin?: number | null;
    segundoFin?: number | null;
  };
  luchadores: LuchadorOption[];
  eventos: EventoOption[];
  categorias: CategoriaOption[];
  modalidades: ModalidadOption[];
}

export function CardCombate({
  combate,
  luchadores,
  eventos,
  categorias,
  modalidades,
}: CardCombateProps) {
  const [isPending, startTransition] = useTransition();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const esFinalizado = combate.estado === "FINALIZADO";

  const nombreCorto = (p: {
    nombre: string;
    apellido: string;
    apodo: string;
  }) => `${p.nombre} ${p.apellido}`;

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteCombate(combate.id);
        if (result.success) {
          toast.success("Combate eliminado con éxito");
          setIsAlertOpen(false);
        } else {
          toast.error(result.error || "No se pudo eliminar el combate");
        }
      } catch {
        toast.error("Ocurrió un error inesperado al eliminar el combate");
      }
    });
  };

  const combateDataForEdit: CombateData = {
    id: combate.id,
    peleador1Id: combate.peleador1Id,
    peleador2Id: combate.peleador2Id,
    rounds: combate.rounds,
    duracionRounds: combate.duracionRounds,
    eventoId: combate.eventoId,
    tipo: combate.tipo,
    numeroPelea: combate.numeroPelea,
    horarioEstimado: combate.horarioEstimado,
    categoriaPesoId: combate.categoriaPesoId,
    modalidadId: combate.modalidadId,
    titulo: combate.titulo,
    estado: combate.estado,
    ganadorId: combate.ganadorId,
    viaVictoria: combate.viaVictoria,
    roundFin: combate.roundFin,
    minutoFin: combate.minutoFin,
    segundoFin: combate.segundoFin,
  };

  return (
    <Card
      size="sm"
      className="group h-fit transition-all duration-300 hover:-translate-y-1"
    >
      <CardHeader className="flex flex-col items-start justify-between border-b border-border/30 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex px-2 py-3.5 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground shrink-0">
            <Swords />
          </div>
          <div className="min-w-0 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider transition-colors group-hover:text-white">
              <Calendar size={13} />
              <span>Evento #{combate.evento.numero}</span>
              <span className="font-bold">·</span>
              <div className="flex items-center gap-0.5">
                <span>Pelea</span>
                <Hash size={13} />
                {combate.numeroPelea}
              </div>
            </div>
            <p className="text-sm font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
              {nombreCorto(combate.peleador1)}{" "}
              <span className="text-muted-foreground font-normal transition-colors group-hover:text-white">
                vs
              </span>{" "}
              {nombreCorto(combate.peleador2)}
            </p>
            <MyBadge
              variant={ESTADO_COMBATE_BADGE_VARIANT[combate.estado]}
              text={ESTADO_COMBATE_LABELS[combate.estado]}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          <MyBadge
            variant={TIPO_COMBATE_BADGE_VARIANT[combate.tipo]}
            text={TIPO_COMBATE_LABELS[combate.tipo]}
          />
          <MyBadge variant="secondary" text={combate.categoriaPeso.nombre} />
          <MyBadge variant="outline" text={combate.modalidad.nombre} />
          {combate.titulo && (
            <MyBadge variant="default" text="🏆 Por el Título" />
          )}
        </div>

        {esFinalizado && combate.ganador && (
          <div className="flex items-center gap-2 mt-1 rounded-md bg-yellow-500/10 border border-yellow-500/20 px-3 py-2">
            <Trophy size={16} className="text-yellow-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-xs text-muted-foreground">Ganador · </span>
              <span className="text-sm font-semibold text-foreground">
                {combate.ganador.nombre} {combate.ganador.apellido}
              </span>
              {combate.viaVictoria && (
                <span className="text-xs text-muted-foreground ml-1">
                  ({combate.viaVictoria})
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 border-t border-border/30">
        <ModalDetalleCombate
          combate={combate}
          trigger={
            <Button
              variant="outline"
              size="sm"
              className="w-full border-border/50 hover:bg-muted/50"
            >
              <Eye size={16} className="mr-1.5" />
              Información detallada
            </Button>
          }
        />

        <div className="flex justify-end gap-1 w-full">
          <ModalCombate
            combate={combateDataForEdit}
            luchadores={luchadores}
            eventos={eventos}
            categorias={categorias}
            modalidades={modalidades}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
              >
                <Pencil size={16} />
              </Button>
            }
          />

          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                disabled={isPending}
              >
                <Trash2 size={16} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-border/50 bg-background/95 backdrop-blur-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                  <ShieldAlert size={20} />
                  ¿Confirmar eliminación?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  Estás a punto de eliminar el combate entre{" "}
                  <strong>
                    {nombreCorto(combate.peleador1)} vs{" "}
                    {nombreCorto(combate.peleador2)}
                  </strong>
                  . Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete();
                  }}
                  disabled={isPending}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  {isPending ? "Eliminando..." : "Eliminar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
