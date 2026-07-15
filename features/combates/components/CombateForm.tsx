"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  TIPOS_COMBATE,
  TIPO_COMBATE_LABELS,
  ESTADOS_COMBATE,
  ESTADO_COMBATE_LABELS,
  type CombateFormData,
  type EstadoCombate,
  type TipoCombate,
} from "../zod";

export interface LuchadorOption {
  id: string;
  nombre: string;
  apellido: string;
  apodo: string;
}

export interface EventoOption {
  id: string;
  numero: number;
}

export interface CategoriaOption {
  id: string;
  nombre: string;
}

export interface ModalidadOption {
  id: string;
  nombre: string;
}

interface CombateFormProps {
  formId: string;
  initialData?: Partial<CombateFormData>;
  onSubmit: (data: CombateFormData) => void;
  isPending?: boolean;
  luchadores: LuchadorOption[];
  eventos: EventoOption[];
  categorias: CategoriaOption[];
  modalidades: ModalidadOption[];
}

const VIA_VICTORIA_OPTIONS = [
  "KO",
  "TKO",
  "Sumisión",
  "Decisión Unánime",
  "Decisión Dividida",
  "Decisión Mayoritaria",
  "No Concurso",
  "Descalificación",
];

export function CombateForm({
  formId,
  initialData,
  onSubmit,
  isPending = false,
  luchadores,
  eventos,
  categorias,
  modalidades,
}: CombateFormProps) {
  const [form, setForm] = useState<CombateFormData>({
    peleador1Id: initialData?.peleador1Id ?? "",
    peleador2Id: initialData?.peleador2Id ?? "",
    rounds: initialData?.rounds ?? 3,
    duracionRounds: initialData?.duracionRounds ?? 5,
    eventoId: initialData?.eventoId ?? "",
    tipo: initialData?.tipo ?? "PRELIMINAR",
    numeroPelea: initialData?.numeroPelea ?? 1,
    horarioEstimado: initialData?.horarioEstimado ?? "",
    categoriaPesoId: initialData?.categoriaPesoId ?? "",
    modalidadId: initialData?.modalidadId ?? "",
    titulo: initialData?.titulo ?? false,
    estado: initialData?.estado ?? "PROGRAMADO",
    ganadorId: initialData?.ganadorId ?? "",
    viaVictoria: initialData?.viaVictoria ?? "",
    roundFin: initialData?.roundFin ?? "",
    minutoFin: initialData?.minutoFin ?? "",
    segundoFin: initialData?.segundoFin ?? "",
  });

  const isFinalizado = form.estado === "FINALIZADO";

  function setField<K extends keyof CombateFormData>(
    key: K,
    value: CombateFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  const ganadorOptions = luchadores.filter(
    (l) => l.id === form.peleador1Id || l.id === form.peleador2Id,
  );

  const displayName = (l: LuchadorOption) =>
    `${l.nombre} "${l.apodo}" ${l.apellido}`;

  const peleador1Options = useMemo(() => {
    return luchadores
      .filter((l) => l.id !== form.peleador2Id)
      .map((l) => ({ value: l.id, label: displayName(l) }));
  }, [luchadores, form.peleador2Id]);

  const peleador2Options = useMemo(() => {
    return luchadores
      .filter((l) => l.id !== form.peleador1Id)
      .map((l) => ({ value: l.id, label: displayName(l) }));
  }, [luchadores, form.peleador1Id]);

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 px-6 py-5 max-h-[65vh] overflow-y-auto"
    >
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Peleadores
        </p>
        <div className="h-px bg-border/50 mb-2" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${formId}-peleador1`}>
            Peleador 1{" "}
            <span className="text-destructive" aria-hidden>
              *
            </span>
          </Label>
          <SearchableSelect
            id={`${formId}-peleador1`}
            disabled={isPending}
            value={form.peleador1Id}
            onValueChange={(val) => setField("peleador1Id", val)}
            options={peleador1Options}
            placeholder="Seleccionar peleador 1..."
            searchPlaceholder="Buscar peleador..."
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${formId}-peleador2`}>
            Peleador 2{" "}
            <span className="text-destructive" aria-hidden>
              *
            </span>
          </Label>
          <SearchableSelect
            id={`${formId}-peleador2`}
            disabled={isPending}
            value={form.peleador2Id}
            onValueChange={(val) => setField("peleador2Id", val)}
            options={peleador2Options}
            placeholder="Seleccionar peleador 2..."
            searchPlaceholder="Buscar peleador..."
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Evento
        </p>
        <div className="h-px bg-border/50 mb-2" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${formId}-evento`}>
            Evento{" "}
            <span className="text-destructive" aria-hidden>
              *
            </span>
          </Label>
          <NativeSelect
            id={`${formId}-evento`}
            disabled={isPending}
            value={form.eventoId}
            onChange={(e) => setField("eventoId", e.target.value)}
            required
          >
            <NativeSelectOption value="">Seleccionar...</NativeSelectOption>
            {eventos.map((ev) => (
              <NativeSelectOption key={ev.id} value={ev.id}>
                Evento #{ev.numero}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${formId}-numeroPelea`}>
            N° de pelea{" "}
            <span className="text-destructive" aria-hidden>
              *
            </span>
          </Label>
          <Input
            id={`${formId}-numeroPelea`}
            type="number"
            min={1}
            required
            disabled={isPending}
            value={form.numeroPelea}
            onChange={(e) => setField("numeroPelea", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${formId}-tipo`}>Tipo de pelea</Label>
          <NativeSelect
            id={`${formId}-tipo`}
            disabled={isPending}
            value={form.tipo}
            onChange={(e) => setField("tipo", e.target.value as TipoCombate)}
          >
            {TIPOS_COMBATE.map((t) => (
              <NativeSelectOption key={t} value={t}>
                {TIPO_COMBATE_LABELS[t]}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${formId}-horario`}>Horario estimado</Label>
          <Input
            id={`${formId}-horario`}
            type="time"
            disabled={isPending}
            value={form.horarioEstimado ?? ""}
            onChange={(e) => setField("horarioEstimado", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Detalles del Combate
        </p>
        <div className="h-px bg-border/50 mb-2" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${formId}-categoria`}>
            Categoría de peso{" "}
            <span className="text-destructive" aria-hidden>
              *
            </span>
          </Label>
          <NativeSelect
            id={`${formId}-categoria`}
            disabled={isPending}
            value={form.categoriaPesoId}
            onChange={(e) => setField("categoriaPesoId", e.target.value)}
            required
          >
            <NativeSelectOption value="">Seleccionar...</NativeSelectOption>
            {categorias.map((c) => (
              <NativeSelectOption key={c.id} value={c.id}>
                {c.nombre}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${formId}-modalidad`}>
            Modalidad{" "}
            <span className="text-destructive" aria-hidden>
              *
            </span>
          </Label>
          <NativeSelect
            id={`${formId}-modalidad`}
            disabled={isPending}
            value={form.modalidadId}
            onChange={(e) => setField("modalidadId", e.target.value)}
            required
          >
            <NativeSelectOption value="">Seleccionar...</NativeSelectOption>
            {modalidades.map((m) => (
              <NativeSelectOption key={m.id} value={m.id}>
                {m.nombre}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${formId}-rounds`}>
            Cantidad de rounds{" "}
            <span className="text-destructive" aria-hidden>
              *
            </span>
          </Label>
          <Input
            id={`${formId}-rounds`}
            type="number"
            min={1}
            max={20}
            required
            disabled={isPending}
            value={form.rounds}
            onChange={(e) => setField("rounds", Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${formId}-duracion`}>
            Duración de rounds (min){" "}
            <span className="text-destructive" aria-hidden>
              *
            </span>
          </Label>
          <Input
            id={`${formId}-duracion`}
            type="number"
            min={1}
            max={15}
            required
            disabled={isPending}
            value={form.duracionRounds}
            onChange={(e) => setField("duracionRounds", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${formId}-estado`}>Estado</Label>
          <NativeSelect
            id={`${formId}-estado`}
            disabled={isPending}
            value={form.estado}
            onChange={(e) => {
              const newEstado = e.target.value as EstadoCombate;
              setForm((prev) => ({
                ...prev,
                estado: newEstado,
                ...(newEstado !== "FINALIZADO"
                  ? {
                      ganadorId: "",
                      viaVictoria: "",
                      roundFin: "",
                      minutoFin: "",
                      segundoFin: "",
                    }
                  : {}),
              }));
            }}
          >
            {ESTADOS_COMBATE.map((e) => (
              <NativeSelectOption key={e} value={e}>
                {ESTADO_COMBATE_LABELS[e]}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        <div className="flex flex-col gap-1.5 justify-end">
          <label
            htmlFor={`${formId}-titulo`}
            className="flex items-center gap-3 h-9 cursor-pointer"
          >
            <div className="relative">
              <input
                id={`${formId}-titulo`}
                type="checkbox"
                className="sr-only peer"
                checked={form.titulo}
                disabled={isPending}
                onChange={(e) => setField("titulo", e.target.checked)}
              />
              <div className="w-10 h-5 bg-input rounded-full peer-checked:bg-primary transition-colors" />
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm" />
            </div>
            <span className="text-sm font-medium leading-none">
              Combate por título
            </span>
          </label>
        </div>
      </div>

      {isFinalizado && (
        <>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Resultado
            </p>
            <div className="h-px bg-border/50 mb-2" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${formId}-ganador`}>
                Ganador{" "}
                <span className="text-destructive" aria-hidden>
                  *
                </span>
              </Label>
              <NativeSelect
                id={`${formId}-ganador`}
                disabled={isPending || ganadorOptions.length === 0}
                value={form.ganadorId ?? ""}
                onChange={(e) => setField("ganadorId", e.target.value)}
                required={isFinalizado}
              >
                <NativeSelectOption value="">
                  {ganadorOptions.length === 0
                    ? "Primero seleccioná los peleadores"
                    : "Seleccionar..."}
                </NativeSelectOption>
                {ganadorOptions.map((l) => (
                  <NativeSelectOption key={l.id} value={l.id}>
                    {displayName(l)}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${formId}-via`}>
                Vía de la victoria{" "}
                <span className="text-destructive" aria-hidden>
                  *
                </span>
              </Label>
              <NativeSelect
                id={`${formId}-via`}
                disabled={isPending}
                value={form.viaVictoria ?? ""}
                onChange={(e) => setField("viaVictoria", e.target.value)}
                required={isFinalizado}
              >
                <NativeSelectOption value="">Seleccionar...</NativeSelectOption>
                {VIA_VICTORIA_OPTIONS.map((v) => (
                  <NativeSelectOption key={v} value={v}>
                    {v}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${formId}-roundFin`}>
                Round{" "}
                <span className="text-destructive" aria-hidden>
                  *
                </span>
              </Label>
              <Input
                id={`${formId}-roundFin`}
                type="number"
                min={1}
                max={form.rounds}
                required={isFinalizado}
                disabled={isPending}
                placeholder="Ej: 2"
                value={form.roundFin ?? ""}
                onChange={(e) =>
                  setField(
                    "roundFin",
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${formId}-minutoFin`}>
                Minuto{" "}
                <span className="text-destructive" aria-hidden>
                  *
                </span>
              </Label>
              <Input
                id={`${formId}-minutoFin`}
                type="number"
                min={0}
                max={59}
                required={isFinalizado}
                disabled={isPending}
                placeholder="Ej: 4"
                value={form.minutoFin ?? ""}
                onChange={(e) =>
                  setField(
                    "minutoFin",
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${formId}-segundoFin`}>
                Segundo{" "}
                <span className="text-destructive" aria-hidden>
                  *
                </span>
              </Label>
              <Input
                id={`${formId}-segundoFin`}
                type="number"
                min={0}
                max={59}
                required={isFinalizado}
                disabled={isPending}
                placeholder="Ej: 32"
                value={form.segundoFin ?? ""}
                onChange={(e) =>
                  setField(
                    "segundoFin",
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              />
            </div>
          </div>
        </>
      )}
    </form>
  );
}
