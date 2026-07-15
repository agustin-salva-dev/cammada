"use client";

import * as React from "react";
import { Search, X, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";
import { CardEquipo } from "./CardEquipo";

interface Equipo {
  id: string;
  nombre: string;
  pais: string;
  ciudad: string;
  _count?: {
    luchadores: number;
  };
}

interface EquiposClientProps {
  equipos: Equipo[];
}

export function EquiposClient({ equipos }: EquiposClientProps) {
  const [search, setSearch] = React.useState("");
  const [selectedPais, setSelectedPais] = React.useState("");
  const [selectedCiudad, setSelectedCiudad] = React.useState("");
  const [sortBy, setSortBy] = React.useState("nombre-asc");

  // Obtener países únicos de los equipos cargados
  const paises = React.useMemo(() => {
    return Array.from(new Set(equipos.map((e) => e.pais).filter(Boolean))).sort(
      (a, b) => a.localeCompare(b),
    );
  }, [equipos]);

  // Obtener ciudades únicas (filtradas opcionalmente por país)
  const ciudades = React.useMemo(() => {
    const equiposFiltrados = selectedPais
      ? equipos.filter((e) => e.pais === selectedPais)
      : equipos;
    return Array.from(
      new Set(equiposFiltrados.map((e) => e.ciudad).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b));
  }, [equipos, selectedPais]);

  const handlePaisChange = (nuevoPais: string) => {
    setSelectedPais(nuevoPais);
    if (nuevoPais && selectedCiudad) {
      const esCompatible = equipos.some(
        (e) => e.pais === nuevoPais && e.ciudad === selectedCiudad,
      );
      if (!esCompatible) {
        setSelectedCiudad("");
      }
    }
  };

  const hasActiveFilters = search || selectedPais || selectedCiudad;

  const handleClearFilters = () => {
    setSearch("");
    setSelectedPais("");
    setSelectedCiudad("");
  };

  const filteredAndSortedEquipos = React.useMemo(() => {
    let result = [...equipos];

    // Búsqueda por nombre
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter((e) => e.nombre.toLowerCase().includes(query));
    }

    // Filtro por país
    if (selectedPais) {
      result = result.filter((e) => e.pais === selectedPais);
    }

    // Filtro por ciudad
    if (selectedCiudad) {
      result = result.filter((e) => e.ciudad === selectedCiudad);
    }

    // Ordenamiento
    result.sort((a, b) => {
      const countA = a._count?.luchadores ?? 0;
      const countB = b._count?.luchadores ?? 0;

      switch (sortBy) {
        case "nombre-asc":
          return a.nombre.localeCompare(b.nombre);
        case "nombre-desc":
          return b.nombre.localeCompare(a.nombre);
        case "luchadores-desc":
          return countB - countA;
        case "luchadores-asc":
          return countA - countB;
        default:
          return 0;
      }
    });

    return result;
  }, [equipos, search, selectedPais, selectedCiudad, sortBy]);

  return (
    <div className="flex flex-col gap-6">
      {/* Barra de Filtros */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Buscador */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search-equipos"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Filtro País */}
        <div className="min-w-[150px]">
          <NativeSelect
            aria-label="Filtrar por país"
            value={selectedPais}
            onChange={(e) => handlePaisChange(e.target.value)}
          >
            <NativeSelectOption value="">Todos los países</NativeSelectOption>
            {paises.map((p) => (
              <NativeSelectOption key={p} value={p}>
                {p}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        {/* Filtro Ciudad */}
        <div className="min-w-[150px]">
          <NativeSelect
            aria-label="Filtrar por ciudad o provincia"
            value={selectedCiudad}
            onChange={(e) => setSelectedCiudad(e.target.value)}
          >
            <NativeSelectOption value="">Todas las ciudades</NativeSelectOption>
            {ciudades.map((c) => (
              <NativeSelectOption key={c} value={c}>
                {c}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        {/* Ordenamiento */}
        <div className="min-w-[150px]">
          <NativeSelect
            aria-label="Ordenar equipos"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <NativeSelectOption value="nombre-asc">
              Nombre (A-Z)
            </NativeSelectOption>
            <NativeSelectOption value="nombre-desc">
              Nombre (Z-A)
            </NativeSelectOption>
            <NativeSelectOption value="luchadores-desc">
              Más luchadores
            </NativeSelectOption>
            <NativeSelectOption value="luchadores-asc">
              Menos luchadores
            </NativeSelectOption>
          </NativeSelect>
        </div>

        {/* Limpiar Filtros */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="h-9 px-3 text-muted-foreground hover:text-foreground"
          >
            <X className="mr-2 h-4 w-4" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Resultados */}
      {filteredAndSortedEquipos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/20 p-12 text-center backdrop-blur-sm min-h-[300px]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <Users className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            No se encontraron equipos
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Prueba ajustando los filtros o el término de búsqueda.
          </p>
          {hasActiveFilters && (
            <Button
              onClick={handleClearFilters}
              className="mt-6"
              variant="outline"
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedEquipos.map((equipo) => (
            <CardEquipo
              key={equipo.id}
              id={equipo.id}
              nombre={equipo.nombre}
              pais={equipo.pais}
              ciudad={equipo.ciudad}
              luchadoresCount={equipo._count?.luchadores ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
