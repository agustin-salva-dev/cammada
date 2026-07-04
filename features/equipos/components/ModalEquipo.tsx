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
import { EquipoForm } from "./EquipoForm";
import { createEquipo, updateEquipo } from "../actions";
import type { EquipoFormData } from "../zod";

export interface EquipoData {
  id: string;
  nombre: string;
  pais: string;
  ciudad: string;
}

interface ModalEquipoProps {
  trigger?: React.ReactNode;
  equipo?: EquipoData;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ModalEquipo({
  trigger,
  equipo,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ModalEquipoProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setInternalOpen;

  const [isPending, startTransition] = React.useTransition();

  const isEditing = !!equipo;
  const formId = isEditing
    ? `form-editar-equipo-${equipo.id}`
    : "form-crear-equipo";

  function handleSubmit(data: EquipoFormData) {
    startTransition(async () => {
      try {
        const result = isEditing
          ? await updateEquipo(equipo.id, data)
          : await createEquipo(data);

        if (result.success) {
          toast.success(
            isEditing
              ? `Equipo "${data.nombre}" actualizado con éxito`
              : `Equipo "${data.nombre}" creado con éxito`,
            { position: "top-center" },
          );
          setOpen(false);
        } else {
          toast.error(result.error || "Ocurrió un error inesperado");
        }
      } catch {
        toast.error("Ocurrió un error inesperado al guardar el equipo.");
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
            {isEditing ? "Editar equipo" : "Nuevo equipo"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Modificá los datos del equipo "${equipo.nombre}".`
              : "Completá los datos del nuevo equipo."}{" "}
            Los campos marcados con{" "}
            <span className="text-destructive font-medium">*</span> son
            obligatorios.
          </DialogDescription>
        </DialogHeader>

        <EquipoForm
          formId={formId}
          initialData={
            isEditing
              ? {
                  nombre: equipo.nombre,
                  pais: equipo.pais,
                  ciudad: equipo.ciudad,
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
                : "Crear equipo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
