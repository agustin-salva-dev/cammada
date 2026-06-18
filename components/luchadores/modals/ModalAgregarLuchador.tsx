"use client";

import * as React from "react";
import { PlusIcon, Trash2Icon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  LuchadorFormData,
  ModalidadCombate,
  RecordModalidad,
} from "@/components/luchadores/luchador.types";
import Image from "next/image";
import { createLuchador } from "@/features/luchadores/actions";
import { toast } from "sonner";

const PAISES_PLACEHOLDER = [
  "Argentina",
  "Bolivia",
  "Chile",
  "Paraguay",
  "Uruguay",
  "Brasil",
  "Perú",
];

const CIUDADES_PLACEHOLDER = [
  "Salta",
  "Buenos Aires",
  "Córdoba",
  "Rosario",
  "Jujuy",
  "Tucumán",
  "Mendoza",
];

const EQUIPOS_PLACEHOLDER = [
  "Team Fenix",
  "Team Xtreme",
  "Team Semental",
  "Team GR",
  "Sin equipo",
];

const CATEGORIAS = [
  "Paja (< 52 kg)",
  "Mosca (52–56 kg)",
  "Gallo (56–61 kg)",
  "Pluma (61–66 kg)",
  "Ligero (66–70 kg)",
  "Wélter (70–77 kg)",
  "Mediano (77–84 kg)",
  "Semipesado (84–93 kg)",
  "Pesado (93–120 kg)",
  "Superpesado (> 120 kg)",
];

const MODALIDADES: ModalidadCombate[] = [
  "MMA Pro",
  "MMA Amateur",
  "Kick Boxing Pro",
  "Kick Boxing Semi-Pro",
  "Kick Boxing Amateur",
  "Grappling",
  "Only Submission",
  "Box",
];

