"use client";

import * as React from "react";
import { Globe, ChevronRight, Loader2, Sparkles } from "lucide-react";
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
import { LuchadorFormData } from "@/components/luchadores/luchador.types";
import { fetchTapologyFighter, createLuchador } from "@/features/luchadores/actions";
import { toast } from "sonner";
import { LuchadorForm } from "../form/LuchadorForm";

interface ModalImportarLuchadorProps {
  trigger: React.ReactNode;
  onSubmit?: (data: LuchadorFormData) => void;
}

type ModalStep = "search" | "form";

export function ModalImportarLuchador({
  trigger,
  onSubmit,
}: ModalImportarLuchadorProps) {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<ModalStep>("search");
  const [inputValue, setInputValue] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [isSaving, startSavingTransition] = React.useTransition();
  const [importedData, setImportedData] = React.useState<LuchadorFormData | undefined>(undefined);

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) {
      setStep("search");
      setInputValue("");
      setImportedData(undefined);
      setIsSearching(false);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetchTapologyFighter(inputValue);
      if (res.success && res.data) {
        setImportedData(res.data as LuchadorFormData);
        setStep("form");
        toast.success("Datos de Tapology importados con éxito");
      } else {
        toast.error(res.error || "No se pudo encontrar al luchador");
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
          onSubmit?.(data);
          handleOpenChange(false);
          toast.success("Peleador registrado correctamente", {
            position: "top-center",
          });
        } else {
          toast.error("Error al guardar: " + (res.error || "Error desconocido"));
        }
      } catch (err) {
        console.error(err);
        toast.error("Ocurrió un error inesperado al intentar guardar el peleador.");
      }
    });
  }

  function handleCancel() {
    handleOpenChange(false);
  }

  return (
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
            <DialogTitle className="text-xl">Importar desde Tapology</DialogTitle>
          </div>
          <DialogDescription>
            {step === "search"
              ? "Ingresá la URL de Tapology del luchador o su ID (slug) para precargar los datos."
              : "Completá y verificá la información importada antes de guardar en la base de datos."}
          </DialogDescription>
        </DialogHeader>

        {step === "search" ? (
          <form onSubmit={handleSearch} className="flex flex-col gap-6 px-6 py-8">
            <div className="flex flex-col gap-2">
              <Label htmlFor="tapology-url" className="text-sm font-semibold">
                URL o ID de Tapology
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="tapology-url"
                  placeholder="Ej: https://www.tapology.com/fightcenter/fighters/georges-st-pierre-rush o georges-st-pierre-rush"
                  className="pl-9 pr-4 py-6 text-sm"
                  disabled={isSearching}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  autoFocus
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                La URL del peleador debe ser del sitio oficial de Tapology. Buscaremos su nombre, apodo, edad, peso y estadísticas de combates.
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
              <Button type="submit" disabled={isSearching || !inputValue.trim()}>
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Buscando en Tapology...
                  </>
                ) : (
                  <>
                    Buscar luchador
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <>
            <LuchadorForm
              key={importedData ? importedData.nombre : "empty"}
              formId="form-importar-luchador"
              initialData={importedData}
              onSubmit={handleSave}
              isPending={isSaving}
            />

            <DialogFooter className="px-6 py-4 border-t border-border sticky bottom-0 bg-popover/95 backdrop-blur z-10">
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={() => setStep("search")}
              >
                Atrás
              </Button>
              <Button
                type="submit"
                form="form-importar-luchador"
                disabled={isSaving}
              >
                {isSaving ? "Guardando luchador..." : "Confirmar y Guardar"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
