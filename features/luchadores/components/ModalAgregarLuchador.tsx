"use client";

import * as React from "react";
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
import { LuchadorFormData } from "@/features/luchadores/types";
import { createLuchador } from "@/features/luchadores/actions";
import { toast } from "sonner";
import { LuchadorForm } from "./LuchadorForm";
import { getCategoriasPesoSelect } from "@/features/categorias-peso/actions";
import { getModalidadesSelect } from "@/features/modalidades/actions";

interface ModalAgregarLuchadorProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: LuchadorFormData) => void;
}

interface CategoriaPesoOption {
  id: string;
  nombre: string;
  limiteInferior: number | null;
  limiteSuperior: number | null;
}

interface ModalidadOption {
  id: string;
  nombre: string;
}

export function ModalAgregarLuchador({
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onSubmit,
}: ModalAgregarLuchadorProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setInternalOpen;

  const [isPending, startTransition] = React.useTransition();
  const [categorias, setCategorias] = React.useState<CategoriaPesoOption[]>([]);
  const [modalidades, setModalidades] = React.useState<ModalidadOption[]>([]);

  React.useEffect(() => {
    if (open) {
      getCategoriasPesoSelect().then((res) => {
        if (res.success && res.data) {
          setCategorias(res.data as unknown as CategoriaPesoOption[]);
        }
      });
      getModalidadesSelect().then((res) => {
        if (res.success && res.data) {
          setModalidades(res.data as ModalidadOption[]);
        }
      });
    }
  }, [open]);

  function handleSubmit(data: LuchadorFormData) {
    startTransition(async () => {
      try {
        const res = await createLuchador(data);
        if (res.success) {
          onSubmit?.(data);
          setOpen(false);
          toast.success("Peleador agregado correctamente", {
            position: "top-center",
          });
        } else {
          toast.error("Error al guardar: " + (res.error || "Error desconocido"));
        }
      } catch (err) {
        console.error(err);
        toast.error(
          "Ocurrió un error inesperado al intentar guardar el peleador.",
        );
      }
    });
  }

  function handleCancel() {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col gap-0 p-0"
        showCloseButton={true}
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border sticky top-0 bg-popover z-10">
          <DialogTitle className="text-xl">Agregar luchador/a</DialogTitle>
          <DialogDescription>
            Completá los datos del nuevo peleador/a. Los campos marcados con{" "}
            <span className="text-destructive font-medium">*</span> son
            obligatorios.
          </DialogDescription>
        </DialogHeader>

        {open && (
          <LuchadorForm
            formId="form-agregar-luchador"
            onSubmit={handleSubmit}
            isPending={isPending}
            categorias={categorias}
            modalidades={modalidades}
          />
        )}

        <DialogFooter className="px-6 py-4 border-t border-border sticky bottom-0 bg-popover z-10">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="form-agregar-luchador"
            disabled={isPending}
          >
            {isPending ? "Guardando..." : "Guardar luchador"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
