"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2, Users, ShieldAlert, Pencil, Scale } from "lucide-react";
import { deleteCategoriaPeso } from "../actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ModalCategoriaPeso } from "./ModalCategoriaPeso";

interface CardCategoriaPesoProps {
  id: string;
  nombre: string;
  orden: number;
  limiteInferior: number | null;
  limiteSuperior: number | null;
  luchadoresCount: number;
}

/** Formatea el rango en texto legible */
function formatRango(
  limiteInferior: number | null,
  limiteSuperior: number | null,
): string {
  if (limiteInferior !== null && limiteSuperior !== null) {
    return `${limiteInferior} – ${limiteSuperior} kg`;
  }
  if (limiteInferior !== null) {
    return `> ${limiteInferior} kg`;
  }
  if (limiteSuperior !== null) {
    return `< ${limiteSuperior} kg`;
  }
  return "Sin rango definido";
}

export function CardCategoriaPeso({
  id,
  nombre,
  orden,
  limiteInferior,
  limiteSuperior,
  luchadoresCount,
}: CardCategoriaPesoProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteCategoriaPeso(id);
        if (result.success) {
          toast.success(`Categoría "${nombre}" eliminada con éxito`);
          setIsOpen(false);
        } else {
          toast.error(result.error || "No se pudo eliminar la categoría");
        }
      } catch (error) {
        console.error(
          "Ocurrió un error inesperado al eliminar la categoría",
          error,
        );
        toast.error(
          "Ocurrió un error inesperado al eliminar la categoría de peso",
        );
      }
    });
  };

  const rangoTexto = formatRango(limiteInferior, limiteSuperior);

  return (
    <Card className="group h-fit transition-all duration-300 hover:-translate-y-1 gap-2.5 py-2.5">
      <CardHeader className="flex flex-row items-center justify-between px-2.5">
        <div className="flex items-center gap-3 justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold tracking-tight transition-colors group-hover:text-primary">
              {nombre}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {rangoTexto}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2.5">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {luchadoresCount === 0
              ? "Sin luchadores registrados"
              : luchadoresCount === 1
                ? "1 luchador registrado"
                : `${luchadoresCount} luchadores registrados`}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-1 py-0 px-2.5">
        <ModalCategoriaPeso
          categoria={{ id, nombre, orden, limiteInferior, limiteSuperior }}
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          }
        />

        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="border-border/50 bg-background/95 backdrop-blur-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                <ShieldAlert className="h-5 w-5" />
                ¿Confirmar eliminación?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Estás a punto de eliminar la categoría{" "}
                <strong>{nombre}</strong>. Esta acción no se puede deshacer.
                {luchadoresCount > 0 && (
                  <span className="block mt-2 text-yellow-600 dark:text-yellow-400 font-semibold">
                    Advertencia: Esta categoría tiene luchadores asociados y la
                    eliminación fallará a menos que los reasignes primero.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
                disabled={isPending}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {isPending ? "Eliminando..." : "Eliminar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
