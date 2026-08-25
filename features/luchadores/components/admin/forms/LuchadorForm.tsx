"use client";

import * as React from "react";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { LuchadorFormData, RecordModalidad } from "@/features/luchadores/types";
import Image from "next/image";
import { LocationSelect } from "@/components/ui/location-select";
import { getEquipos } from "@/features/equipos/actions";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface ModalidadOption {
  id: string;
  nombre: string;
}

export const INITIAL_FORM: LuchadorFormData = {
  nombre: "",
  apodo: "",
  apellido: "",
  edad: undefined,
  altura: undefined,
  ultimoPeso: undefined,
  categoria: "",
  pais: "Argentina",
  ciudad: "Salta - Capital",
  equipo: "",
  records: [],
  esExportado: false,
  linkTapology: "",
};

function crearRecordVacio(): RecordModalidad {
  return {
    id: crypto.randomUUID(),
    modalidad: "",
    victorias: 0,
    derrotas: 0,
    empates: 0,
  };
}

interface EquipoOption {
  id: string;
  nombre: string;
}

interface CategoriaPesoOption {
  id: string;
  nombre: string;
  limiteInferior: number | null;
  limiteSuperior: number | null;
}

interface LuchadorFormProps {
  formId: string;
  initialData?: LuchadorFormData;
  onSubmit: (data: LuchadorFormData) => void;
  isPending?: boolean;
  categorias: CategoriaPesoOption[];
  modalidades: ModalidadOption[];
  onChange?: (data: LuchadorFormData) => void;
}

