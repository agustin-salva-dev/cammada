"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Trash2,
  ShieldAlert,
  Pencil,
  Swords,
  Flame,
  Dumbbell,
  Activity,
  Trophy,
} from "lucide-react";
import { deleteModalidad } from "../actions";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { ModalModalidad } from "./ModalModalidad";

interface CardModalidadProps {
  id: string;
  nombre: string;
  recordsCount: number;
}

const MODALIDAD_ICON_MAP: { keyword: string; icon: typeof Swords }[] = [
  { keyword: "mma", icon: Swords },
  { keyword: "kick", icon: Flame },
  { keyword: "box", icon: Dumbbell },
  { keyword: "grappling", icon: Activity },
  { keyword: "submission", icon: Activity },
];

function ModalidadIcon({ nombre }: { nombre: string }) {
  const lower = nombre.toLowerCase();
  const match = MODALIDAD_ICON_MAP.find((m) => lower.includes(m.keyword));
  const IconComponent = match?.icon ?? Trophy;
  return <IconComponent className="h-5 w-5" />;
}

type NivelBadge = {
  label: string;
  variant: "default" | "secondary" | "outline";
};

function getNivelBadge(nombre: string): NivelBadge | null {
  const lower = nombre.toLowerCase();
  if (lower.includes("semi-pro") || lower.includes("semi pro")) {
    return { label: "Semi-Pro", variant: "outline" };
  }
  if (lower.includes("amateur")) {
    return { label: "Amateur", variant: "secondary" };
  }
  if (lower.includes("pro")) {
    return { label: "Pro", variant: "default" };
  }
  return null;
}

export function CardModalidad({
  id,
  nombre,
  recordsCount,
}: CardModalidadProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteModalidad(id);
        if (result.success) {
          toast.success(`Modalidad "${nombre}" eliminada con éxito`);
          setIsOpen(false);
        } else {
          toast.error(result.error || "No se pudo eliminar la modalidad");
        }
      } catch (error) {
        console.error(
          "Ocurrió un error inesperado al eliminar la modalidad",
          error,
        );
        toast.error("Ocurrió un error inesperado al eliminar la modalidad");
      }
    });
  };

  const nivel = getNivelBadge(nombre);

  return (
    <Card className="group h-fit transition-all duration-300 hover:-translate-y-1 gap-2.5 py-2.5">
      <CardHeader className="flex flex-row items-center justify-between px-2.5">
        <div className="flex items-center gap-3 justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <ModalidadIcon nombre={nombre} />
          </div>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg font-bold tracking-tight transition-colors group-hover:text-primary">
              {nombre}
            </CardTitle>
            {nivel && (
              <Badge variant={nivel.variant} className="w-fit text-xs">
                {nivel.label}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardFooter className="flex justify-end gap-1 py-0 px-2.5">
        <ModalModalidad
          modalidad={{ id, nombre }}
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
                Estás a punto de eliminar la modalidad <strong>{nombre}</strong>
                . Esta acción no se puede deshacer.
                {recordsCount > 0 && (
                  <span className="block mt-2 text-yellow-600 dark:text-yellow-400 font-semibold">
                    Advertencia: Esta modalidad tiene records de luchadores
                    asociados y la eliminación fallará a menos que los reasignes
                    primero.
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
