"use client";

import * as React from "react";
import {
  Globe,
  ChevronRight,
  Loader2,
  Sparkles,
  Plus,
  Trash2,
  SkipForward,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LuchadorFormData } from "@/features/luchadores/types";
import {
  fetchTapologyFighter,
  createLuchador,
} from "@/features/luchadores/actions";
import { toast } from "sonner";
import { LuchadorForm } from "../forms/LuchadorForm";
import { getCategoriasPesoSelect } from "@/features/categorias-peso/actions";
import { getModalidadesSelect } from "@/features/modalidades/actions";

interface ModalImportarLuchadorProps {
  trigger: React.ReactNode;
  onSubmit?: (data: LuchadorFormData) => void;
}

type ModalStep = "search" | "form";

interface CategoriaPesoOption {
  id: string;
  nombre: string;
  limiteInferior: number | null;
  limiteSuperior: number | null;
}

interface ModalidadOption {
  id: string;
  nombre: string;
}

export function ModalImportarLuchador({
  trigger,
  onSubmit,
}: ModalImportarLuchadorProps) {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<ModalStep>("search");
  const [inputUrls, setInputUrls] = React.useState<string[]>([""]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isSaving, startSavingTransition] = React.useTransition();

  const [queue, setQueue] = React.useState<LuchadorFormData[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [savedCount, setSavedCount] = React.useState(0);

  const [showCancelConfirm, setShowCancelConfirm] = React.useState(false);

  const [categorias, setCategorias] = React.useState<CategoriaPesoOption[]>([]);
  const [modalidades, setModalidades] = React.useState<ModalidadOption[]>([]);

  React.useEffect(() => {
    if (open) {
      getCategoriasPesoSelect().then((res) => {
        if (res.success && res.data) {
          setCategorias(res.data as unknown as CategoriaPesoOption[]);
        }
      });
      getModalidadesSelect().then((res) => {
        if (res.success && res.data) {
          setModalidades(res.data as ModalidadOption[]);
        }
      });
    }
  }, [open]);

  function resetState() {
    setStep("search");
    setInputUrls([""]);
    setQueue([]);
    setCurrentIndex(0);
    setSavedCount(0);
    setIsSearching(false);
  }

  function hasUnsavedData() {
    const hasTypedUrls = inputUrls.some((u) => u.trim().length > 0);
    const hasQueuedFighters = queue.length > 0;
    return hasTypedUrls || hasQueuedFighters;
  }

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
  }

  function handleAddUrl() {
    setInputUrls((prev) => [...prev, ""]);
  }

  function handleRemoveUrl(index: number) {
    setInputUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function handleUrlChange(index: number, value: string) {
    setInputUrls((prev) => prev.map((url, i) => (i === index ? value : url)));
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const urls = inputUrls.map((u) => u.trim()).filter(Boolean);
    if (urls.length === 0) return;

    setIsSearching(true);
    try {
      const results = await Promise.allSettled(
        urls.map((url) => fetchTapologyFighter(url)),
      );

      const successData: LuchadorFormData[] = [];
      const errors: string[] = [];

      results.forEach((result, idx) => {
        if (
          result.status === "fulfilled" &&
          result.value.success &&
          result.value.data
        ) {
          successData.push(result.value.data as LuchadorFormData);
        } else {
          const errorMsg =
            result.status === "fulfilled"
              ? result.value.error || "No se pudo encontrar al luchador"
              : "Error de conexión";
          errors.push(`URL ${idx + 1} (${urls[idx]}): ${errorMsg}`);
        }
      });

      if (errors.length > 0) {
        errors.forEach((err) => toast.error(err));
      }

      if (successData.length > 0) {
        setQueue(successData);
        setCurrentIndex(0);
        setSavedCount(0);
        setStep("form");
        toast.success(
          successData.length === 1
            ? "Datos de Tapology importados con éxito"
            : `${successData.length} peleadores importados con éxito`,
        );
      } else {
        toast.error(
          "No se pudo importar ningún luchador. Verificá las URLs ingresadas.",
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error inesperado al conectar con Tapology.");
    } finally {
      setIsSearching(false);
    }
  }

  function handleSave(data: LuchadorFormData) {
    startSavingTransition(async () => {
      try {
        const res = await createLuchador(data);
        if (res.success) {
          const newSavedCount = savedCount + 1;
          setSavedCount(newSavedCount);
          onSubmit?.(data);

          if (currentIndex < queue.length - 1) {
            toast.success(
              `Peleador ${currentIndex + 1} de ${queue.length} guardado correctamente`,
              { position: "top-center" },
            );
            setCurrentIndex((prev) => prev + 1);
          } else {
            resetState();
            setOpen(false);
            toast.success(
              newSavedCount === 1
                ? "Peleador registrado correctamente"
                : `${newSavedCount} peleadores registrados correctamente`,
              { position: "top-center" },
            );
          }
        } else {
          toast.error(
            "Error al guardar: " + (res.error || "Error desconocido"),
          );
        }
      } catch (err) {
        console.error(err);
        toast.error(
          "Ocurrió un error inesperado al intentar guardar el peleador.",
        );
      }
    });
  }

  function handleSkip() {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      toast.info(`Peleador ${currentIndex + 1} de ${queue.length} omitido`);
    } else {
      resetState();
      setOpen(false);
      if (savedCount > 0) {
        toast.success(
          `${savedCount} peleador${savedCount > 1 ? "es" : ""} registrado${savedCount > 1 ? "s" : ""} correctamente`,
          { position: "top-center" },
        );
      } else {
        toast.info("No se guardó ningún peleador");
      }
    }
  }

  function handleCancel() {
    if (hasUnsavedData()) {
      setShowCancelConfirm(true);
    } else {
      resetState();
      setOpen(false);
    }
  }

  function handleConfirmCancel() {
    setShowCancelConfirm(false);
    resetState();
    setOpen(false);
  }

  const isMultiple = queue.length > 1;
  const isLastInQueue = currentIndex >= queue.length - 1;
  const currentFighter = queue[currentIndex];

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>

        <DialogContent
          className="sm:max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col gap-0 p-0"
          showCloseButton={true}
        >
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border sticky top-0 bg-popover/95 backdrop-blur z-10">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <DialogTitle className="text-xl">
                Importar desde Tapology
              </DialogTitle>
            </div>
            <DialogDescription>
              {step === "search"
                ? "Ingresá la URL de Tapology del luchador o su ID (slug) para precargar los datos. Podés agregar múltiples peleadores a la vez."
                : isMultiple
                  ? `Peleador ${currentIndex + 1} de ${queue.length} — Completá y verificá la información importada.`
                  : "Completá y verificá la información importada antes de guardar en la base de datos."}
            </DialogDescription>
          </DialogHeader>

          {step === "search" ? (
            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-6 px-6 py-8"
            >
              <div className="flex flex-col gap-3">
                <Label className="text-sm font-semibold">
                  URL o ID de Tapology
                </Label>

                {inputUrls.map((url, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={
                          index === 0
                            ? "Ej: https://www.tapology.com/fightcenter/fighters/georges-st-pierre-rush o georges-st-pierre-rush"
                            : "URL o ID de otro peleador"
                        }
                        className="pl-9 pr-4 py-6 text-sm"
                        disabled={isSearching}
                        value={url}
                        onChange={(e) => handleUrlChange(index, e.target.value)}
                        autoFocus={index === inputUrls.length - 1}
                      />
                    </div>
                    {inputUrls.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveUrl(index)}
                        disabled={isSearching}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="self-start"
                  onClick={handleAddUrl}
                  disabled={isSearching}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar otra URL/ID
                </Button>

                <p className="text-xs text-muted-foreground mt-1">
                  La URL del peleador debe ser del sitio oficial de Tapology.
                  Buscaremos su nombre, apodo, edad, peso y estadísticas de
                  combates.
                </p>
              </div>

              <DialogFooter className="pt-4 border-t border-dashed border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSearching}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSearching || inputUrls.every((u) => !u.trim())}
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Buscando en Tapology...
                    </>
                  ) : (
                    <>
                      {inputUrls.filter((u) => u.trim()).length > 1
                        ? `Buscar ${inputUrls.filter((u) => u.trim()).length} luchadores`
                        : "Buscar luchador"}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <>
              {isMultiple && (
                <div className="px-6 pt-4 pb-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span className="font-medium text-foreground">
                      {currentFighter?.nombre || `Peleador ${currentIndex + 1}`}
                    </span>
                    <span>
                      {currentIndex + 1} de {queue.length}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                      style={{
                        width: `${((currentIndex + 1) / queue.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <LuchadorForm
                key={
                  currentFighter
                    ? `${currentIndex}-${currentFighter.nombre}`
                    : "empty"
                }
                formId="form-importar-luchador"
                initialData={currentFighter}
                onSubmit={handleSave}
                isPending={isSaving}
                categorias={categorias}
                modalidades={modalidades}
              />

              <DialogFooter className="px-6 py-4 border-t border-border sticky bottom-0 bg-popover/95 backdrop-blur z-10">
                <div className="flex w-full items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSaving}
                    onClick={() => {
                      if (isMultiple) {
                        setStep("search");
                      } else {
                        setStep("search");
                      }
                    }}
                  >
                    Atrás
                  </Button>

                  <div className="flex items-center gap-2">
                    {isMultiple && (
                      <Button
                        type="button"
                        variant="ghost"
                        disabled={isSaving}
                        onClick={handleSkip}
                      >
                        <SkipForward className="mr-2 h-4 w-4" />
                        Omitir
                      </Button>
                    )}
                    <Button
                      type="submit"
                      form="form-importar-luchador"
                      disabled={isSaving}
                    >
                      {isSaving
                        ? "Guardando luchador..."
                        : isMultiple && !isLastInQueue
                          ? "Guardar y Siguiente"
                          : "Confirmar y Guardar"}
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent className="border-border/50 bg-background/95 backdrop-blur-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              ¿Descartar la información?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {queue.length > 0
                ? `Tenés ${queue.length - currentIndex} peleador${queue.length - currentIndex > 1 ? "es" : ""} pendiente${queue.length - currentIndex > 1 ? "s" : ""} de guardar. Si cancelás, se perderá toda la información cargada.`
                : "Si cancelás, se perderán las URLs ingresadas y cualquier dato cargado."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Volver</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              variant="destructive"
            >
              Sí, descartar todo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
