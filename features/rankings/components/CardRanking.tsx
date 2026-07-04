"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Trophy,
  Pencil,
  Trash2,
  ShieldAlert,
  ChevronRight,
  Medal,
  Star,
  Crown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ModalRanking } from "./ModalRanking";
import { ModalVerRankingCompleto } from "./ModalVerRankingCompleto";
import { deleteRanking } from "../actions";
import type {
  LuchadorSelectItem,
  ModalidadSelectItem,
  CategoriaPesoSelectItem,
  RankingItemDraft,
} from "../types";

interface RankingItemView {
  id: string;
  posicion: number;
  luchador: {
    id: string;
    nombre: string;
    apellido: string;
    apodo: string;
    pais: string;
    categoria: { nombre: string } | null;
    equipo: { nombre: string };
  };
}

interface CampeonView {
  id: string;
  nombre: string;
  apellido: string;
  apodo: string;
  equipo: { nombre: string };
}

interface CardRankingProps {
  id: string;
  modalidadId: string;
  modalidad: string;
  categoriaPesoId: string | null;
  categoriaPeso: string | null;
  campeonId: string | null;
  campeon: CampeonView | null;
  items: RankingItemView[];
  totalItems: number;
  luchadores: LuchadorSelectItem[];
  modalidades: ModalidadSelectItem[];
  categoriasPeso: CategoriaPesoSelectItem[];
}

function getPositionIcon(posicion: number) {
  if (posicion === 1) return <Medal className="h-3.5 w-3.5 text-yellow-400" />;
  if (posicion === 2) return <Medal className="h-3.5 w-3.5 text-slate-400" />;
  if (posicion === 3) return <Medal className="h-3.5 w-3.5 text-amber-600" />;
  return (
    <span className="w-3.5 text-center text-xs font-semibold text-muted-foreground">
      {posicion}
    </span>
  );
}

function getApodo(apodo: string): string | null {
  if (!apodo || apodo.trim() === "" || apodo === "Sin apodo") return null;
  return apodo;
}

export function CardRanking({
  id,
  modalidadId,
  modalidad,
  categoriaPesoId,
  categoriaPeso,
  campeonId,
  campeon,
  items,
  totalItems,
  luchadores,
  modalidades,
  categoriasPeso,
}: CardRankingProps) {
  const [isPending, startTransition] = useTransition();
  const [alertOpen, setAlertOpen] = useState(false);

  const isLibraXLibra = !categoriaPeso;
  const titulo = isLibraXLibra
    ? `Libra por Libra · ${modalidad}`
    : `${categoriaPeso} · ${modalidad}`;

  const rankingItemsForEdit: RankingItemDraft[] = items.map((item) => ({
    luchadorId: item.luchador.id,
    nombre: item.luchador.nombre,
    apellido: item.luchador.apellido,
    apodo: item.luchador.apodo,
    posicion: item.posicion,
    equipo: item.luchador.equipo.nombre,
  }));

  function handleDelete() {
    startTransition(async () => {
      try {
        const result = await deleteRanking(id);
        if (result.success) {
          toast.success(`Ranking "${titulo}" eliminado con éxito`);
          setAlertOpen(false);
        } else {
          toast.error(result.error || "No se pudo eliminar el ranking");
        }
      } catch {
        toast.error("Ocurrió un error inesperado al eliminar el ranking");
      }
    });
  }

  return (
    <Card className="group flex h-fit flex-col gap-0 py-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader className="flex flex-row items-start justify-between gap-3 px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            {isLibraXLibra ? (
              <Star className="h-5 w-5" />
            ) : (
              <Trophy className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0">
            <CardTitle className="truncate text-base font-bold tracking-tight transition-colors group-hover:text-primary">
              {isLibraXLibra ? "Libra por Libra" : categoriaPeso}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{modalidad}</p>
          </div>
        </div>

        {isLibraXLibra && (
          <Badge
            variant="outline"
            className="shrink-0 border-yellow-500/40 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
          >
            P4P
          </Badge>
        )}
      </CardHeader>

      <CardContent className="px-4 pb-3">
        {campeon && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-3 py-2.5">
            <Crown className="h-4 w-4 shrink-0 text-yellow-500" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold leading-tight text-yellow-600 dark:text-yellow-400">
                {campeon.apellido}, {campeon.nombre}
              </p>
              {getApodo(campeon.apodo) && (
                <p className="truncate text-xs text-yellow-600/70 dark:text-yellow-400/70">
                  &quot;{getApodo(campeon.apodo)}&quot;
                </p>
              )}
              <p className="truncate text-xs text-muted-foreground">
                {campeon.equipo.nombre}
              </p>
            </div>
            <Badge
              variant="outline"
              className="shrink-0 border-yellow-500/40 bg-yellow-500/10 text-xs text-yellow-600 dark:text-yellow-400"
            >
              Campeón
            </Badge>
          </div>
        )}

        {items.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">
            Sin peleadores en este ranking.
          </p>
        ) : (
          <ol className="flex flex-col gap-1">
            {items.map((item) => {
              const apodo = getApodo(item.luchador.apodo);
              return (
                <li
                  key={item.id}
                  className="flex items-center gap-2 rounded-md px-1.5 py-1.5 text-sm transition-colors hover:bg-accent/30"
                >
                  <div className="flex w-5 shrink-0 items-center justify-center">
                    {getPositionIcon(item.posicion)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium leading-tight">
                      {item.luchador.apellido}, {item.luchador.nombre}
                    </p>
                    {apodo && (
                      <p className="truncate text-xs text-muted-foreground">
                        &quot;{apodo}&quot;
                      </p>
                    )}
                    <p className="truncate text-xs text-muted-foreground/70">
                      {item.luchador.equipo.nombre}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {totalItems > items.length && (
          <ModalVerRankingCompleto
            titulo={titulo}
            items={items}
            totalItems={totalItems}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-7 w-full gap-1 text-xs text-muted-foreground hover:text-primary"
              >
                Ver ranking completo ({totalItems} peleadores)
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            }
          />
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-1 border-t border-border/50 px-3 py-2">
        <ModalRanking
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary"
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Editar ranking</span>
            </Button>
          }
          luchadores={luchadores}
          modalidades={modalidades}
          categoriasPeso={categoriasPeso}
          ranking={{
            id,
            modalidadId,
            categoriaPesoId,
            campeonId,
            items: rankingItemsForEdit,
          }}
        />

        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Eliminar ranking</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="border-border/50 bg-background/95 backdrop-blur-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                <ShieldAlert className="h-5 w-5" />
                ¿Confirmar eliminación?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Estás a punto de eliminar el ranking <strong>{titulo}</strong>.
                Se eliminarán también todos los peleadores asociados. Esta
                acción no se puede deshacer.
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
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
