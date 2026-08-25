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
import { deleteEquipo, getEquipoById } from "../../../actions";
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
import { ModalEquipo } from "../modals/ModalEquipo";

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
        toast.error("No se pudieron cargar los luchadores del equipo.");
      }
    } catch {
      toast.error("Error al cargar los luchadores.");
    } finally {
      setIsLoadingLuchadores(false);
    }
  };

  return (
    <>
      <Card className="flex flex-col justify-between border-border bg-card">
        <CardHeader className="flex-row items-center justify-between pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary shrink-0" />
            <CardTitle className="text-base font-semibold">{nombre}</CardTitle>
          </div>
          <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-mono shrink-0">
            <Users className="h-3 w-3" />
            {luchadoresCount}{" "}
            {luchadoresCount === 1 ? "luchador" : "luchadores"}
          </span>
        </CardHeader>

        <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
          <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span>
                {ciudad}, {pais}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={handleVerLuchadores}
            disabled={luchadoresCount === 0}
          >
            <Users className="mr-1.5 h-3.5 w-3.5" />
            {luchadoresCount === 0
              ? "Sin luchadores"
              : `Ver luchadores (${luchadoresCount})`}
          </Button>
        </CardContent>

        <CardFooter className="border-t border-border pt-3 gap-2">
          <ModalEquipo
            equipo={{ id, nombre, pais, ciudad }}
            trigger={
              <Button variant="outline" size="sm" className="flex-1">
                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                Editar
              </Button>
            }
          />

          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                disabled={isPending}
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                  <ShieldAlert className="h-5 w-5" />
                  ¿Eliminar equipo?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Los luchadores asociados
                  permanecerán en el sistema pero quedarán sin equipo asignado.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isPending ? "Eliminando..." : "Sí, eliminar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>

      <Dialog open={isLuchadoresOpen} onOpenChange={setIsLuchadoresOpen}>
        <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col gap-0 p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary shrink-0" />
              <DialogTitle className="text-lg">
                Luchadores de {nombre}
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6 space-y-2">
            {isLoadingLuchadores ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                Cargando luchadores...
              </p>
            ) : luchadores.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                Este equipo no tiene luchadores asignados.
              </p>
            ) : (
              luchadores.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/40 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">
                        {l.nombre} {l.apodo ? `"${l.apodo}" ` : ""}
                        {l.apellido}
                      </p>
                      <p className="text-muted-foreground">
                        {l.ciudad}, {l.pais}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-muted-foreground">
                    {l.edad ? `${l.edad} años` : ""}
                    {l.edad && l.ultimoPeso ? " · " : ""}
                    {l.ultimoPeso ? `${l.ultimoPeso} kg` : ""}
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
