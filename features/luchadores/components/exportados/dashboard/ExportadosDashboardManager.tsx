"use client";

import * as React from "react";
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LuchadorExportadoDetalle } from "@/features/luchadores/actions/exportados";
import { useExportadosManager } from "./useExportadosManager";
import { ExportadosDashboardHeader } from "./ExportadosDashboardHeader";
import { ExportadoListItem } from "./ExportadoListItem";
import { ModalAgregarExportadosBatch } from "./ModalAgregarExportadosBatch";

interface ExportadosDashboardManagerProps {
  initialExportados: LuchadorExportadoDetalle[];
  canManage: boolean;
}

export function ExportadosDashboardManager({
  initialExportados,
  canManage,
}: ExportadosDashboardManagerProps) {
  const {
    items,
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
  } = useExportadosManager(initialExportados);

  return (
    <div className="flex flex-col gap-6">
      <ExportadosDashboardHeader
        totalItems={items.length}
        canManage={canManage}
        hasOrderChanged={hasOrderChanged}
        isSavingOrder={isSavingOrder}
        selectedCount={selectedIds.size}
        isRemovingBatch={isRemovingBatch}
        exportadosActualesIds={exportadosIdsActuales}
        onSaveOrder={handleSaveOrder}
        onRemoveSelected={handleRemoveSelected}
      />

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border border-dashed border-border bg-card text-center gap-3">
          <Users className="h-10 w-10 text-muted-foreground/40" />
          <div className="max-w-md">
            <h3 className="text-base font-semibold">
              No hay peleadores exportados registrados
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Hacé click en &quot;Añadir peleadores&quot; para seleccionar
              atletas de la base de datos o edita un luchador para marcarlo como
              exportado.
            </p>
          </div>
          {canManage && (
            <ModalAgregarExportadosBatch
              exportadosActualesIds={exportadosIdsActuales}
              trigger={
                <Button className="mt-2">
                  <Plus className="mr-1.5 h-4 w-4" />
                  Añadir peleadores ahora
                </Button>
              }
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {items.map((luchador, index) => (
            <ExportadoListItem
              key={luchador.id}
              luchador={luchador}
              index={index}
              totalCount={items.length}
              isSelected={selectedIds.has(luchador.id)}
              isDragging={draggedIndex === index}
              canManage={canManage}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onToggleSelect={toggleSelectItem}
              onMoveItem={moveItem}
              onRemoveSingle={handleRemoveSingle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
