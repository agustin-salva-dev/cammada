"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ModalidadFormData } from "../zod";

interface ModalidadFormProps {
  formId: string;
  initialData?: ModalidadFormData;
  onSubmit: (data: ModalidadFormData) => void;
  isPending?: boolean;
}

export function ModalidadForm({
  formId,
  initialData,
  onSubmit,
  isPending = false,
}: ModalidadFormProps) {
  const [nombre, setNombre] = useState(initialData?.nombre ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ nombre });
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 px-6 py-5"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${formId}-nombre`}>
          Nombre de la modalidad{" "}
          <span className="text-destructive" aria-hidden>
            *
          </span>
        </Label>
        <Input
          id={`${formId}-nombre`}
          placeholder="Ej: MMA Pro, Kick Boxing Amateur"
          required
          maxLength={60}
          disabled={isPending}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          autoFocus
        />
        <p className="text-xs text-muted-foreground">
          Ejemplos: MMA Pro, MMA Amateur, Kick Boxing Semi-Pro, Grappling, Box.
        </p>
      </div>
    </form>
  );
}
