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
import { CategoriaPesoForm } from "./CategoriaPesoForm";
import { createCategoriaPeso, updateCategoriaPeso } from "../actions";
import type { CategoriaPesoFormData } from "../zod";

export interface CategoriaPesoData {
  id: string;
  nombre: string;
  orden: number;
  limiteInferior: number | null;
  limiteSuperior: number | null;
}

interface ModalCategoriaPesoProps {
  trigger: React.ReactNode;
  categoria?: CategoriaPesoData;
  /** Siguiente orden disponible (solo para creación) */
  nextOrden?: number;
}

export function ModalCategoriaPeso({
  trigger,
  categoria,
  nextOrden = 0,
}: ModalCategoriaPesoProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const isEditing = !!categoria;
  const formId = isEditing
    ? `form-editar-categoria-${categoria.id}`
    : "form-crear-categoria";

  function handleSubmit(data: CategoriaPesoFormData) {
    startTransition(async () => {
      try {
        const result = isEditing
          ? await updateCategoriaPeso(categoria.id, data)
          : await createCategoriaPeso(data);

        if (result.success) {
          toast.success(
            isEditing
              ? `Categoría "${data.nombre}" actualizada con éxito`
              : `Categoría "${data.nombre}" creada con éxito`,
            { position: "top-center" },
          );
          setOpen(false);
        } else {
          toast.error(result.error || "Ocurrió un error inesperado");
        }
      } catch {
        toast.error(
          "Ocurrió un error inesperado al guardar la categoría de peso.",
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
            {isEditing ? "Editar categoría de peso" : "Nueva categoría de peso"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Modificá los datos de la categoría "${categoria.nombre}".`
              : "Completá los datos de la nueva categoría de peso."}{" "}
            Los campos marcados con{" "}
            <span className="text-destructive font-medium">*</span> son
            obligatorios.
          </DialogDescription>
        </DialogHeader>

        <CategoriaPesoForm
          formId={formId}
          initialData={
            isEditing
              ? {
                  nombre: categoria.nombre,
                  orden: categoria.orden,
                  limiteInferior: categoria.limiteInferior,
                  limiteSuperior: categoria.limiteSuperior,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          isPending={isPending}
          nextOrden={nextOrden}
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
                : "Crear categoría"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
