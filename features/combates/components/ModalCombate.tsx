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
import { CombateForm } from "./CombateForm";
import type {
  LuchadorOption,
  EventoOption,
  CategoriaOption,
  ModalidadOption,
} from "./CombateForm";
import { createCombate, updateCombate } from "../actions";
import type { CombateFormData } from "../zod";

export interface CombateData {
  id: string;
  peleador1Id: string;
  peleador2Id: string;
  rounds: number;
  duracionRounds: number;
  eventoId: string;
  tipo: CombateFormData["tipo"];
  numeroPelea: number;
  horarioEstimado?: string | null;
  categoriaPesoId: string;
  modalidadId: string;
  titulo: boolean;
  estado: CombateFormData["estado"];
  ganadorId?: string | null;
  viaVictoria?: string | null;
  roundFin?: number | null;
  minutoFin?: number | null;
  segundoFin?: number | null;
}

interface ModalCombateProps {
  trigger: React.ReactNode;
  combate?: CombateData;
  luchadores: LuchadorOption[];
  eventos: EventoOption[];
  categorias: CategoriaOption[];
  modalidades: ModalidadOption[];
}

export function ModalCombate({
  trigger,
  combate,
  luchadores,
  eventos,
  categorias,
  modalidades,
}: ModalCombateProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const isEditing = !!combate;
  const formId = isEditing
    ? `form-editar-combate-${combate.id}`
    : "form-crear-combate";

  function handleSubmit(data: CombateFormData) {
    startTransition(async () => {
      try {
        const result = isEditing
          ? await updateCombate(combate.id, data)
          : await createCombate(data);

        if (result.success) {
          toast.success(
            isEditing
              ? "Combate actualizado con éxito"
              : "Combate creado con éxito",
            { position: "top-center" },
          );
          setOpen(false);
        } else {
          toast.error(result.error || "Ocurrió un error inesperado");
        }
      } catch {
        toast.error("Ocurrió un error inesperado al guardar el combate.");
      }
    });
  }

  const initialData: Partial<CombateFormData> | undefined = combate
    ? {
        peleador1Id: combate.peleador1Id,
        peleador2Id: combate.peleador2Id,
        rounds: combate.rounds,
        duracionRounds: combate.duracionRounds,
        eventoId: combate.eventoId,
        tipo: combate.tipo,
        numeroPelea: combate.numeroPelea,
        horarioEstimado: combate.horarioEstimado ?? "",
        categoriaPesoId: combate.categoriaPesoId,
        modalidadId: combate.modalidadId,
        titulo: combate.titulo,
        estado: combate.estado,
        ganadorId: combate.ganadorId ?? "",
        viaVictoria: combate.viaVictoria ?? "",
        roundFin: combate.roundFin ?? "",
        minutoFin: combate.minutoFin ?? "",
        segundoFin: combate.segundoFin ?? "",
      }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className="sm:max-w-2xl flex flex-col gap-0 p-0"
        showCloseButton
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-xl">
            {isEditing ? "Editar combate" : "Nuevo combate"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modificá los datos del combate."
              : "Completá los datos del nuevo combate."}{" "}
            Los campos marcados con{" "}
            <span className="text-destructive font-medium">*</span> son
            obligatorios.
          </DialogDescription>
        </DialogHeader>

        <CombateForm
          formId={formId}
          initialData={initialData}
          onSubmit={handleSubmit}
          isPending={isPending}
          luchadores={luchadores}
          eventos={eventos}
          categorias={categorias}
          modalidades={modalidades}
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
                : "Crear combate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
