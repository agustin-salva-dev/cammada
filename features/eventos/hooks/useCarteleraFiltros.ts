import * as React from "react";
import type { SearchableSelectOption } from "@/components/ui/searchable-select";
import type { CombatePublicoDetalle } from "@/features/eventos/queries";
import {
  ALL_FILTER_KEY,
  TIPO_ORDER,
  type TipoKey,
  getBaseName,
  toOption,
} from "../utils/eventHelpers";

export function useCarteleraFiltros(combates: CombatePublicoDetalle[]) {
  const [isFiltersExpanded, setIsFiltersExpanded] = React.useState(true);

  const [peleadorId, setPeleadorId] = React.useState(ALL_FILTER_KEY);
  const [equipoId, setEquipoId] = React.useState(ALL_FILTER_KEY);
  const [categoriaId, setCategoriaId] = React.useState(ALL_FILTER_KEY);
  const [modalidadBase, setModalidadBase] = React.useState(ALL_FILTER_KEY);
  const [viaVictoria, setViaVictoria] = React.useState(ALL_FILTER_KEY);
  const [soloTitulo, setSoloTitulo] = React.useState(false);

  const peleadorOptions = React.useMemo<SearchableSelectOption[]>(() => {
    const seen = new Set<string>();
    const opts: SearchableSelectOption[] = [
      toOption(ALL_FILTER_KEY, "Todos los peleadores"),
    ];
    combates.forEach((c) => {
      for (const p of [c.peleador1, c.peleador2]) {
        if (!seen.has(p.id)) {
          seen.add(p.id);
          const apodo = p.apodo ? ` "${p.apodo}"` : "";
          opts.push(toOption(p.id, `${p.nombre}${apodo} ${p.apellido}`));
        }
      }
    });
    return opts;
  }, [combates]);

  const equipoOptions = React.useMemo<SearchableSelectOption[]>(() => {
    const seen = new Map<string, string>();
    combates.forEach((c) => {
      for (const p of [c.peleador1, c.peleador2]) {
        if (p.equipo && !seen.has(p.equipo.nombre)) {
          seen.set(p.equipo.nombre, p.equipo.nombre);
        }
      }
    });
    return [
      toOption(ALL_FILTER_KEY, "Todos los equipos"),
      ...[...seen.entries()].map(([k, v]) => toOption(k, v)),
    ];
  }, [combates]);

  const categoriaOptions = React.useMemo<SearchableSelectOption[]>(() => {
    const seen = new Map<string, string>();
    combates.forEach((c) => {
      if (!seen.has(c.categoriaPeso.id)) {
        seen.set(c.categoriaPeso.id, c.categoriaPeso.nombre);
      }
    });
    return [
      toOption(ALL_FILTER_KEY, "Todas las categorías"),
      ...[...seen.entries()].map(([k, v]) => toOption(k, v)),
    ];
  }, [combates]);

  const modalidadOptions = React.useMemo<SearchableSelectOption[]>(() => {
    const seen = new Set<string>();
    combates.forEach((c) => {
      const base = getBaseName(c.modalidad.nombre);
      seen.add(base);
    });
    return [
      toOption(ALL_FILTER_KEY, "Todas las modalidades"),
      ...[...seen].map((name) => toOption(name, name)),
    ];
  }, [combates]);

  const viaVictoriaOptions = React.useMemo<SearchableSelectOption[]>(() => {
    const seen = new Set<string>();
    combates.forEach((c) => {
      if (c.viaVictoria) seen.add(c.viaVictoria);
    });
    if (seen.size === 0) return [];
    return [
      toOption(ALL_FILTER_KEY, "Todas las vías"),
      ...[...seen].map((v) => toOption(v, v)),
    ];
  }, [combates]);

  const filtered = React.useMemo(() => {
    return combates.filter((c) => {
      if (
        peleadorId !== ALL_FILTER_KEY &&
        c.peleador1.id !== peleadorId &&
        c.peleador2.id !== peleadorId
      )
        return false;
      if (
        equipoId !== ALL_FILTER_KEY &&
        c.peleador1.equipo?.nombre !== equipoId &&
        c.peleador2.equipo?.nombre !== equipoId
      )
        return false;
      if (categoriaId !== ALL_FILTER_KEY && c.categoriaPeso.id !== categoriaId)
        return false;
      if (
        modalidadBase !== ALL_FILTER_KEY &&
        getBaseName(c.modalidad.nombre) !== modalidadBase
      )
        return false;
      if (viaVictoria !== ALL_FILTER_KEY && c.viaVictoria !== viaVictoria)
        return false;
      if (soloTitulo && !c.titulo) return false;
      return true;
    });
  }, [
    combates,
    peleadorId,
    equipoId,
    categoriaId,
    modalidadBase,
    viaVictoria,
    soloTitulo,
  ]);

  const combatesPorTipo = React.useMemo(() => {
    return TIPO_ORDER.reduce(
      (acc, tipo) => {
        acc[tipo] = filtered.filter((c) => c.tipo === tipo);
        return acc;
      },
      {} as Record<TipoKey, CombatePublicoDetalle[]>,
    );
  }, [filtered]);

  const hasActiveFilters =
    peleadorId !== ALL_FILTER_KEY ||
    equipoId !== ALL_FILTER_KEY ||
    categoriaId !== ALL_FILTER_KEY ||
    modalidadBase !== ALL_FILTER_KEY ||
    viaVictoria !== ALL_FILTER_KEY ||
    soloTitulo;

  const clearAll = () => {
    setPeleadorId(ALL_FILTER_KEY);
    setEquipoId(ALL_FILTER_KEY);
    setCategoriaId(ALL_FILTER_KEY);
    setModalidadBase(ALL_FILTER_KEY);
    setViaVictoria(ALL_FILTER_KEY);
    setSoloTitulo(false);
  };

  return {
    isFiltersExpanded,
    setIsFiltersExpanded,
    peleadorId,
    setPeleadorId,
    equipoId,
    setEquipoId,
    categoriaId,
    setCategoriaId,
    modalidadBase,
    setModalidadBase,
    viaVictoria,
    setViaVictoria,
    soloTitulo,
    setSoloTitulo,
    peleadorOptions,
    equipoOptions,
    categoriaOptions,
    modalidadOptions,
    viaVictoriaOptions,
    filtered,
    combatesPorTipo,
    hasActiveFilters,
    clearAll,
  };
}
