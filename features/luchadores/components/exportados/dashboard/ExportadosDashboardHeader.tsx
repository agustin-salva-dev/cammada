"use client";

import * as React from "react";
import { Globe, Loader2, Trash2, Plus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalAgregarExportadosBatch } from "./ModalAgregarExportadosBatch";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface ExportadosDashboardHeaderProps {
  totalItems: number;
  canManage: boolean;
  hasOrderChanged: boolean;
  isSavingOrder: boolean;
  selectedCount: number;
  isRemovingBatch: boolean;
  exportadosActualesIds: string[];
  onSaveOrder: () => void;
  onRemoveSelected: () => void;
}

export function ExportadosDashboardHeader({
  totalItems,
  canManage,
  hasOrderChanged,
  isSavingOrder,
  selectedCount,
  isRemovingBatch,
  exportadosActualesIds,
  onSaveOrder,
  onRemoveSelected,
}: ExportadosDashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Globe className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Talento Exportado ({totalItems})
          </h2>
          <p className="text-xs text-muted-foreground">
            Arrastrá los elementos para cambiar la prioridad en la página
            pública.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {hasOrderChanged && canManage && (
          <Button
            onClick={onSaveOrder}
            disabled={isSavingOrder}
            size="sm"
            className="animate-fade-in"
          >
            {isSavingOrder ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando orden...
              </>
            ) : (
              "Guardar nuevo orden"
            )}
          </Button>
        )}

        {selectedCount > 0 && canManage && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onRemoveSelected}
            disabled={isRemovingBatch}
          >
            {isRemovingBatch ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Trash2 className="mr-1.5 h-4 w-4" />
                Quitar ({selectedCount}) seleccionados
              </>
            )}
          </Button>
        )}

        {canManage && (
          <ModalAgregarExportadosBatch
            exportadosActualesIds={exportadosActualesIds}
            trigger={
              <Button variant="default" size="sm">
                <Plus className="mr-1.5 h-4 w-4" />
                Añadir peleadores
              </Button>
            }
          />
        )}

        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.TALENTO_EXPORTADO} target="_blank">
            <ExternalLink className="mr-1.5 h-4 w-4" />
            Ver vista pública
          </Link>
        </Button>
      </div>
    </div>
  );
}
