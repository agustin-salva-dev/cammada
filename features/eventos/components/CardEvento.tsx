"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Trash2,
  Pencil,
  MapPin,
  Calendar,
  Clock,
  CalendarFold,
  Swords,
  Eye,
  Building2,
  ShieldAlert,
} from "lucide-react";
import { deleteEvento } from "../actions";
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
import { ModalEvento, type EventoData } from "./ModalEvento";
import { ModalDetalleEvento } from "./ModalDetalleEvento";
import { ESTADO_LABELS, type EstadoEvento } from "../zod";

import type { TipoCombate } from "@/features/combates/zod";

interface CombateSimplificado {
  id: string;
  tipo: TipoCombate;
  peleador1: {
    id: string;
    nombre: string;
    apellido: string;
    apodo: string | null;
  };
  peleador2: {
    id: string;
    nombre: string;
    apellido: string;
    apodo: string | null;
  };
  modalidad: {
    id: string;
    nombre: string;
  };
}

interface CardEventoProps {
  id: string;
  numero: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  lugarNombre: string;
  calle: string;
  calleNumero: string;
  estado: EstadoEvento;
  peleasCount: number;
  combates?: CombateSimplificado[];
}

const ESTADO_BADGE_VARIANT: Record<
  EstadoEvento,
  "default" | "secondary" | "destructive" | "outline" | "green"
> = {
  BORRADOR: "secondary",
  PROGRAMADO: "outline",
  CONFIRMADO: "green",
  FINALIZADO: "default",
  CANCELADO: "destructive",
};

function formatFechaCorta(fechaStr: string): string {
  const date = new Date(fechaStr);
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function CardEvento({
  id,
  numero,
  fecha,
  horaInicio,
  horaFin,
  lugarNombre,
  calle,
  calleNumero,
  estado,
  peleasCount,
  combates = [],
}: CardEventoProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteEvento(id);
        if (result.success) {
          toast.success(`Evento #${numero} eliminado con éxito`);
          setIsOpen(false);
        } else {
          toast.error(result.error || "No se pudo eliminar el evento");
        }
      } catch (error) {
        console.error(
          "Ocurrió un error inesperado al eliminar el evento",
          error,
        );
        toast.error("Ocurrió un error inesperado al eliminar el evento");
      }
    });
  };

  const eventoData: EventoData = {
    id,
    numero,
    fecha,
    horaInicio,
    horaFin,
    lugarNombre,
    calle,
    calleNumero,
    estado,
  };

  return (
    <Card
      size="sm"
      className="group h-fit transition-all duration-300 hover:-translate-y-1"
    >
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="flex px-2 py-3.5 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <CalendarFold />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider">
              Cammada Fight Session
            </p>
            <p className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
              #{numero}
            </p>
          </div>
        </div>
        <MyBadge
          variant={ESTADO_BADGE_VARIANT[estado]}
          text={ESTADO_LABELS[estado]}
        />
      </CardHeader>

      <CardContent className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0 text-primary/70" />
          <span>{formatFechaCorta(fecha)}</span>
          <span className="text-border">•</span>
          <Clock className="h-3.5 w-3.5 shrink-0 text-primary/70" />
          <span>{horaInicio}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4 shrink-0 text-primary/70" />
          <span className="truncate">{lugarNombre}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-primary/70" />
          <span className="truncate">
            {calle} {calleNumero}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Swords className="h-4 w-4 shrink-0 text-primary/70" />
          <span>
            {peleasCount === 0
              ? "Sin peleas registradas"
              : peleasCount === 1
                ? "1 pelea"
                : `${peleasCount} peleas`}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 border-t border-border/30">
        <ModalDetalleEvento
          evento={eventoData}
          combates={combates}
          trigger={
            <Button
              variant="outline"
              size="sm"
              className="w-full border-border/50 hover:bg-muted/50"
            >
              <Eye className="h-4 w-4 mr-1.5" />
              Información detallada
            </Button>
          }
        />

        <div className="flex justify-end gap-1 w-full">
          <ModalEvento
            evento={eventoData}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            }
          />

          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-border/50 bg-background/95 backdrop-blur-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                  <ShieldAlert className="h-5 w-5" />
                  ¿Confirmar eliminación?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  Estás a punto de eliminar el evento{" "}
                  <strong>Cammada Fight Session #{numero}</strong>. Esta acción
                  no se puede deshacer.
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