const INITIAL_FORM: LuchadorFormData = {
  nombre: "",
  apodo: "",
  apellido: "",
  edad: undefined,
  altura: undefined,
  ultimoPeso: undefined,
  categoria: "",
  pais: "",
  ciudad: "",
  equipo: "",
  records: [],
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

interface ModalAgregarLuchadorProps {
  trigger: React.ReactNode;
  /**
   * TODO: conectar con la API
   */
  onSubmit?: (data: LuchadorFormData) => void;
}

export function ModalAgregarLuchador({
  trigger,
  onSubmit,
}: ModalAgregarLuchadorProps) {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<LuchadorFormData>(INITIAL_FORM);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await createLuchador(form);
      if (res.success) {
        onSubmit?.(form);
        setOpen(false);
        setForm(INITIAL_FORM);
        toast.success("Peleador agregado correctamente", {
          position: "top-center",
        });
      } else {
        toast.error("Error al guardar: " + (res.error || "Error desconocido"));
      }
    } catch (err) {
      console.error(err);
      toast.error(
        "Ocurrió un error inesperado al intentar guardar el peleador.",
      );
    }
  }

  function handleCancel() {
    setOpen(false);
    setForm(INITIAL_FORM);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col gap-0 p-0"
        showCloseButton={true}
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border sticky top-0 bg-popover z-10">
          <DialogTitle className="text-xl">Agregar luchador/a</DialogTitle>
          <DialogDescription>
            Completá los datos del nuevo peleador/a. Los campos marcados con{" "}
            <span className="text-destructive font-medium">*</span> son
            obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form
          id="form-agregar-luchador"
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 px-6 py-5"
        >
          <section className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Datos personales
            </h3>

            <div className="grid grid-cols-7 gap-3">
              <div className="col-span-1">
                <Image
                  src="https://github.com/shadcn.png"
                  alt="Luchador PFP"
                  width={80}
                  height={80}
                  className="rounded-md"
                />
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label htmlFor="nombre">
                  Nombre{" "}
                  <span className="text-destructive" aria-hidden>
                    *
                  </span>
                </Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Juan"
                  required
                  value={form.nombre}
                  onChange={(e) => setField("nombre", e.target.value)}
                />
              </div>

              <div className="col-span-2 flex flex-col gap-1.5">
                <Label htmlFor="apodo">
                  Apodo{" "}
                  <span className="text-destructive" aria-hidden>
                    *
                  </span>
                </Label>
                <Input
                  id="apodo"
                  placeholder="Ej: El Toro"
                  required
                  value={form.apodo}
                  onChange={(e) => setField("apodo", e.target.value)}
                />
              </div>

              <div className="col-span-2 flex flex-col gap-1.5">
                <Label htmlFor="apellido">
                  Apellido{" "}
                  <span className="text-destructive" aria-hidden>
                    *
                  </span>
                </Label>
                <Input
                  id="apellido"
                  placeholder="Ej: García"
                  required
                  value={form.apellido}
                  onChange={(e) => setField("apellido", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edad">
                  Edad{" "}
                  <span className="text-muted-foreground text-xs font-normal">
                    (opcional)
                  </span>
                </Label>
                <Input
                  id="edad"
                  type="number"
                  min={14}
                  max={80}
                  placeholder="Ej: 26"
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
                <Label htmlFor="altura">
                  Altura (cm){" "}
                  <span className="text-muted-foreground text-xs font-normal">
                    (opcional)
                  </span>
                </Label>
                <Input
                  id="altura"
                  type="number"
                  min={140}
                  max={230}
                  placeholder="Ej: 175"
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

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pais">
                  País{" "}
                  <span className="text-destructive" aria-hidden>
                    *
                  </span>
                </Label>
                <NativeSelect
                  id="pais"
                  required
                  className="w-full"
                  value={form.pais}
                  onChange={(e) => setField("pais", e.target.value)}
                >
                  <NativeSelectOption value="">Seleccionar</NativeSelectOption>
                  {PAISES_PLACEHOLDER.map((p) => (
                    <NativeSelectOption key={p} value={p}>
                      {p}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ciudad">
                  Ciudad{" "}
                  <span className="text-destructive" aria-hidden>
                    *
                  </span>
                </Label>
                <NativeSelect
                  id="ciudad"
                  required
                  className="w-full"
                  value={form.ciudad}
                  onChange={(e) => setField("ciudad", e.target.value)}
                >
                  <NativeSelectOption value="">Seleccionar</NativeSelectOption>
                  {CIUDADES_PLACEHOLDER.map((c) => (
                    <NativeSelectOption key={c} value={c}>
                      {c}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="equipo">
                  Equipo{" "}
                  <span className="text-destructive" aria-hidden>
                    *
                  </span>
                </Label>
                <NativeSelect
                  id="equipo"
                  required
                  className="w-full"
                  value={form.equipo}
                  onChange={(e) => setField("equipo", e.target.value)}
                >
                  <NativeSelectOption value="">Seleccionar</NativeSelectOption>
                  {EQUIPOS_PLACEHOLDER.map((eq) => (
                    <NativeSelectOption key={eq} value={eq}>
                      {eq}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Categoría y peso
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="categoria">
                  Categoría (peso){" "}
                  <span className="text-destructive" aria-hidden>
                    *
                  </span>
                </Label>
                <NativeSelect
                  id="categoria"
                  required
                  className="w-full"
                  value={form.categoria}
                  onChange={(e) => setField("categoria", e.target.value)}
                >
                  <NativeSelectOption value="">Seleccionar</NativeSelectOption>
                  {CATEGORIAS.map((cat) => (
                    <NativeSelectOption key={cat} value={cat}>
                      {cat}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ultimoPeso">
                  Último peso registrado (kg){" "}
                  <span className="text-muted-foreground text-xs font-normal">
                    (opcional)
                  </span>
                </Label>
                <Input
                  id="ultimoPeso"
                  type="number"
                  min={40}
                  max={200}
                  step={0.1}
                  placeholder="Ej: 69.5"
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
                      value={record.modalidad}
                      onChange={(e) =>
                        actualizarRecord(
                          record.id,
                          "modalidad",
                          e.target.value as ModalidadCombate,
                        )
                      }
                    >
                      <NativeSelectOption value="">
                        Seleccionar
                      </NativeSelectOption>
                      {MODALIDADES.map((m) => (
                        <NativeSelectOption key={m} value={m}>
                          {m}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>

                    <Input
                      aria-label="Victorias"
                      type="number"
                      min={0}
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
        </form>

        <DialogFooter className="px-6 py-4 border-t border-border sticky bottom-0 bg-popover z-10">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="submit" form="form-agregar-luchador">
            Guardar luchador
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
