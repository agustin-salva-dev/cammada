import * as React from "react";
import { Filter, ChevronDown, ChevronUp, X, Medal } from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import type { SearchableSelectOption } from "@/components/ui/searchable-select";
import { ALL_FILTER_KEY } from "../../utils/eventHelpers";
import { FilterPill } from "./FilterPill";

interface CarteleraFilterBarProps {
  totalCombates: number;
  filteredCombatesCount: number;
  isFiltersExpanded: boolean;
  setIsFiltersExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  hasActiveFilters: boolean;
  clearAll: () => void;
  peleadorId: string;
  setPeleadorId: (v: string) => void;
  peleadorOptions: SearchableSelectOption[];
  equipoId: string;
  setEquipoId: (v: string) => void;
  equipoOptions: SearchableSelectOption[];
  categoriaId: string;
  setCategoriaId: (v: string) => void;
  categoriaOptions: SearchableSelectOption[];
  modalidadBase: string;
  setModalidadBase: (v: string) => void;
  modalidadOptions: SearchableSelectOption[];
  viaVictoria: string;
  setViaVictoria: (v: string) => void;
  viaVictoriaOptions: SearchableSelectOption[];
  soloTitulo: boolean;
  setSoloTitulo: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CarteleraFilterBar({
  totalCombates,
  filteredCombatesCount,
  isFiltersExpanded,
  setIsFiltersExpanded,
  hasActiveFilters,
  clearAll,
  peleadorId,
  setPeleadorId,
  peleadorOptions,
  equipoId,
  setEquipoId,
  equipoOptions,
  categoriaId,
  setCategoriaId,
  categoriaOptions,
  modalidadBase,
  setModalidadBase,
  modalidadOptions,
  viaVictoria,
  setViaVictoria,
  viaVictoriaOptions,
  soloTitulo,
  setSoloTitulo,
}: CarteleraFilterBarProps) {
  return (
    <div className="relative z-30 rounded-2xl border border-white/5 bg-white/2 p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setIsFiltersExpanded((p) => !p)}
          className="flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer select-none"
        >
          <Filter size={14} className="text-primary" />
          <span>Filtrar cartelera</span>
          {filteredCombatesCount !== totalCombates && (
            <span className="text-[11px] sm:text-xs text-muted-foreground font-normal">
              ({filteredCombatesCount} de {totalCombates} peleas)
            </span>
          )}
          {isFiltersExpanded ? (
            <ChevronUp size={14} className="text-muted-foreground ml-1" />
          ) : (
            <ChevronDown size={14} className="text-muted-foreground ml-1" />
          )}
        </button>

        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
            >
              <X size={12} />
              Limpiar todo
            </button>
          )}
        </div>
      </div>

      {isFiltersExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3">
          <SearchableSelect
            value={peleadorId}
            onValueChange={setPeleadorId}
            options={peleadorOptions}
            placeholder="Peleador"
            searchPlaceholder="Buscar peleador..."
          />
          <SearchableSelect
            value={equipoId}
            onValueChange={setEquipoId}
            options={equipoOptions}
            placeholder="Equipo"
            searchPlaceholder="Buscar equipo..."
          />
          <SearchableSelect
            value={categoriaId}
            onValueChange={setCategoriaId}
            options={categoriaOptions}
            placeholder="Categoría de peso"
            searchPlaceholder="Buscar categoría..."
          />
          <SearchableSelect
            value={modalidadBase}
            onValueChange={setModalidadBase}
            options={modalidadOptions}
            placeholder="Modalidad"
            searchPlaceholder="Buscar modalidad..."
          />
          {viaVictoriaOptions.length > 0 && (
            <SearchableSelect
              value={viaVictoria}
              onValueChange={setViaVictoria}
              options={viaVictoriaOptions}
              placeholder="Vía de victoria"
              searchPlaceholder="Buscar vía..."
            />
          )}

          <button
            type="button"
            onClick={() => setSoloTitulo((p) => !p)}
            className={`flex items-center justify-center gap-2 h-9 px-3 rounded-md border text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
              soloTitulo
                ? "bg-yellow-500/15 border-yellow-500/40 text-yellow-400"
                : "border-input bg-transparent text-muted-foreground hover:text-foreground dark:bg-input/30 dark:hover:bg-input/50"
            }`}
          >
            <Medal size={14} />
            Solo peleas por título
          </button>
        </div>
      )}

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {peleadorId !== ALL_FILTER_KEY && (
            <FilterPill
              label={
                peleadorOptions.find((o) => o.value === peleadorId)?.label ??
                peleadorId
              }
              active
              onClear={() => setPeleadorId(ALL_FILTER_KEY)}
            />
          )}
          {equipoId !== ALL_FILTER_KEY && (
            <FilterPill
              label={equipoId}
              active
              onClear={() => setEquipoId(ALL_FILTER_KEY)}
            />
          )}
          {categoriaId !== ALL_FILTER_KEY && (
            <FilterPill
              label={
                categoriaOptions.find((o) => o.value === categoriaId)?.label ??
                categoriaId
              }
              active
              onClear={() => setCategoriaId(ALL_FILTER_KEY)}
            />
          )}
          {modalidadBase !== ALL_FILTER_KEY && (
            <FilterPill
              label={modalidadBase}
              active
              onClear={() => setModalidadBase(ALL_FILTER_KEY)}
            />
          )}
          {viaVictoria !== ALL_FILTER_KEY && (
            <FilterPill
              label={viaVictoria}
              active
              onClear={() => setViaVictoria(ALL_FILTER_KEY)}
            />
          )}
          {soloTitulo && (
            <FilterPill
              label="Solo por título 🏆"
              active
              onClear={() => setSoloTitulo(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}
