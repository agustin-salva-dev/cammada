"use client";

import { useState, useMemo } from "react";
import { Plus, Download, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MyBadge } from "@/components/ui/MyBadge";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { CardCombate } from "./CardCombate";
import { ModalCombate } from "./ModalCombate";
import {
  ESTADOS_COMBATE,
  TIPOS_COMBATE,
  ESTADO_COMBATE_LABELS,
  TIPO_COMBATE_LABELS,
  type EstadoCombate,
  type TipoCombate,
} from "../zod";
import type {
  LuchadorOption,
  EventoOption,
  CategoriaOption,
  ModalidadOption,
} from "./CombateForm";
import type { CombateDetalleData } from "./ModalDetalleCombate";
import { IconButtonConfig } from "@/constants/ui";

export type CombateCompleto = CombateDetalleData & {
  id: string;
  peleador1Id: string;
  peleador2Id: string;
  rounds: number;
  duracionRounds: number;
  eventoId: string;
  tipo: TipoCombate;
  numeroPelea: number;
  horarioEstimado?: string | null;
  categoriaPesoId: string;
  modalidadId: string;
  titulo: boolean;
  estado: EstadoCombate;
  ganadorId?: string | null;
  viaVictoria?: string | null;
  roundFin?: number | null;
  minutoFin?: number | null;
  segundoFin?: number | null;
};

interface CombatesClientProps {
  combates: CombateCompleto[];
  luchadores: LuchadorOption[];
  eventos: EventoOption[];
  categorias: CategoriaOption[];
  modalidades: ModalidadOption[];
}

