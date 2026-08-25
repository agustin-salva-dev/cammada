"use client";

import * as React from "react";
import type { LuchadorExportadoDetalle } from "@/features/luchadores/actions/exportados";
import {
  updateOrdenExportados,
  removeExportadosBatch,
} from "@/features/luchadores/actions/exportados";
import { toast } from "sonner";

export function useExportadosManager(
  initialExportados: LuchadorExportadoDetalle[],
) {
  const [items, setItems] =
    React.useState<LuchadorExportadoDetalle[]>(initialExportados);
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [isSavingOrder, setIsSavingOrder] = React.useState(false);
  const [hasOrderChanged, setHasOrderChanged] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [isRemovingBatch, setIsRemovingBatch] = React.useState(false);

  React.useEffect(() => {
    setItems(initialExportados);
  }, [initialExportados]);

  function handleDragStart(e: React.DragEvent, index: number) {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setItems(newItems);
    setHasOrderChanged(true);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
  }

  function moveItem(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= items.length) return;
    const newItems = [...items];
    const [moved] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, moved);
    setItems(newItems);
    setHasOrderChanged(true);
  }

  async function handleSaveOrder() {
    setIsSavingOrder(true);
    try {
      const orderedIds = items.map((item) => item.id);
      const res = await updateOrdenExportados(orderedIds);
      if (res.success) {
        toast.success("Orden de aparición guardado correctamente.");
        setHasOrderChanged(false);
      } else {
        toast.error(res.error || "No se pudo guardar el orden.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error inesperado al guardar el orden.");
    } finally {
      setIsSavingOrder(false);
    }
  }

  async function handleRemoveSelected() {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    setIsRemovingBatch(true);
    try {
      const res = await removeExportadosBatch(ids);
      if (res.success) {
        toast.success(
          `${res.data} luchador${res.data > 1 ? "es" : ""} removido${res.data > 1 ? "s" : ""} de la sección de exportación.`,
        );
        setSelectedIds(new Set());
        setItems((prev) => prev.filter((item) => !ids.includes(item.id)));
      } else {
        toast.error(res.error || "No se pudieron remover los luchadores.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error al quitar los peleadores.");
    } finally {
      setIsRemovingBatch(false);
    }
  }

  async function handleRemoveSingle(id: string) {
    try {
      const res = await removeExportadosBatch([id]);
      if (res.success) {
        toast.success("Peleador removido de exportados.");
        setItems((prev) => prev.filter((i) => i.id !== id));
      } else {
        toast.error(res.error || "No se pudo quitar.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error al quitar el peleador.");
    }
  }

  function toggleSelectItem(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const exportadosIdsActuales = React.useMemo(() => {
    return items.map((i) => i.id);
  }, [items]);

  return {
    items,
    setItems,
    draggedIndex,
    isSavingOrder,
    hasOrderChanged,
    selectedIds,
    isRemovingBatch,
    exportadosIdsActuales,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    moveItem,
    handleSaveOrder,
    handleRemoveSelected,
    handleRemoveSingle,
    toggleSelectItem,
  };
}
