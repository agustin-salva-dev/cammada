"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  ESTADOS_EVENTO,
  ESTADO_LABELS,
  type EventoFormData,
  type EstadoEvento,
} from "../zod";

interface EventoFormProps {
  formId: string;
  initialData?: EventoFormData;
  onSubmit: (data: EventoFormData) => void;
  isPending?: boolean;
}

export function EventoForm({
  formId,
  initialData,
  onSubmit,
  isPending = false,
}: EventoFormProps) {
  const [form, setForm] = useState<EventoFormData>({
    numero: initialData?.numero ?? ("" as unknown as number),
    fecha: initialData?.fecha ?? "",
    horaInicio: initialData?.horaInicio ?? "",
    horaFin: initialData?.horaFin ?? "",
    lugarNombre: initialData?.lugarNombre ?? "",
    calle: initialData?.calle ?? "",
    calleNumero: initialData?.calleNumero ?? "",
    estado: initialData?.estado ?? "PROGRAMADO",
  });

  function setField<K extends keyof EventoFormData>(
    key: K,
    value: EventoFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      ...form,
      numero: Number(form.numero),
    });
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 px-6 py-5 max-h-[65vh] overflow-y-auto"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${formId}-numero`}>
          Número del evento{" "}
          <span className="text-destructive" aria-hidden>
            *
          </span>
        </Label>
        <Input
          id={`${formId}-numero`}
          type="number"
          placeholder="Ej: 11"
          required
          min={1}
          disabled={isPending}
          value={form.numero}
          onChange={(e) => setField("numero", Number(e.target.value))}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${formId}-fecha`}>
          Fecha del evento{" "}
          <span className="text-destructive" aria-hidden>
            *
          </span>
        </Label>
        <Input
          id={`${formId}-fecha`}
          type="date"
          required
          disabled={isPending}
          value={form.fecha}
          onChange={(e) => setField("fecha", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${formId}-horaInicio`}>
            Hora de inicio{" "}
            <span className="text-destructive" aria-hidden>
              *
            </span>
          </Label>
          <Input
            id={`${formId}-horaInicio`}
            type="time"
            required
            disabled={isPending}
            value={form.horaInicio}
            onChange={(e) => setField("horaInicio", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${formId}-horaFin`}>
            Hora de cierre{" "}
            <span className="text-destructive" aria-hidden>
              *
            </span>
          </Label>
          <Input
            id={`${formId}-horaFin`}
            type="time"
            required
            disabled={isPending}
            value={form.horaFin}
            onChange={(e) => setField("horaFin", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${formId}-lugarNombre`}>
          Nombre del lugar{" "}
          <span className="text-destructive" aria-hidden>
            *
          </span>
        </Label>
        <Input
          id={`${formId}-lugarNombre`}
          placeholder="Ej: Microestadio Municipal"
          required
          maxLength={200}
          disabled={isPending}
          value={form.lugarNombre}
          onChange={(e) => setField("lugarNombre", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5 col-span-2">
          <Label htmlFor={`${formId}-calle`}>
            Calle{" "}
            <span className="text-destructive" aria-hidden>
              *
            </span>
          </Label>
          <Input
            id={`${formId}-calle`}
            placeholder="Ej: Av. Libertador"
            required
            maxLength={200}
            disabled={isPending}
            value={form.calle}
            onChange={(e) => setField("calle", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${formId}-calleNumero`}>
            Número{" "}
            <span className="text-destructive" aria-hidden>
              *
            </span>
          </Label>
          <Input
            id={`${formId}-calleNumero`}
            placeholder="Ej: 1530"
            required
            maxLength={20}
            disabled={isPending}
            value={form.calleNumero}
            onChange={(e) => setField("calleNumero", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${formId}-estado`}>Estado del evento</Label>
        <NativeSelect
          id={`${formId}-estado`}
          className="w-full"
          disabled={isPending}
          value={form.estado}
          onChange={(e) => setField("estado", e.target.value as EstadoEvento)}
        >
          {ESTADOS_EVENTO.map((estado) => (
            <NativeSelectOption key={estado} value={estado}>
              {ESTADO_LABELS[estado]}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
    </form>
  );
}
