"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Trophy, Users, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardPrediccionCombate } from "./CardPrediccionCombate";
import { EmptyStatePredicciones } from "./EmptyStatePredicciones";
import { PrediccionesFilterBar } from "./PrediccionesFilterBar";
import type {
  EventoPrediccionPublico,
  SelectorEventoPrediccion,
} from "@/features/predicciones/types";
import { TIPO_COMBATE_PREDICCION_LABEL } from "@/features/predicciones/constants";
import type { TipoCombateConPrediccion } from "@/features/predicciones/constants";
import {
  PREDICCIONES_FILTER_DEFAULTS,
  type PrediccionesFilterState,
  extraerOpcionesFiltros,
  filtrarCombatesPrediccion,
} from "../../utils/predicciones-filters";

const ORDEN_TIPOS: TipoCombateConPrediccion[] = [
  "ESTELAR",
  "CO_ESTELAR",
  "CARTELERA_PRINCIPAL",
];

interface PrediccionesPublicClientProps {
  eventos: SelectorEventoPrediccion[];
  eventoInicial: EventoPrediccionPublico | null;
}

function formatFecha(fecha: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(fecha));
}

export function PrediccionesPublicClient({
  eventos,
  eventoInicial,
}: PrediccionesPublicClientProps) {
  const [eventoActual, setEventoActual] =
    useState<EventoPrediccionPublico | null>(eventoInicial);
  const [eventoIdSeleccionado, setEventoIdSeleccionado] = useState<
    string | null
  >(eventoInicial?.id ?? null);
  const [cargando, setCargando] = useState(false);
  const [filters, setFilters] = useState<PrediccionesFilterState>(
    PREDICCIONES_FILTER_DEFAULTS,
  );

  const combatesOriginales = useMemo(
    () => eventoActual?.combates ?? [],
    [eventoActual],
  );

  const { equipos, ciudades } = useMemo(
    () => extraerOpcionesFiltros(combatesOriginales),
    [combatesOriginales],
  );

  const combatesFiltrados = useMemo(
    () => filtrarCombatesPrediccion(combatesOriginales, filters),
    [combatesOriginales, filters],
  );

  if (eventos.length === 0) {
    return <EmptyStatePredicciones />;
  }

  async function handleSeleccionarEvento(id: string) {
    if (id === eventoIdSeleccionado || cargando) return;
    setCargando(true);
    setEventoIdSeleccionado(id);
    setFilters(PREDICCIONES_FILTER_DEFAULTS);

    try {
      const res = await fetch(`/api/predicciones/evento/${id}`);
      if (res.ok) {
        const data = await res.json();
        setEventoActual(data);
      }
    } finally {
      setCargando(false);
    }
  }

  const combatesAgrupados = ORDEN_TIPOS.map((tipo) => ({
    tipo,
    label: TIPO_COMBATE_PREDICCION_LABEL[tipo],
    combates: combatesFiltrados.filter((c) => c.tipo === tipo),
  })).filter((g) => g.combates.length > 0);

  const hasCombatesOriginales = combatesOriginales.length > 0;
  const isFiltered =
    filters.searchQuery !== "" ||
    filters.selectedEquipo !== "all" ||
    filters.selectedCiudad !== "all";

  return (
    <div className="space-y-8 sm:space-y-10 animate-fade-in">
      {eventos.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
          id="selector-eventos-predicciones"
        >
          {eventos.map((e) => (
            <button
              key={e.id}
              id={`btn-evento-${e.id}`}
              onClick={() => handleSeleccionarEvento(e.id)}
              disabled={cargando}
              className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${
                eventoIdSeleccionado === e.id
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground"
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5 shrink-0" />
              <span>Fight Session #{e.numero}</span>
              {e.estado === "FINALIZADO" && (
                <span className="text-[10px] text-muted-foreground/60">
                  (Finalizado)
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {!hasCombatesOriginales && <EmptyStatePredicciones />}

      {hasCombatesOriginales && (
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm">
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span className="font-medium">
              Fight Session #{eventoActual?.numero}
            </span>
            <span className="text-muted-foreground text-xs">·</span>
            <span className="text-muted-foreground text-xs">
              {eventoActual ? formatFecha(eventoActual.fecha) : ""}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span className="text-muted-foreground text-xs">
              {eventoActual?.totalVotosEvento.toLocaleString("es-AR")} votos
              totales
            </span>
          </div>
        </div>
      )}

      {hasCombatesOriginales && (
        <PrediccionesFilterBar
          filters={filters}
          onFilterChange={setFilters}
          equipos={equipos}
          ciudades={ciudades}
          totalResultados={combatesFiltrados.length}
          totalOriginal={combatesOriginales.length}
        />
      )}

      {hasCombatesOriginales && combatesFiltrados.length === 0 && (
        <div
          id="sin-resultados-predicciones"
          className="flex flex-col items-center justify-center text-center py-14 px-4 gap-4 rounded-2xl border border-white/10 bg-white/5"
        >
          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
            <SearchX className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="font-bold text-base text-foreground">
              No se encontraron combates
            </h3>
            <p className="text-xs text-muted-foreground">
              {isFiltered
                ? "No hay enfrentamientos que coincidan con los filtros o la búsqueda ingresada."
                : "No hay combates disponibles en este momento."}
            </p>
          </div>
          {isFiltered && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters(PREDICCIONES_FILTER_DEFAULTS)}
              className="text-xs rounded-xl border-white/10 hover:bg-white/10 cursor-pointer"
            >
              Restablecer filtros
            </Button>
          )}
        </div>
      )}

      {combatesAgrupados.map(({ tipo, label, combates }) => (
        <section
          key={tipo}
          className="space-y-4"
          id={`seccion-${tipo.toLowerCase()}`}
        >
          <div className="flex items-center gap-3">
            <h2 className="text-base sm:text-lg font-bold">{label}</h2>
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-muted-foreground">
              {combates.length} pelea{combates.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {combates.map((combate) => (
              <CardPrediccionCombate key={combate.id} combate={combate} />
            ))}
          </div>
        </section>
      ))}

      {cargando && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 pointer-events-none">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  );
}
