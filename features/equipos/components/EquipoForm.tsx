"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { PAISES, CIUDADES } from "@/config/paises";
import type { EquipoFormData } from "../zod";

interface EquipoFormProps {
  formId: string;
  initialData?: EquipoFormData;
  onSubmit: (data: EquipoFormData) => void;
  isPending?: boolean;
}

export function EquipoForm({
  formId,
  initialData,
  onSubmit,
  isPending = false,
}: EquipoFormProps) {
  const [form, setForm] = useState<EquipoFormData>({
    nombre: initialData?.nombre ?? "",
    pais: initialData?.pais ?? "",
    ciudad: initialData?.ciudad ?? "",
  });

  function setField<K extends keyof EquipoFormData>(
    key: K,
    value: EquipoFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 px-6 py-5"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${formId}-nombre`}>
          Nombre del equipo{" "}
          <span className="text-destructive" aria-hidden>
            *
          </span>
        </Label>
        <Input
          id={`${formId}-nombre`}
          placeholder="Ej: Team Fenix"
          required
          maxLength={100}
          disabled={isPending}
          value={form.nombre}
          onChange={(e) => setField("nombre", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${formId}-pais`}>
            País{" "}
            <span className="text-destructive" aria-hidden>
              *
            </span>
          </Label>
          <NativeSelect
            id={`${formId}-pais`}
            required
            className="w-full"
            disabled={isPending}
            value={form.pais}
            onChange={(e) => setField("pais", e.target.value)}
          >
            <NativeSelectOption value="">Seleccionar</NativeSelectOption>
            {PAISES.map((p) => (
              <NativeSelectOption key={p} value={p}>
                {p}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${formId}-ciudad`}>
            Ciudad{" "}
            <span className="text-destructive" aria-hidden>
              *
            </span>
          </Label>
          <NativeSelect
            id={`${formId}-ciudad`}
            required
            className="w-full"
            disabled={isPending}
            value={form.ciudad}
            onChange={(e) => setField("ciudad", e.target.value)}
          >
            <NativeSelectOption value="">Seleccionar</NativeSelectOption>
            {CIUDADES.map((c) => (
              <NativeSelectOption key={c} value={c}>
                {c}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </div>
    </form>
  );
}
