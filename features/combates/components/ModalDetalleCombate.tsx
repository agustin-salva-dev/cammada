"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MyBadge } from "@/components/ui/MyBadge";
import {
  Trophy,
  Shield,
  Users,
  Timer,
  Repeat2,
  Clock,
  Swords,
  Star,
} from "lucide-react";
import {
  TIPO_COMBATE_LABELS,
  ESTADO_COMBATE_LABELS,
  ESTADO_COMBATE_BADGE_VARIANT,
  TIPO_COMBATE_BADGE_VARIANT,
  type TipoCombate,
  type EstadoCombate,
} from "../zod";

export interface CombateDetalleData {
  id: string;
  peleador1: {
    nombre: string;
    apellido: string;
    apodo: string;
    equipo: { nombre: string };
  };
  peleador2: {
    nombre: string;
    apellido: string;
    apodo: string;
    equipo: { nombre: string };
  };
  rounds: number;
  duracionRounds: number;
  titulo: boolean;
  tipo: TipoCombate;
  estado: EstadoCombate;
  numeroPelea: number;
  horarioEstimado?: string | null;
  categoriaPeso: {
    nombre: string;
    limiteInferior?: number | null;
    limiteSuperior?: number | null;
  };
  modalidad: { nombre: string };
  evento: { numero: number };
  ganador?: { nombre: string; apellido: string; apodo: string } | null;
  viaVictoria?: string | null;
  roundFin?: number | null;
  minutoFin?: number | null;
  segundoFin?: number | null;
}

interface ModalDetalleCombateProps {
  combate: CombateDetalleData;
  trigger: React.ReactNode;
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/30 last:border-0">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary mt-0.5">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <span className="text-sm font-medium text-foreground">{value}</span>
      </div>
    </div>
  );
}

export function ModalDetalleCombate({
  combate,
  trigger,
}: ModalDetalleCombateProps) {
  const esFinalizado = combate.estado === "FINALIZADO";

  const nombreCompleto = (p: {
    nombre: string;
    apellido: string;
    apodo: string;
  }) => {
    const apodoStr =
      p.apodo && p.apodo.trim() !== "" ? ` "${p.apodo.trim()}"` : "";
    return `${p.nombre} ${apodoStr} ${p.apellido}`;
  };

  const tiempoFin =
    esFinalizado && combate.roundFin !== null && combate.roundFin !== undefined
      ? `R${combate.roundFin} — ${String(combate.minutoFin ?? 0).padStart(2, "0")}:${String(combate.segundoFin ?? 0).padStart(2, "0")}`
      : null;

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className="sm:max-w-lg flex flex-col gap-0 p-0"
        showCloseButton
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <MyBadge
              variant={ESTADO_COMBATE_BADGE_VARIANT[combate.estado]}
              text={ESTADO_COMBATE_LABELS[combate.estado]}
            />
            <MyBadge
              variant={TIPO_COMBATE_BADGE_VARIANT[combate.tipo]}
              text={TIPO_COMBATE_LABELS[combate.tipo]}
            />
            {combate.titulo && (
              <MyBadge variant="default" text="🏆 Por el Título" />
            )}
          </div>
          <DialogTitle className="text-xl leading-tight">
            {nombreCompleto(combate.peleador1)}{" "}
            <span className="text-muted-foreground font-normal">vs</span>{" "}
            {nombreCompleto(combate.peleador2)}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Evento #{combate.evento.numero} · Pelea #{combate.numeroPelea}
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-0 px-6 py-4 overflow-y-auto max-h-[60vh]">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Equipos
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border/50 bg-card/50 p-3">
                <p className="text-xs text-muted-foreground mb-1">Peleador 1</p>
                <p className="text-sm font-semibold leading-tight">
                  {nombreCompleto(combate.peleador1)}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Users className="h-3 w-3 text-primary/70" />
                  <p className="text-xs text-muted-foreground">
                    {combate.peleador1.equipo.nombre}
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-border/50 bg-card/50 p-3">
                <p className="text-xs text-muted-foreground mb-1">Peleador 2</p>
                <p className="text-sm font-semibold leading-tight">
                  {nombreCompleto(combate.peleador2)}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Users className="h-3 w-3 text-primary/70" />
                  <p className="text-xs text-muted-foreground">
                    {combate.peleador2.equipo.nombre}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Detalles técnicos
          </p>

          <DetailRow
            icon={Repeat2}
            label="Rounds"
            value={`${combate.rounds} rounds de ${combate.duracionRounds} min`}
          />
          <DetailRow
            icon={Swords}
            label="Modalidad"
            value={combate.modalidad.nombre}
          />
          <DetailRow
            icon={Shield}
            label="Categoría de peso"
            value={
              combate.categoriaPeso.limiteInferior !== undefined &&
              combate.categoriaPeso.limiteSuperior !== undefined &&
              combate.categoriaPeso.limiteInferior !== null &&
              combate.categoriaPeso.limiteSuperior !== null
                ? `${combate.categoriaPeso.nombre} ${combate.categoriaPeso.limiteInferior}-${combate.categoriaPeso.limiteSuperior}kg`
                : combate.categoriaPeso.nombre
            }
          />
          <DetailRow
            icon={Star}
            label="Tipo de combate"
            value={combate.titulo ? "Por el Título 🏆" : "Combate regular"}
          />
          {combate.horarioEstimado && (
            <DetailRow
              icon={Clock}
              label="Horario estimado"
              value={combate.horarioEstimado}
            />
          )}

          {esFinalizado && combate.ganador && (
            <>
              <div className="mt-4 mb-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Resultado
                </p>
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 mt-1">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-semibold text-foreground">
                    {nombreCompleto(combate.ganador)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground">Vía</span>
                    <p className="font-medium">{combate.viaVictoria}</p>
                  </div>
                  {tiempoFin && (
                    <div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Timer className="h-3 w-3" /> Tiempo
                      </span>
                      <p className="font-medium">{tiempoFin}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