export function LuchadorForm({
  formId,
  initialData,
  onSubmit,
  isPending = false,
  categorias,
  modalidades,
  onChange,
}: LuchadorFormProps) {
  const [form, setForm] = React.useState<LuchadorFormData>(
    initialData || INITIAL_FORM,
  );
  const [equipos, setEquipos] = React.useState<EquipoOption[]>([]);

  const [isCreatingTeam, setIsCreatingTeam] = React.useState(false);
  const [nuevoEquipo, setNuevoEquipo] = React.useState("");

  const equipoOptions = React.useMemo(() => {
    return equipos.map((eq) => ({ value: eq.nombre, label: eq.nombre }));
  }, [equipos]);

  React.useEffect(() => {
    onChange?.(form);
  }, [form, onChange]);

  React.useEffect(() => {
    let active = true;
    getEquipos().then((res) => {
      if (active && res.success && res.data) {
        setEquipos(res.data as EquipoOption[]);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  function setField<K extends keyof LuchadorFormData>(
    key: K,
    value: LuchadorFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function agregarRecord() {
    setForm((prev) => ({
      ...prev,
      records: [...prev.records, crearRecordVacio()],
    }));
  }

  function eliminarRecord(id: string) {
    setForm((prev) => ({
      ...prev,
      records: prev.records.filter((r) => r.id !== id),
    }));
  }

  function actualizarRecord(
    id: string,
    campo: keyof Omit<RecordModalidad, "id">,
    valor: string | number,
  ) {
    setForm((prev) => ({
      ...prev,
      records: prev.records.map((r) =>
        r.id === id ? { ...r, [campo]: valor } : r,
      ),
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const dataToSend = { ...form };

    if (isCreatingTeam) {
      dataToSend.equipo = nuevoEquipo;
    }

    onSubmit(dataToSend);
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 px-6 py-5"
    >
      <section className="flex flex-col gap-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Datos personales
        </h3>

        <div className="grid grid-cols-7 gap-3">
          <div className="col-span-1 flex items-center justify-center">
            <Image
              src="https://github.com/shadcn.png"
              alt="Luchador PFP"
              width={80}
              height={80}
              className="rounded-md"
            />
          </div>
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label htmlFor={`${formId}-nombre`}>
              Nombre{" "}
              <span className="text-destructive" aria-hidden>
                *
              </span>
            </Label>
            <Input
              id={`${formId}-nombre`}
              placeholder="Ej: Juan"
              required
              disabled={isPending}
              value={form.nombre}
              onChange={(e) => setField("nombre", e.target.value)}
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <Label htmlFor={`${formId}-apodo`}>Apodo</Label>
            <Input
              id={`${formId}-apodo`}
              placeholder="Ej: El Toro"
              disabled={isPending}
              value={form.apodo}
              onChange={(e) => setField("apodo", e.target.value)}
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <Label htmlFor={`${formId}-apellido`}>
              Apellido{" "}
              <span className="text-destructive" aria-hidden>
                *
              </span>
            </Label>
            <Input
              id={`${formId}-apellido`}
              placeholder="Ej: García"
              required
              disabled={isPending}
              value={form.apellido}
              onChange={(e) => setField("apellido", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${formId}-edad`}>
              Edad{" "}
              <span className="text-muted-foreground text-xs font-normal">
                (opcional)
              </span>
            </Label>
            <Input
              id={`${formId}-edad`}
              type="number"
              min={14}
              max={80}
              placeholder="Ej: 26"
              disabled={isPending}
              value={form.edad ?? ""}
              onChange={(e) =>
                setField(
                  "edad",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${formId}-altura`}>
              Altura (cm){" "}
              <span className="text-muted-foreground text-xs font-normal">
                (opcional)
              </span>
            </Label>
            <Input
              id={`${formId}-altura`}
              type="number"
              min={140}
              max={230}
              placeholder="Ej: 175"
              disabled={isPending}
              value={form.altura ?? ""}
              onChange={(e) =>
                setField(
                  "altura",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Ubicación y equipo
        </h3>

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

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${formId}-equipo`}>
            Equipo{" "}
            <span className="text-destructive" aria-hidden>
              *
            </span>
          </Label>
          <SearchableSelect
            id={`${formId}-equipo`}
            required
            disabled={isPending}
            value={isCreatingTeam ? "" : form.equipo}
            onValueChange={(val) => {
              setIsCreatingTeam(false);
              setField("equipo", val);
            }}
            options={equipoOptions}
            placeholder="Seleccionar equipo..."
            searchPlaceholder="Buscar equipo..."
            onCreateNew={() => {
              setIsCreatingTeam(true);
              setNuevoEquipo("");
              setField("equipo", "");
            }}
            createNewText="Crear nuevo equipo..."
          />
          {isCreatingTeam && (
            <div className="flex flex-col gap-1.5 mt-2">
              <Label htmlFor={`${formId}-nuevo-equipo`}>
                Nombre del nuevo equipo
              </Label>
              <Input
                id={`${formId}-nuevo-equipo`}
                placeholder="Ej: Team Alpha"
                required
                value={nuevoEquipo}
                onChange={(e) => setNuevoEquipo(e.target.value)}
              />
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Categoría y peso
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${formId}-categoria`}>
              Categoría (peso){" "}
              <span className="text-destructive" aria-hidden>
                *
              </span>
            </Label>
            <NativeSelect
              id={`${formId}-categoria`}
              required
              className="w-full"
              disabled={isPending}
              value={form.categoria}
              onChange={(e) => setField("categoria", e.target.value)}
            >
              <NativeSelectOption value="">Seleccionar</NativeSelectOption>
              {categorias.map((cat) => {
                const rango =
                  cat.limiteInferior !== null || cat.limiteSuperior !== null
                    ? `(${cat.limiteInferior !== null ? cat.limiteInferior : "0"}–${
                        cat.limiteSuperior !== null ? cat.limiteSuperior : "∞"
                      } kg)`
                    : "";
                return (
                  <NativeSelectOption key={cat.id} value={cat.id}>
                    {cat.nombre} {rango}
                  </NativeSelectOption>
                );
              })}
            </NativeSelect>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${formId}-ultimoPeso`}>
              Último peso registrado (kg){" "}
              <span className="text-muted-foreground text-xs font-normal">
                (opcional)
              </span>
            </Label>
            <Input
              id={`${formId}-ultimoPeso`}
              type="number"
              min={40}
              max={200}
              step={0.1}
              placeholder="Ej: 69.5"
              disabled={isPending}
              value={form.ultimoPeso ?? ""}
              onChange={(e) =>
                setField(
                  "ultimoPeso",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Records por modalidad
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Podés agregar un record por cada disciplina en la que compite.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={agregarRecord}
            className="shrink-0"
          >
            <PlusIcon className="size-3.5" />
            Agregar record
          </Button>
        </div>

        {form.records.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-6 text-center text-sm text-muted-foreground">
            Sin records todavía. Hacé click en{" "}
            <span className="font-medium text-foreground">
              &quot;Agregar record&quot;
            </span>{" "}
            para añadir una disciplina.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[1fr_64px_64px_64px_36px] gap-2 px-1">
              <span className="text-xs text-muted-foreground font-medium">
                Modalidad
              </span>
              <span className="text-xs text-muted-foreground font-medium text-center">
                V
              </span>
              <span className="text-xs text-muted-foreground font-medium text-center">
                D
              </span>
              <span className="text-xs text-muted-foreground font-medium text-center">
                E
              </span>
              <span />
            </div>

            {form.records.map((record) => (
              <div
                key={record.id}
                className="grid grid-cols-[1fr_64px_64px_64px_36px] gap-2 items-center"
              >
                <NativeSelect
                  aria-label="Modalidad"
                  className="w-full"
                  disabled={isPending}
                  value={record.modalidad}
                  onChange={(e) =>
                    actualizarRecord(record.id, "modalidad", e.target.value)
                  }
                >
                  <NativeSelectOption value="">Seleccionar</NativeSelectOption>
                  {modalidades.map((m) => (
                    <NativeSelectOption key={m.id} value={m.nombre}>
                      {m.nombre}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>

                <Input
                  aria-label="Victorias"
                  type="number"
                  min={0}
                  disabled={isPending}
                  className="text-center px-1"
                  value={record.victorias}
                  onChange={(e) =>
                    actualizarRecord(
                      record.id,
                      "victorias",
                      Math.max(0, Number(e.target.value)),
                    )
                  }
                />

                <Input
                  aria-label="Derrotas"
                  type="number"
                  min={0}
                  disabled={isPending}
                  className="text-center px-1"
                  value={record.derrotas}
                  onChange={(e) =>
                    actualizarRecord(
                      record.id,
                      "derrotas",
                      Math.max(0, Number(e.target.value)),
                    )
                  }
                />

                <Input
                  aria-label="Empates"
                  type="number"
                  min={0}
                  disabled={isPending}
                  className="text-center px-1"
                  value={record.empates}
                  onChange={(e) =>
                    actualizarRecord(
                      record.id,
                      "empates",
                      Math.max(0, Number(e.target.value)),
                    )
                  }
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Eliminar record"
                  disabled={isPending}
                  onClick={() => eliminarRecord(record.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2Icon className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4 border-t border-border pt-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Talento Exportado y Enlaces
        </h3>

        <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
          <input
            id={`${formId}-esExportado`}
            type="checkbox"
            disabled={isPending}
            checked={form.esExportado ?? false}
            onChange={(e) => setField("esExportado", e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
          />
          <Label
            htmlFor={`${formId}-esExportado`}
            className="cursor-pointer font-medium text-sm flex flex-col"
          >
            <span>¿Es Peleador de Exportación?</span>
            <span className="text-xs text-muted-foreground font-normal">
              Marca esta opción para promocionar a este luchador en la sección pública &quot;Talento Exportado&quot;.
            </span>
          </Label>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${formId}-linkTapology`}>
            Enlace de Tapology{" "}
            <span className="text-muted-foreground text-xs font-normal">
              (opcional - URL oficial del perfil del peleador)
            </span>
          </Label>
          <Input
            id={`${formId}-linkTapology`}
            type="url"
            placeholder="Ej: https://www.tapology.com/fightcenter/fighters/nombre-slug"
            disabled={isPending}
            value={form.linkTapology ?? ""}
            onChange={(e) => setField("linkTapology", e.target.value)}
          />
          {form.linkTapology &&
            !/^https?:\/\/(www\.)?tapology\.com\/fightcenter\/fighters\/.+/i.test(
              form.linkTapology.trim(),
            ) && (
              <p className="text-xs text-destructive">
                Debe ingresar un enlace válido a un perfil de peleador en Tapology (ej: https://www.tapology.com/fightcenter/fighters/...).
              </p>
            )}
        </div>
      </section>
    </form>
  );
}
