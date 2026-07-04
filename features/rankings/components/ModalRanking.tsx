"use client";

import * as React from "react";
import { Search, UserPlus, Crown } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { RankingFighterList } from "./RankingFighterList";
import { createRanking, updateRankingItems } from "../actions";
import type {
  LuchadorSelectItem,
  ModalidadSelectItem,
  CategoriaPesoSelectItem,
  RankingItemDraft,
} from "../types";

// ─── Constantes ───────────────────────────────────────────────────────────────

const LIBRA_X_LIBRA = "__LIBRA_X_LIBRA__";
const SUGGESTIONS_LIMIT = 5;
const SEARCH_RESULTS_LIMIT = 8;

// ─── Props ────────────────────────────────────────────────────────────────────

interface ModalRankingProps {
  trigger: React.ReactNode;
  luchadores: LuchadorSelectItem[];
  modalidades: ModalidadSelectItem[];
  categoriasPeso: CategoriaPesoSelectItem[];
  /** Cuando se pasa, el modal edita el ranking existente */
  ranking?: {
    id: string;
    modalidadId: string;
    categoriaPesoId: string | null;
    campeonId: string | null;
    items: RankingItemDraft[];
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function swapItems<T>(arr: T[], i: number, j: number): T[] {
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function normalizePositions(items: RankingItemDraft[]): RankingItemDraft[] {
  return items.map((item, idx) => ({ ...item, posicion: idx + 1 }));
}

function getApodo(apodo: string): string | null {
  if (!apodo || apodo.trim() === "" || apodo === "Sin apodo") return null;
  return apodo;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function ModalRanking({
  trigger,
  luchadores,
  modalidades,
  categoriasPeso,
  ranking,
}: ModalRankingProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const isEditing = !!ranking;

  // Form state
  const [modalidadId, setModalidadId] = React.useState(
    ranking?.modalidadId ?? ""
  );
  const [categoriaPesoId, setCategoriaPesoId] = React.useState<string>(
    ranking?.categoriaPesoId ?? LIBRA_X_LIBRA
  );
  const [campeonId, setCampeonId] = React.useState<string>(
    ranking?.campeonId ?? ""
  );
  const [rankingItems, setRankingItems] = React.useState<RankingItemDraft[]>(
    ranking?.items ?? []
  );
  const [search, setSearch] = React.useState("");

  // Reset al cerrar
  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setModalidadId(ranking?.modalidadId ?? "");
      setCategoriaPesoId(ranking?.categoriaPesoId ?? LIBRA_X_LIBRA);
      setCampeonId(ranking?.campeonId ?? "");
      setRankingItems(ranking?.items ?? []);
      setSearch("");
    }
  }

  // ─── Filtrado de luchadores ────────────────────────────────────────────────

  const isLibraXLibra = categoriaPesoId === LIBRA_X_LIBRA;
  const addedIds = new Set(rankingItems.map((i) => i.luchadorId));

  /** Luchadores de la categoría actual (se usa para sugerir campeones) */
  const luchadoresDeCategoria = React.useMemo(() => {
    return luchadores.filter((l) => {
      if (isLibraXLibra) return true;
      return l.categoriaId === categoriaPesoId;
    });
  }, [luchadores, categoriaPesoId, isLibraXLibra]);

  /** Luchadores disponibles para agregar (según categoría y no añadidos ya) */
  const availableByCat = React.useMemo(() => {
    return luchadoresDeCategoria.filter((l) => !addedIds.has(l.id));
  }, [luchadoresDeCategoria, addedIds]);

  /** Sugerencias iniciales (primeros 5 sin búsqueda activa) */
  const suggestions = React.useMemo(() => {
    if (search.trim()) return [];
    return availableByCat.slice(0, SUGGESTIONS_LIMIT);
  }, [availableByCat, search]);

  /** Resultados de búsqueda */
  const searchResults = React.useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return availableByCat
      .filter(
        (l) =>
          l.nombre.toLowerCase().includes(q) ||
          l.apellido.toLowerCase().includes(q) ||
          (l.apodo && l.apodo.toLowerCase().includes(q))
      )
      .slice(0, SEARCH_RESULTS_LIMIT);
  }, [availableByCat, search]);

  const displayedFighters = search.trim() ? searchResults : suggestions;

