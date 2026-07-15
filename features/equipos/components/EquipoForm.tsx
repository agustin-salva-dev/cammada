"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationSelect } from "@/components/ui/location-select";
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

      <LocationSelect
        formId={formId}
        pais={form.pais}
        ciudad={form.ciudad}
        onPaisChange={(nuevoPais, newCiudad) =>
          setForm((prev) => ({ ...prev, pais: nuevoPais, ciudad: newCiudad }))
        }
        onCiudadChange={(newCiudad) => setField("ciudad", newCiudad)}
        disabled={isPending}
        required
      />
    </form>
  );
}
