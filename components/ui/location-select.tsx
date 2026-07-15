"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  PAISES,
  UBICACIONES,
  DEPARTAMENTOS_SALTA,
  parsearUbicacion,
  construirValorCiudad,
} from "@/config/ubicaciones";

const PAISES_OPTIONS = PAISES.map((p) => ({ value: p, label: p }));

function getCiudadesOptions(pais: string) {
  return (UBICACIONES[pais] ?? []).map((c) => ({ value: c, label: c }));
}

const DEPARTAMENTOS_OPTIONS = DEPARTAMENTOS_SALTA.map((d) => ({
  value: d,
  label: d,
}));

interface LocationSelectProps {
  formId: string;
  pais: string;
  ciudad: string;
  onPaisChange: (pais: string, newCiudad: string) => void;
  onCiudadChange: (ciudad: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export function LocationSelect({
  formId,
  pais,
  ciudad,
  onPaisChange,
  onCiudadChange,
  disabled = false,
  required = false,
}: LocationSelectProps) {
  const { ciudad: ciudadRaw, departamento } = parsearUbicacion(ciudad);
  const isSalta = pais === "Argentina" && ciudadRaw === "Salta";

  const ciudadOptions = React.useMemo(() => getCiudadesOptions(pais), [pais]);

  function handlePaisChange(nuevoPais: string) {
    onPaisChange(nuevoPais, "");
  }

  function handleCiudadChange(nuevaCiudad: string) {
    if (pais === "Argentina" && nuevaCiudad === "Salta") {
      onCiudadChange("Salta");
    } else {
      onCiudadChange(nuevaCiudad);
    }
  }

  function handleDepartamentoChange(nuevoDep: string) {
    onCiudadChange(construirValorCiudad("Salta", nuevoDep));
  }

  const colsClass = isSalta ? "grid-cols-3" : "grid-cols-2";

  return (
    <div className={`grid gap-3 ${colsClass}`}>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${formId}-pais`}>
          País{" "}
          {required && (
            <span className="text-destructive" aria-hidden>
              *
            </span>
          )}
        </Label>
        <SearchableSelect
          id={`${formId}-pais`}
          value={pais}
          onValueChange={handlePaisChange}
          options={PAISES_OPTIONS}
          placeholder="Seleccionar país..."
          searchPlaceholder="Buscar país..."
          emptyText="País no encontrado."
          disabled={disabled}
          required={required}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${formId}-ciudad`}>
          {pais === "Argentina" ? "Provincia" : "Ciudad"}{" "}
          {required && pais !== "" && (
            <span className="text-destructive" aria-hidden>
              *
            </span>
          )}
        </Label>
        <SearchableSelect
          id={`${formId}-ciudad`}
          value={ciudadRaw}
          onValueChange={handleCiudadChange}
          options={ciudadOptions}
          placeholder={
            pais === ""
              ? "Seleccionar país primero..."
              : pais === "Argentina"
                ? "Seleccionar provincia..."
                : "Seleccionar ciudad..."
          }
          searchPlaceholder={
            pais === "Argentina" ? "Buscar provincia..." : "Buscar ciudad..."
          }
          emptyText="Sin resultados."
          disabled={disabled || pais === ""}
          required={required && pais !== ""}
        />
      </div>

      {isSalta && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${formId}-departamento`}>
            Departamento{" "}
            {required && (
              <span className="text-destructive" aria-hidden>
                *
              </span>
            )}
          </Label>
          <SearchableSelect
            id={`${formId}-departamento`}
            value={departamento}
            onValueChange={handleDepartamentoChange}
            options={DEPARTAMENTOS_OPTIONS}
            placeholder="Seleccionar departamento..."
            searchPlaceholder="Buscar departamento..."
            emptyText="Sin resultados."
            disabled={disabled}
            required={required}
          />
        </div>
      )}
    </div>
  );
}
