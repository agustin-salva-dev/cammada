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
import { ModalidadForm } from "./ModalidadForm";
import { createModalidad, updateModalidad } from "../actions";
import type { ModalidadFormData } from "../zod";

export interface ModalidadData {
  id: string;
  nombre: string;
}

interface ModalModalidadProps {
  trigger: React.ReactNode;
  modalidad?: ModalidadData;
}

export function ModalModalidad({ trigger, modalidad }: ModalModalidadProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const isEditing = !!modalidad;
  const formId = isEditing
    ? `form-editar-modalidad-${modalidad.id}`
    : "form-crear-modalidad";

  function handleSubmit(data: ModalidadFormData) {
    startTransition(async () => {
      try {
        const result = isEditing
          ? await updateModalidad(modalidad.id, data)
          : await createModalidad(data);

        if (result.success) {
          toast.success(
            isEditing
              ? `Modalidad "${data.nombre}" actualizada con éxito`
              : `Modalidad "${data.nombre}" creada con éxito`,
            { position: "top-center" },
          );
          setOpen(false);
        } else {
          toast.error(result.error || "Ocurrió un error inesperado");
        }
      } catch {
        toast.error(
          "Ocurrió un error inesperado al guardar la modalidad.",
        );
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className="sm:max-w-lg flex flex-col gap-0 p-0"
        showCloseButton
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-xl">
            {isEditing ? "Editar modalidad" : "Nueva modalidad de combate"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Modificá el nombre de la modalidad "${modalidad.nombre}".`
              : "Ingresá el nombre de la nueva modalidad de combate."}{" "}
            Los campos marcados con{" "}
            <span className="text-destructive font-medium">*</span> son
            obligatorios.
          </DialogDescription>
        </DialogHeader>

        <ModalidadForm
          formId={formId}
          initialData={isEditing ? { nombre: modalidad.nombre } : undefined}
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
                : "Crear modalidad"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