  // Si cambia la categoría y el campeón actual no pertenece a los luchadores de esa categoría, lo reseteamos
  React.useEffect(() => {
    if (campeonId) {
      const exists = luchadoresDeCategoria.some((l) => l.id === campeonId);
      if (!exists) {
        setCampeonId("");
      }
    }
  }, [categoriaPesoId, luchadoresDeCategoria, campeonId]);

  // ─── Acciones sobre la lista ───────────────────────────────────────────────

  function handleAddFighter(luchador: LuchadorSelectItem) {
    setRankingItems((prev) =>
      normalizePositions([
        ...prev,
        {
          luchadorId: luchador.id,
          nombre: luchador.nombre,
          apellido: luchador.apellido,
          apodo: luchador.apodo,
          posicion: prev.length + 1,
          equipo: luchador.equipo.nombre,
        },
      ])
    );
    setSearch("");
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    setRankingItems((prev) =>
      normalizePositions(swapItems(prev, index, index - 1))
    );
  }

  function handleMoveDown(index: number) {
    setRankingItems((prev) => {
      if (index >= prev.length - 1) return prev;
      return normalizePositions(swapItems(prev, index, index + 1));
    });
  }

  function handleRemove(index: number) {
    setRankingItems((prev) =>
      normalizePositions(prev.filter((_, i) => i !== index))
    );
  }

