"use client";

import * as React from "react";
import {
  GripVertical,
  Trash2,
  ExternalLink,
  Plus,
  Loader2,
  ArrowUp,
  ArrowDown,
  Globe,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { LuchadorExportadoDetalle } from "@/features/luchadores/actions/exportados";
import {
  updateOrdenExportados,
  removeExportadosBatch,
} from "@/features/luchadores/actions/exportados";
import { ModalAgregarExportadosBatch } from "./ModalAgregarExportadosBatch";
import { toast } from "sonner";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface ExportadosDashboardManagerProps {
  initialExportados: LuchadorExportadoDetalle[];
  canManage: boolean;
}

export function ExportadosDashboardManager({
  initialExportados,
  canManage,
}: ExportadosDashboardManagerProps) {
  const [items, setItems] =
    React.useState<LuchadorExportadoDetalle[]>(initialExportados);
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [isSavingOrder, setIsSavingOrder] = React.useState(false);
  const [hasOrderChanged, setHasOrderChanged] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [isRemovingBatch, setIsRemovingBatch] = React.useState(false);



  // Drag & Drop handlers
  function handleDragStart(e: React.DragEvent, index: number) {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Seteamos un Ghost image limpio si se prefiere
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

  // Mover elemento arriba/abajo manualmente
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

  return (
    <div className="flex flex-col gap-6">
      {/* Barra de herramientas / Header de la tabla */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Talento Exportado ({items.length})
            </h2>
            <p className="text-xs text-muted-foreground">
              Arrastrá los elementos para cambiar la prioridad en la página pública.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {hasOrderChanged && canManage && (
            <Button
              onClick={handleSaveOrder}
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

          {selectedIds.size > 0 && canManage && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemoveSelected}
              disabled={isRemovingBatch}
            >
              {isRemovingBatch ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  Quitar ({selectedIds.size}) seleccionados
                </>
              )}
            </Button>
          )}

          {canManage && (
            <ModalAgregarExportadosBatch
              exportadosActualesIds={exportadosIdsActuales}
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

      {/* Lista reordenable */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border border-dashed border-border bg-card text-center gap-3">
          <Users className="h-10 w-10 text-muted-foreground/40" />
          <div className="max-w-md">
            <h3 className="text-base font-semibold">
              No hay peleadores exportados registrados
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Hacé click en &quot;Añadir peleadores&quot; para seleccionar atletas de la base de datos o edita un luchador para marcarlo como exportado.
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
          {items.map((luchador, index) => {
            const isSelected = selectedIds.has(luchador.id);
            const isDragging = draggedIndex === index;
            const apodoText = luchador.apodo?.trim()
              ? ` "${luchador.apodo.trim()}" `
              : " ";
            const fullName = `${luchador.nombre}${apodoText}${luchador.apellido}`;

            return (
              <div
                key={luchador.id}
                draggable={canManage}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  isDragging
                    ? "opacity-50 border-primary border-dashed bg-primary/5"
                    : isSelected
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border bg-card hover:border-border/80"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {canManage && (
                    <div
                      className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1"
                      title="Arrastrar para reordenar"
                    >
                      <GripVertical className="h-5 w-5" />
                    </div>
                  )}

                  {canManage && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectItem(luchador.id)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
                    />
                  )}

                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                      {index + 1}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground text-sm sm:text-base">
                        {fullName}
                      </span>
                      {luchador.categoria?.nombre && (
                        <Badge variant="secondary" className="text-xs font-normal">
                          {luchador.categoria.nombre}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span>Equipo: {luchador.equipo?.nombre || "Sin equipo"}</span>
                      {luchador.records && luchador.records.length > 0 && (
                        <>
                          <span>•</span>
                          <span>
                            {luchador.records
                              .map(
                                (r) =>
                                  `${r.modalidad?.nombre || "Récord"}: ${r.victorias}W-${r.derrotas}L-${r.empates}D`,
                              )
                              .join(" | ")}
                          </span>
                        </>
                      )}
                      {luchador.linkTapology && (
                        <>
                          <span>•</span>
                          <a
                            href={luchador.linkTapology}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            Tapology <ExternalLink className="h-3 w-3" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Acciones por fila */}
                <div className="flex items-center gap-1">
                  {canManage && (
                    <div className="flex items-center gap-1 mr-2 border-r border-border pr-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={index === 0}
                        onClick={() => moveItem(index, index - 1)}
                        title="Subir de posición"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={index === items.length - 1}
                        onClick={() => moveItem(index, index + 1)}
                        title="Bajar de posición"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {canManage && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={async () => {
                        const res = await removeExportadosBatch([luchador.id]);
                        if (res.success) {
                          toast.success("Peleador removido de exportados.");
                          setItems((prev) =>
                            prev.filter((i) => i.id !== luchador.id),
                          );
                        } else {
                          toast.error(res.error || "No se pudo quitar.");
                        }
                      }}
                      title="Quitar de exportados"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