export function CombatesClient({
  combates,
  luchadores,
  eventos,
  categorias,
  modalidades,
}: CombatesClientProps) {
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState<EstadoCombate | "">("");
  const [filterTipo, setFilterTipo] = useState<TipoCombate | "">("");
  const [filterEventoId, setFilterEventoId] = useState("");
  const [filterCategoriaId, setFilterCategoriaId] = useState("");
  const [filterModalidadId, setFilterModalidadId] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const activeFiltersCount = [
    filterEstado,
    filterTipo,
    filterEventoId,
    filterCategoriaId,
    filterModalidadId,
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    return combates.filter((c) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const p1 =
          `${c.peleador1.nombre} ${c.peleador1.apellido} ${c.peleador1.apodo}`.toLowerCase();
        const p2 =
          `${c.peleador2.nombre} ${c.peleador2.apellido} ${c.peleador2.apodo}`.toLowerCase();
        if (!p1.includes(q) && !p2.includes(q)) return false;
      }
      if (filterEstado && c.estado !== filterEstado) return false;
      if (filterTipo && c.tipo !== filterTipo) return false;
      if (filterEventoId && c.eventoId !== filterEventoId) return false;
      if (filterCategoriaId && c.categoriaPesoId !== filterCategoriaId)
        return false;
      if (filterModalidadId && c.modalidadId !== filterModalidadId)
        return false;

      return true;
    });
  }, [
    combates,
    search,
    filterEstado,
    filterTipo,
    filterEventoId,
    filterCategoriaId,
    filterModalidadId,
  ]);

  function clearFilters() {
    setFilterEstado("");
    setFilterTipo("");
    setFilterEventoId("");
    setFilterCategoriaId("");
    setFilterModalidadId("");
    setSearch("");
  }

  if (combates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/20 p-12 text-center backdrop-blur-sm min-h-[300px]">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
          <svg
            className="h-7 w-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          No hay combates registrados
        </h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Comenzá creando el primer combate para organizar la cartelera de tus
          eventos.
        </p>
        <ModalCombate
          luchadores={luchadores}
          eventos={eventos}
          categorias={categorias}
          modalidades={modalidades}
          trigger={
            <Button className="mt-6 shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Crear primer combate
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar por peleador..."
            className="pl-9 border-border/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Button
          variant="outline"
          className="border-border/50 hover:bg-muted/50 shrink-0"
          onClick={() => setShowFilters((v) => !v)}
        >
          <SlidersHorizontal
            className="h-4 w-4 mr-2"
            strokeWidth={IconButtonConfig.strokeWidth}
          />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {activeFiltersCount}
            </span>
          )}
        </Button>

        <Button
          variant="outline"
          className="border-border/50 hover:bg-muted/50 shrink-0"
          disabled
          title="Disponible próximamente"
        >
          <Download
            strokeWidth={IconButtonConfig.strokeWidth}
            className="mr-2 h-4 w-4"
          />
          Exportar
        </Button>

        <ModalCombate
          luchadores={luchadores}
          eventos={eventos}
          categorias={categorias}
          modalidades={modalidades}
          trigger={
            <Button className="shadow-md shadow-primary/10 shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo combate
            </Button>
          }
        />
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3 rounded-lg border border-border/50 bg-card/30 p-4 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Estado
            </label>
            <NativeSelect
              value={filterEstado}
              onChange={(e) =>
                setFilterEstado(e.target.value as EstadoCombate | "")
              }
              className="h-8 text-sm"
            >
              <NativeSelectOption value="">
                Todos los estados
              </NativeSelectOption>
              {ESTADOS_COMBATE.map((e) => (
                <NativeSelectOption key={e} value={e}>
                  {ESTADO_COMBATE_LABELS[e]}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Tipo
            </label>
            <NativeSelect
              value={filterTipo}
              onChange={(e) =>
                setFilterTipo(e.target.value as TipoCombate | "")
              }
              className="h-8 text-sm"
            >
              <NativeSelectOption value="">Todos los tipos</NativeSelectOption>
              {TIPOS_COMBATE.map((t) => (
                <NativeSelectOption key={t} value={t}>
                  {TIPO_COMBATE_LABELS[t]}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Evento
            </label>
            <NativeSelect
              value={filterEventoId}
              onChange={(e) => setFilterEventoId(e.target.value)}
              className="h-8 text-sm"
            >
              <NativeSelectOption value="">
                Todos los eventos
              </NativeSelectOption>
              {eventos.map((ev) => (
                <NativeSelectOption key={ev.id} value={ev.id}>
                  Evento #{ev.numero}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Categoría de Peso
            </label>
            <NativeSelect
              value={filterCategoriaId}
              onChange={(e) => setFilterCategoriaId(e.target.value)}
              className="h-8 text-sm"
            >
              <NativeSelectOption value="">
                Todas las categorías
              </NativeSelectOption>
              {categorias.map((cat) => (
                <NativeSelectOption key={cat.id} value={cat.id}>
                  {cat.nombre}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Modalidad
            </label>
            <NativeSelect
              value={filterModalidadId}
              onChange={(e) => setFilterModalidadId(e.target.value)}
              className="h-8 text-sm"
            >
              <NativeSelectOption value="">
                Todas las modalidades
              </NativeSelectOption>
              {modalidades.map((mod) => (
                <NativeSelectOption key={mod.id} value={mod.id}>
                  {mod.nombre}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          {activeFiltersCount > 0 && (
            <div className="flex items-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Limpiar
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length === combates.length
            ? `${combates.length} combate${combates.length !== 1 ? "s" : ""}`
            : `${filtered.length} de ${combates.length} combate${combates.length !== 1 ? "s" : ""}`}
        </p>
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">
              Filtros activos:
            </span>
            {filterEstado && (
              <MyBadge
                variant="secondary"
                text={ESTADO_COMBATE_LABELS[filterEstado]}
              />
            )}
            {filterTipo && (
              <MyBadge
                variant="secondary"
                text={TIPO_COMBATE_LABELS[filterTipo]}
              />
            )}
            {filterEventoId && (
              <MyBadge
                variant="secondary"
                text={`Evento #${eventos.find((e) => e.id === filterEventoId)?.numero}`}
              />
            )}
            {filterCategoriaId && (
              <MyBadge
                variant="secondary"
                text={
                  categorias.find((c) => c.id === filterCategoriaId)?.nombre ||
                  ""
                }
              />
            )}
            {filterModalidadId && (
              <MyBadge
                variant="secondary"
                text={
                  modalidades.find((m) => m.id === filterModalidadId)?.nombre ||
                  ""
                }
              />
            )}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/40 bg-card/10 p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No se encontraron combates con los filtros aplicados.
          </p>
          <Button
            variant="link"
            size="sm"
            className="mt-2"
            onClick={clearFilters}
          >
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((combate) => (
            <CardCombate
              key={combate.id}
              combate={combate}
              luchadores={luchadores}
              eventos={eventos}
              categorias={categorias}
              modalidades={modalidades}
            />
          ))}
        </div>
      )}
    </div>
  );
}
