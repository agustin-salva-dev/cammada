"use client";

import * as React from "react";
import { getColumns, type LuchadorRow } from "./columns";
import { DataTable } from "./data-table";
import { deleteLuchador } from "@/features/luchadores/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface LuchadoresTableProps {
  data: LuchadorRow[];
  categorias: string[];
  equipos: string[];
}

export function LuchadoresTable({
  data,
  categorias,
  equipos,
}: LuchadoresTableProps) {
  const [deleteTarget, setDeleteTarget] = React.useState<{
    id: string;
    nombre: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = React.useCallback((id: string, nombre: string) => {
    setDeleteTarget({ id, nombre });
  }, []);

  const confirmDelete = React.useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteLuchador(deleteTarget.id);
      if (res.success) {
        toast.success("Peleador eliminado correctamente", {
          position: "top-center",
        });
      } else {
        toast.error("Error al eliminar: " + (res.error || "Error desconocido"));
      }
    } catch (err) {
      console.error(err);
      toast.error(
        "Ocurrió un error inesperado al intentar eliminar el peleador.",
      );
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget]);

  const columns = React.useMemo(() => getColumns(handleDelete), [handleDelete]);

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        categorias={categorias}
        equipos={equipos}
      />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar luchador?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás por eliminar a{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.nombre}
              </span>
              . Esta acción no se puede deshacer y se borrarán todos sus récords
              asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
