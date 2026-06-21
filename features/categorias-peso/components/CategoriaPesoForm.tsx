"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CategoriaPesoFormData } from "../zod";

interface CategoriaPesoFormProps {
  formId: string;
  initialData?: CategoriaPesoFormData;
  onSubmit: (data: CategoriaPesoFormData) => void;
  isPending?: boolean;
  /** Siguiente orden disponible (para nuevas categorías) */
  nextOrden?: number;
}

export function CategoriaPesoForm({
  formId,
  initialData,
  onSubmit,
  isPending = false,
  nextOrden = 0,
}: CategoriaPesoFormProps) {
  const [form, setForm] = useState<CategoriaPesoFormData>({
    nombre: initialData?.nombre ?? "",
    orden: initialData?.orden ?? nextOrden,
    limiteInferior: initialData?.limiteInferior ?? null,
    limiteSuperior: initialData?.limiteSuperior ?? null,
  });

  function setField<K extends keyof CategoriaPesoFormData>(
    key: K,
    value: CategoriaPesoFormData[K],
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
          Nombre de la categoría{" "}
          <span className="text-destructive" aria-hidden>
            *
          </span>
        </Label>
        <Input
          id={`${formId}-nombre`}
          placeholder="Ej: Mediano"
          required
          maxLength={60}
          disabled={isPending}
          value={form.nombre}
          onChange={(e) => setField("nombre", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${formId}-orden`}>
            Orden{" "}
            <span className="text-destructive" aria-hidden>
              *
            </span>
          </Label>
          <Input
            id={`${formId}-orden`}
            type="number"
            min={0}
            placeholder="Ej: 5"
            required
            disabled={isPending}
            value={form.orden}
            onChange={(e) =>
              setField("orden", Math.max(0, Number(e.target.value)))
            }
          />
          <p className="text-xs text-muted-foreground">
            Define el orden de menor a mayor peso.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${formId}-limiteInferior`}>
            Desde (kg){" "}
            <span className="text-muted-foreground text-xs font-normal">
              (opcional)
            </span>
          </Label>
          <Input
            id={`${formId}-limiteInferior`}
            type="number"
            min={0}
            max={300}
            placeholder="Ej: 77"
            disabled={isPending}
            value={form.limiteInferior ?? ""}
            onChange={(e) =>
              setField(
                "limiteInferior",
                e.target.value ? Number(e.target.value) : null,
              )
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${formId}-limiteSuperior`}>
            Hasta (kg){" "}
            <span className="text-muted-foreground text-xs font-normal">
              (opcional)
            </span>
          </Label>
          <Input
            id={`${formId}-limiteSuperior`}
            type="number"
            min={0}
            max={300}
            placeholder="Ej: 84"
            disabled={isPending}
            value={form.limiteSuperior ?? ""}
            onChange={(e) =>
              setField(
                "limiteSuperior",
                e.target.value ? Number(e.target.value) : null,
              )
            }
          />
        </div>
      </div>
    </form>
  );
}
