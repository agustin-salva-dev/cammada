"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EventoForm } from "./EventoForm";
import { createEvento, updateEvento } from "../actions";
import type { EventoFormData } from "../zod";

export interface EventoData {
  id: string;
  numero: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  lugarNombre: string;
  calle: string;
  calleNumero: string;
  estado: EventoFormData["estado"];
}

interface ModalEventoProps {
  trigger?: React.ReactNode;
  evento?: EventoData;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ModalEvento({
  trigger,
  evento,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ModalEventoProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setInternalOpen;

  const [isPending, startTransition] = React.useTransition();

  const isEditing = !!evento;
  const formId = isEditing
    ? `form-editar-evento-${evento.id}`
    : "form-crear-evento";

  function handleSubmit(data: EventoFormData) {
    startTransition(async () => {
      try {
        const result = isEditing
          ? await updateEvento(evento.id, data)
          : await createEvento(data);

        if (result.success) {
          toast.success(
            isEditing
              ? `Evento #${data.numero} actualizado con éxito`
              : `Evento #${data.numero} creado con éxito`,
            { position: "top-center" },
          );
          setOpen(false);
        } else {
          toast.error(result.error || "Ocurrió un error inesperado");
        }
      } catch {
        toast.error("Ocurrió un error inesperado al guardar el evento.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        className="sm:max-w-lg flex flex-col gap-0 p-0"
        showCloseButton
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-xl">
            {isEditing ? "Editar evento" : "Nuevo evento"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Modificá los datos del evento #${evento.numero}.`
              : "Completá los datos del nuevo evento."}{" "}
            Los campos marcados con{" "}
            <span className="text-destructive font-medium">*</span> son
            obligatorios.
          </DialogDescription>
        </DialogHeader>

        <EventoForm
          formId={formId}
          initialData={
            isEditing
              ? {
                  numero: evento.numero,
                  fecha: evento.fecha,
                  horaInicio: evento.horaInicio,
                  horaFin: evento.horaFin,
                  lugarNombre: evento.lugarNombre,
                  calle: evento.calle,
                  calleNumero: evento.calleNumero,
                  estado: evento.estado,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          isPending={isPending}
        />

        <DialogFooter className="px-6 py-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" form={formId} disabled={isPending}>
            {isPending
              ? "Guardando..."
              : isEditing
                ? "Guardar cambios"
                : "Crear evento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