  // ─── Submit ────────────────────────────────────────────────────────────────

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!modalidadId) {
      toast.error("Debes seleccionar una modalidad.");
      return;
    }

    const payload = {
      modalidadId,
      categoriaPesoId: isLibraXLibra ? null : categoriaPesoId,
      campeonId: campeonId || null,
      items: rankingItems.map((item) => ({
        luchadorId: item.luchadorId,
        posicion: item.posicion,
      })),
    };

    startTransition(async () => {
      try {
        const result = isEditing
          ? await updateRankingItems(ranking.id, payload)
          : await createRanking(payload);

        if (result.success) {
          toast.success(
            isEditing
              ? "Ranking actualizado con éxito"
              : "Ranking creado con éxito",
            { position: "top-center" }
          );
          setOpen(false);
        } else {
          toast.error(result.error || "Ocurrió un error inesperado");
        }
      } catch {
        toast.error("Ocurrió un error inesperado al guardar el ranking.");
      }
    });
  }

  const formId = isEditing
    ? `form-edit-ranking-${ranking.id}`
    : "form-create-ranking";

  // Etiqueta del panel de peleadores disponibles
  const fighterPanelLabel = search.trim()
    ? `Resultados de búsqueda (${searchResults.length})`
    : `Sugerencias ${isLibraXLibra ? "(todos los pesos)" : ""}`;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="flex max-h-[90vh] w-full max-w-2xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-border px-6 pt-6 pb-4">
          <DialogTitle className="text-xl">
            {isEditing ? "Editar ranking" : "Nuevo ranking"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modificá la categoría, modalidad, campeón y el orden de los peleadores."
              : "Seleccioná la categoría, modalidad, campeón y agregá los peleadores al ranking."}
          </DialogDescription>
        </DialogHeader>

        <form
          id={formId}
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          {/* ── Configuración ── */}
          <div className="shrink-0 border-b border-border px-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Modalidad */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`${formId}-modalidad`}>
                  Modalidad{" "}
                  <span className="text-destructive" aria-hidden>
                    *
                  </span>
                </Label>
                <NativeSelect
                  id={`${formId}-modalidad`}
                  className="w-full"
                  value={modalidadId}
                  onChange={(e) => setModalidadId(e.target.value)}
                  disabled={isPending}
                  required
                >
                  <NativeSelectOption value="" disabled>
                    Seleccioná una modalidad
                  </NativeSelectOption>
                  {modalidades.map((m) => (
                    <NativeSelectOption key={m.id} value={m.id}>
                      {m.nombre}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>

              {/* Categoría de peso */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`${formId}-categoria`}>
                  Categoría de peso{" "}
                  <span className="text-muted-foreground text-xs font-normal">
                    (opcional)
                  </span>
                </Label>
                <NativeSelect
                  id={`${formId}-categoria`}
                  className="w-full"
                  value={categoriaPesoId}
                  onChange={(e) => {
                    setCategoriaPesoId(e.target.value);
                    // Limpiar búsqueda al cambiar categoría
                    setSearch("");
                  }}
                  disabled={isPending}
                >
                  <NativeSelectOption value={LIBRA_X_LIBRA}>
                    🏆 Libra por Libra
                  </NativeSelectOption>
                  {categoriasPeso.map((c) => (
                    <NativeSelectOption key={c.id} value={c.id}>
                      {c.nombre}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
            </div>

            {/* Campeón de la división */}
            <div className="mt-4 flex flex-col gap-1.5">
              <Label htmlFor={`${formId}-campeon`} className="flex items-center gap-1.5">
                <Crown className="h-4 w-4 text-yellow-500" />
                Campeón de la división
                <span className="text-muted-foreground text-xs font-normal">
                  (opcional)
                </span>
              </Label>
              <NativeSelect
                id={`${formId}-campeon`}
                className="w-full border-yellow-500/30 focus:border-yellow-500"
                value={campeonId}
                onChange={(e) => setCampeonId(e.target.value)}
                disabled={isPending}
              >
                <NativeSelectOption value="">
                  Sin Campeón (Vacante)
                </NativeSelectOption>
                {luchadoresDeCategoria.map((l) => {
                  const apodoStr = getApodo(l.apodo) ? ` "${getApodo(l.apodo)}"` : "";
                  return (
                    <NativeSelectOption key={l.id} value={l.id}>
                      {l.apellido}, {l.nombre}{apodoStr} ({l.equipo.nombre})
                    </NativeSelectOption>
                  );
                })}
              </NativeSelect>
            </div>
          </div>

          {/* ── Cuerpo scrolleable ── */}
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-4">
            {/* Buscador */}
            <div className="flex flex-col gap-2">
              <Label>Agregar peleador</Label>
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={
                    isLibraXLibra
                      ? "Buscar peleador (todos los pesos)..."
                      : "Buscar peleador de este peso..."
                  }
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                  disabled={isPending}
                />
              </div>

              {/* Panel de sugerencias / resultados */}
              {displayedFighters.length > 0 && (
                <div className="rounded-lg border border-border bg-card shadow-sm">
                  <p className="border-b border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                    {fighterPanelLabel}
                  </p>
                  <div className="max-h-40 overflow-y-auto">
                    {displayedFighters.map((l) => {
                      const apodo = getApodo(l.apodo);
                      return (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => handleAddFighter(l)}
                          disabled={isPending}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <UserPlus className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <span className="font-medium">
                            {l.apellido}, {l.nombre}
                          </span>
                          {apodo && (
                            <span className="text-muted-foreground">
                              &quot;{apodo}&quot;
                            </span>
                          )}
                          <span className="text-muted-foreground/60 text-xs">
                            ({l.equipo.nombre})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mensaje sin resultados (solo al buscar) */}
              {search.trim() && searchResults.length === 0 && (
                <p className="rounded-lg border border-dashed border-border/60 px-4 py-3 text-sm text-muted-foreground">
                  Sin resultados para &quot;{search}&quot;
                  {!isLibraXLibra && " en esta categoría de peso"}.
                </p>
              )}

              {/* Mensaje sin peleadores disponibles (sin búsqueda) */}
              {!search.trim() && availableByCat.length === 0 && (
                <p className="rounded-lg border border-dashed border-border/60 px-4 py-3 text-sm text-muted-foreground">
                  {isLibraXLibra
                    ? "No hay más peleadores disponibles para agregar."
                    : "No hay peleadores en esta categoría de peso disponibles para agregar."}
                </p>
              )}
            </div>

            <Separator />

            {/* Lista ordenada */}
            <div className="flex flex-col gap-2">
              <Label>
                Ranking ({rankingItems.length} peleador
                {rankingItems.length !== 1 ? "es" : ""})
              </Label>
              <RankingFighterList
                items={rankingItems}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onRemove={handleRemove}
                disabled={isPending}
              />
            </div>
          </div>
        </form>

        <DialogFooter className="shrink-0 border-t border-border px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" form={formId} disabled={isPending}>
            {isPending
              ? "Guardando..."
              : isEditing
                ? "Guardar cambios"
                : "Crear ranking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
