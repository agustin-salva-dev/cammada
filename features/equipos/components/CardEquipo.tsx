"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Trash2,
  Users,
  ShieldAlert,
  Pencil,
  MapPin,
  Shield,
  User,
} from "lucide-react";
import { deleteEquipo, getEquipoById } from "../actions";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ModalEquipo } from "./ModalEquipo";

interface CardEquipoProps {
  id: string;
  nombre: string;
  pais: string;
  ciudad: string;
  luchadoresCount: number;
}

interface LuchadorInfo {
  id: string;
  nombre: string;
  apellido: string;
  apodo: string;
  pais: string;
  ciudad: string;
  edad: number | null;
  ultimoPeso: number | null;
}

export function CardEquipo({
  id,
  nombre,
  pais,
  ciudad,
  luchadoresCount,
}: CardEquipoProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [isLuchadoresOpen, setIsLuchadoresOpen] = useState(false);
  const [luchadores, setLuchadores] = useState<LuchadorInfo[]>([]);
  const [isLoadingLuchadores, setIsLoadingLuchadores] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteEquipo(id);
        if (result.success) {
          toast.success(`Equipo "${nombre}" eliminado con éxito`);
          setIsOpen(false);
        } else {
          toast.error(result.error || "No se pudo eliminar el equipo");
        }
      } catch (error) {
        console.error(
          "Ocurrió un error inesperado al eliminar el equipo",
          error,
        );
        toast.error("Ocurrió un error inesperado al eliminar el equipo");
      }
    });
  };

  const handleVerLuchadores = async () => {
    setIsLuchadoresOpen(true);
    setIsLoadingLuchadores(true);
    try {
      const result = await getEquipoById(id);
      if (result.success && result.data) {
        setLuchadores(result.data.luchadores as LuchadorInfo[]);
      } else {
        toast.error("No se pudieron cargar los luchadores del equipo");
      }
    } catch (error) {
      console.error("Error al cargar luchadores:", error);
      toast.error("Error al cargar luchadores");
    } finally {
      setIsLoadingLuchadores(false);
    }
  };

  const ubicacion =
    pais && ciudad && pais !== "Desconocido" && ciudad !== "Desconocida"
      ? `${ciudad}, ${pais}`
      : pais && pais !== "Desconocido"
        ? pais
        : null;

  return (
    <>
      <Card className="group h-fit transition-all duration-300 hover:-translate-y-1 gap-2.5 py-2.5">
        <CardHeader className="flex flex-row items-center justify-between px-2.5">
          <div className="flex items-center gap-3 justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold tracking-tight transition-colors group-hover:text-primary">
                {nombre}
              </CardTitle>
              {ubicacion && (
                <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <MapPin className="h-3 w-3" />
                  {ubicacion}
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-2.5 flex flex-col items-center gap-2">
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
          {luchadoresCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-full text-xs px-3 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-200"
              onClick={handleVerLuchadores}
            >
              <Users className="h-3 w-3 mr-1" />
              Ver luchadores
            </Button>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-1 py-0 px-2.5">
          <ModalEquipo
            equipo={{ id, nombre, pais, ciudad }}
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
                  Estás a punto de eliminar el equipo <strong>{nombre}</strong>.
                  Esta acción no se puede deshacer.
                  {luchadoresCount > 0 && (
                    <span className="block mt-2 text-yellow-600 dark:text-yellow-400 font-semibold">
                      Advertencia: Este equipo tiene luchadores asociados y la
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

      <Dialog open={isLuchadoresOpen} onOpenChange={setIsLuchadoresOpen}>
        <DialogContent className="max-w-lg border-border/50 bg-background/95 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Luchadores de {nombre}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2 max-h-[60vh] overflow-y-auto pr-1">
            {isLoadingLuchadores ? (
              <div className="flex items-center justify-center py-10 text-muted-foreground text-sm gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                Cargando luchadores...
              </div>
            ) : luchadores.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
                <Users className="h-8 w-8 opacity-40" />
                <p className="text-sm">No hay luchadores en este equipo.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {luchadores.map((l) => (
                  <li
                    key={l.id}
                    className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5 transition-colors hover:bg-muted/60"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {l.nombre} {l.apellido}
                        {l.apodo && (
                          <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                            &ldquo;{l.apodo}&rdquo;
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {[l.ciudad, l.pais].filter(Boolean).join(", ")}
                        {l.edad && ` · ${l.edad} años`}
                        {l.ultimoPeso && ` · ${l.ultimoPeso} kg`}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
