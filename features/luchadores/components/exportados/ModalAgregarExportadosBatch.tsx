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
import { Input } from "@/components/ui/input";
import { Search, Globe, Check, Loader2, Users } from "lucide-react";
import { getLuchadoresSelect } from "@/features/luchadores/actions";
import { addExportadosBatch } from "@/features/luchadores/actions/exportados";
import { toast } from "sonner";

interface ModalAgregarExportadosBatchProps {
  trigger: React.ReactNode;
  exportadosActualesIds: string[];
  onSuccess?: () => void;
}

interface LuchadorOption {
  id: string;
  nombre: string;
  apellido: string;
  apodo: string;
  categoriaId: string;
  equipo: { nombre: string } | null;
}

export function ModalAgregarExportadosBatch({
  trigger,
  exportadosActualesIds,
  onSuccess,
}: ModalAgregarExportadosBatchProps) {
  const [open, setOpen] = React.useState(false);
  const [luchadores, setLuchadores] = React.useState<LuchadorOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (!open) return;
    let active = true;
    getLuchadoresSelect().then((res) => {
      if (active) {
        setLoading(false);
        if (res.success && res.data) {
          setLuchadores(res.data as LuchadorOption[]);
        } else {
          toast.error("No se pudieron cargar los luchadores.");
        }
      }
    });
    return () => {
      active = false;
    };
  }, [open]);

  // Filtrar luchadores que no estén ya exportados
  const luchadoresDisponibles = React.useMemo(() => {
    return luchadores.filter((l) => !exportadosActualesIds.includes(l.id));
  }, [luchadores, exportadosActualesIds]);

  // Filtrar según término de búsqueda
  const luchadoresFiltrados = React.useMemo(() => {
    if (!search.trim()) return luchadoresDisponibles;
    const term = search.toLowerCase().trim();
    return luchadoresDisponibles.filter((l) => {
      const full = `${l.nombre} ${l.apodo} ${l.apellido} ${l.equipo?.nombre || ""}`.toLowerCase();
      return full.includes(term);
    });
  }, [luchadoresDisponibles, search]);

  function toggleSelect(id: string) {
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

  function toggleSelectAll() {
    if (selectedIds.size === luchadoresFiltrados.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(luchadoresFiltrados.map((l) => l.id)));
    }
  }

  async function handleAddSelected() {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    setIsSubmitting(true);
    try {
      const res = await addExportadosBatch(ids);
      if (res.success) {
        toast.success(
          `${res.data} peleador${res.data > 1 ? "es" : ""} agregado${res.data > 1 ? "s" : ""} a la sección de exportación.`,
        );
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.error || "No se pudieron agregar los peleadores.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Globe className="h-4 w-4" />
            </div>
            <DialogTitle className="text-xl">
              Agregar Peleadores de Exportación
            </DialogTitle>
          </div>
          <DialogDescription>
            Buscá y seleccioná múltiples luchadores para agregarlos todos juntos a la sección pública &quot;Talento Exportado&quot;.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 flex flex-col gap-3 border-b border-border bg-muted/20">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, apodo, apellido o equipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              {luchadoresFiltrados.length} luchador{luchadoresFiltrados.length !== 1 ? "es" : ""} disponible{luchadoresFiltrados.length !== 1 ? "s" : ""}
            </span>
            {luchadoresFiltrados.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs text-primary hover:text-primary/80"
                onClick={toggleSelectAll}
              >
                {selectedIds.size === luchadoresFiltrados.length
                  ? "Desmarcar todos"
                  : "Seleccionar todos"}
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 max-h-100">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Cargando peleadores...
            </div>
          ) : luchadoresFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground gap-2">
              <Users className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm font-medium">
                {search
                  ? "No se encontraron peleadores que coincidan con la búsqueda."
                  : "Todos los peleadores registrados ya están marcados como exportados."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {luchadoresFiltrados.map((luchador) => {
                const isSelected = selectedIds.has(luchador.id);
                const apodoText = luchador.apodo.trim()
                  ? ` "${luchador.apodo.trim()}" `
                  : " ";
                const fullName = `${luchador.nombre}${apodoText}${luchador.apellido}`;

                return (
                  <div
                    key={luchador.id}
                    onClick={() => toggleSelect(luchador.id)}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-xs"
                        : "border-border hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                          isSelected
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-muted-foreground/40"
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-tight">
                          {fullName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Equipo: {luchador.equipo?.nombre || "Sin equipo"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleAddSelected}
            disabled={isSubmitting || selectedIds.size === 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Agregando...
              </>
            ) : (
              `Agregar (${selectedIds.size}) a Exportación`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
