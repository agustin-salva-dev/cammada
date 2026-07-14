"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LuchadorFormData } from "@/features/luchadores/types";
import { updateLuchador } from "@/features/luchadores/actions";
import { toast } from "sonner";
import { LuchadorForm } from "./LuchadorForm";
import { getCategoriasPesoSelect } from "@/features/categorias-peso/actions";
import { getModalidadesSelect } from "@/features/modalidades/actions";
import type { LuchadorRow } from "@/app/dashboard/luchadores/columns";

interface ModalEditarLuchadorProps {
  luchador: LuchadorRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

function mapLuchadorRowToForm(luchador: LuchadorRow): LuchadorFormData {
  return {
    nombre: luchador.nombre || "",
    apodo: luchador.apodo === "Sin apodo" ? "" : luchador.apodo || "",
    apellido: luchador.apellido || "",
    edad: luchador.edad ?? undefined,
    altura: luchador.altura ?? undefined,
    ultimoPeso: luchador.ultimoPeso ?? undefined,
    categoria: luchador.categoria?.id ?? "",
    pais: luchador.pais || "Argentina",
    ciudad: luchador.ciudad === "Desconocida" ? "" : luchador.ciudad || "",
    equipo: luchador.equipo?.nombre === "Sin equipo" ? "" : luchador.equipo?.nombre || "",
    records: (luchador.records || []).map((r) => ({
      id: r.id,
      modalidad: r.modalidad?.nombre ?? "",
      victorias: r.victorias,
      derrotas: r.derrotas,
      empates: r.empates,
    })),
  };
}

export function ModalEditarLuchador({
  luchador,
  open,
  onOpenChange,
  onSubmit,
}: ModalEditarLuchadorProps) {
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

  if (!luchador) return null;

  const initialData = mapLuchadorRowToForm(luchador);

  function handleSubmit(data: LuchadorFormData) {
    if (!luchador) return;
    startTransition(async () => {
      try {
        const res = await updateLuchador(luchador.id, data);
        if (res.success) {
          onSubmit?.(data);
          onOpenChange(false);
          toast.success("Peleador editado correctamente", {
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
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col gap-0 p-0"
        showCloseButton={true}
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border sticky top-0 bg-popover z-10">
          <DialogTitle className="text-xl">Editar luchador/a</DialogTitle>
          <DialogDescription>
            Modificá los datos del peleador/a. Los campos marcados con{" "}
            <span className="text-destructive font-medium">*</span> son
            obligatorios.
          </DialogDescription>
        </DialogHeader>

        {open && (
          <LuchadorForm
            key={luchador.id}
            formId="form-editar-luchador"
            initialData={initialData}
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
            form="form-editar-luchador"
            disabled={isPending}
          >
            {isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
