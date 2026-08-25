"use client";

import * as React from "react";
import { Search, X, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";
import { CardEquipo } from "../cards/CardEquipo";

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

  const paises = React.useMemo(() => {
    return Array.from(new Set(equipos.map((e) => e.pais).filter(Boolean))).sort(
      (a, b) => a.localeCompare(b),
    );
  }, [equipos]);

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

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter((e) => e.nombre.toLowerCase().includes(query));
    }

    if (selectedPais) {
      result = result.filter((e) => e.pais === selectedPais);
    }

    if (selectedCiudad) {
      result = result.filter((e) => e.ciudad === selectedCiudad);
    }

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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar equipo por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <NativeSelect
          value={selectedPais}
          onChange={(e) => handlePaisChange(e.target.value)}
          className="w-full md:w-44"
        >
          <NativeSelectOption value="">Todos los países</NativeSelectOption>
          {paises.map((pais) => (
            <NativeSelectOption key={pais} value={pais}>
              {pais}
            </NativeSelectOption>
          ))}
        </NativeSelect>

        <NativeSelect
          value={selectedCiudad}
          onChange={(e) => setSelectedCiudad(e.target.value)}
          className="w-full md:w-44"
          disabled={ciudades.length === 0}
        >
          <NativeSelectOption value="">Todas las ciudades</NativeSelectOption>
          {ciudades.map((ciudad) => (
            <NativeSelectOption key={ciudad} value={ciudad}>
              {ciudad}
            </NativeSelectOption>
          ))}
        </NativeSelect>

        <NativeSelect
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full md:w-48"
        >
          <NativeSelectOption value="nombre-asc">Nombre A-Z</NativeSelectOption>
          <NativeSelectOption value="nombre-desc">
            Nombre Z-A
          </NativeSelectOption>
          <NativeSelectOption value="luchadores-desc">
            Más luchadores
          </NativeSelectOption>
          <NativeSelectOption value="luchadores-asc">
            Menos luchadores
          </NativeSelectOption>
        </NativeSelect>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Mostrando {filteredAndSortedEquipos.length} de {equipos.length}{" "}
          equipos
        </span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-auto p-0 text-primary hover:text-primary/80"
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      {filteredAndSortedEquipos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-3">
          <Users className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-base font-medium">No se encontraron equipos</p>
          <p className="text-xs">
            {hasActiveFilters
              ? "Probá modificando los filtros de búsqueda."
              : "Aún no hay equipos registrados en el sistema."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
