"use client";

import { useState, useTransition } from "react";
import {
  CalendarFold,
  Swords,
  MapPin,
  Clock,
  Building2,
  Trophy,
  Users,
  Shield,
  TrendingUp,
  Award,
  ChevronDown,
  Flame,
  Star,
  Crown,
  Dumbbell,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MyBadge } from "@/components/ui/MyBadge";
import { getDashboardData } from "../actions";
import type { DashboardData, EventoDropdownItem } from "../actions";
import { ESTADO_LABELS, type EstadoEvento } from "@/features/eventos/zod";
import { TIPO_COMBATE_LABELS, type TipoCombate } from "@/features/combates/zod";

// ─── Badge variants ──────────────────────────────────────────────────

const ESTADO_BADGE_VARIANT: Record<
  EstadoEvento,
  "default" | "secondary" | "destructive" | "outline" | "green"
> = {
  BORRADOR: "secondary",
  PROGRAMADO: "outline",
  CONFIRMADO: "green",
  FINALIZADO: "default",
  CANCELADO: "destructive",
};

// ─── Helpers ─────────────────────────────────────────────────────────

function formatFecha(fechaStr: string | Date): string {
  const date = new Date(fechaStr);
  return date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatFechaCorta(fechaStr: string | Date): string {
  const date = new Date(fechaStr);
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Sub-components ──────────────────────────────────────────────────

function KpiCard({
  icon: Icon,
  label,
  value,
  gradient,
}: {
  icon: typeof Swords;
  label: string;
  value: number | string;
  gradient: string;
}) {
  return (
    <Card
      size="sm"
      className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div
        className={`absolute inset-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity ${gradient}`}
      />
      <CardContent className="flex items-center gap-3.5 relative">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          <p className="text-xs text-muted-foreground truncate">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function CombateDestacadoCard({
  combate,
}: {
  combate: DashboardData["combatesDestacados"][number];
}) {
  const isEstelar = combate.tipo === "ESTELAR";

  return (
    <Card
      size="sm"
      className={`group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 ${
        isEstelar
          ? "ring-2 ring-primary/30 hover:ring-primary/50"
          : "hover:shadow-md"
      }`}
    >
      {isEstelar && (
        <div className="absolute inset-0 bg-linear-to-br from-primary/4 to-transparent" />
      )}
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/30 relative">
        <div className="flex items-center gap-2">
          {isEstelar ? (
            <Crown className="h-4.5 w-4.5 text-primary" />
          ) : (
            <Star className="h-4.5 w-4.5 text-muted-foreground" />
          )}
          <span className="text-sm font-semibold">
            {TIPO_COMBATE_LABELS[combate.tipo as TipoCombate]}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {combate.titulo && (
            <MyBadge variant="default" text="Título en juego" />
          )}
          <MyBadge variant="outline" text={combate.modalidad.nombre} />
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className="flex items-center justify-between gap-4 py-1">
          {/* Peleador 1 */}
          <div className="flex-1 text-center min-w-0">
            <p className="text-base font-bold truncate">
              {combate.peleador1.nombre} {combate.peleador1.apellido}
            </p>
            {combate.peleador1.apodo && (
              <p className="text-xs text-primary/80 italic truncate">
                &quot;{combate.peleador1.apodo}&quot;
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {combate.peleador1.equipo.nombre}
            </p>
          </div>

          {/* VS */}
          <div className="flex flex-col items-center gap-0.5 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-black text-xs">
              VS
            </div>
            <span className="text-[10px] text-muted-foreground">
              {combate.rounds}×{combate.duracionRounds}&apos;
            </span>
          </div>

          {/* Peleador 2 */}
          <div className="flex-1 text-center min-w-0">
            <p className="text-base font-bold truncate">
              {combate.peleador2.nombre} {combate.peleador2.apellido}
            </p>
            {combate.peleador2.apodo && (
              <p className="text-xs text-primary/80 italic truncate">
                &quot;{combate.peleador2.apodo}&quot;
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {combate.peleador2.equipo.nombre}
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-1">
          <MyBadge variant="secondary" text={combate.categoriaPeso.nombre} />
        </div>
      </CardContent>
    </Card>
  );
}

function BarraProgreso({
  nombre,
  cantidad,
  maxCantidad,
}: {
  nombre: string;
  cantidad: number;
  maxCantidad: number;
}) {
  const porcentaje = maxCantidad > 0 ? (cantidad / maxCantidad) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-foreground truncate min-w-0 flex-1">
        {nombre}
      </span>
      <div className="flex items-center gap-2 shrink-0">
        <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${porcentaje}%` }}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground w-6 text-right">
          {cantidad}
        </span>
      </div>
    </div>
  );
}

function RankingItem({
  posicion,
  nombre,
  subtitulo,
  valor,
  valorLabel,
}: {
  posicion: number;
  nombre: string;
  subtitulo?: string;
  valor: number;
  valorLabel: string;
}) {
  const medallas = ["🥇", "🥈", "🥉"];
  const medalEmoji = medallas[posicion - 1];

  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
        {medalEmoji ?? posicion}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{nombre}</p>
        {subtitulo && (
          <p className="text-xs text-muted-foreground truncate">{subtitulo}</p>
        )}
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-primary">{valor}</p>
        <p className="text-[10px] text-muted-foreground">{valorLabel}</p>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
      <CalendarFold className="h-10 w-10 mb-2 opacity-30" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

interface DashboardOverviewProps {
  initialData: DashboardData;
  eventosLista: EventoDropdownItem[];
}

export function DashboardOverview({
  initialData,
  eventosLista,
}: DashboardOverviewProps) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [selectedEventoId, setSelectedEventoId] = useState(
    initialData.evento.id,
  );
  const [isPending, startTransition] = useTransition();

  const handleEventoChange = (nuevoEventoId: string) => {
    setSelectedEventoId(nuevoEventoId);
    startTransition(async () => {
      const result = await getDashboardData(nuevoEventoId);
      if (result.success) {
        setData(result.data);
      }
    });
  };

  const { evento, combatesDestacados, topCategorias, topEquiposEvento } = data;
  const { topPeleadoresGlobal, topEquiposGlobal, kpisGlobales } = data;

  const maxCategorias = topCategorias[0]?.cantidad ?? 1;
  const maxEquiposEvento = topEquiposEvento[0]?.cantidad ?? 1;

  return (
    <div
      className={`space-y-6 transition-opacity duration-200 ${isPending ? "opacity-60 pointer-events-none" : ""}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Resumen y estadísticas de tus eventos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="evento-selector"
            className="text-xs font-medium text-muted-foreground shrink-0"
          >
            Evento:
          </label>
          <div className="relative">
            <select
              id="evento-selector"
              value={selectedEventoId}
              onChange={(e) => handleEventoChange(e.target.value)}
              disabled={isPending}
              className="h-9 appearance-none rounded-md border border-input bg-transparent py-1 pr-8 pl-2.5 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 dark:bg-input/30 dark:hover:bg-input/50"
            >
              {eventosLista.map((ev) => (
                <option
                  key={ev.id}
                  value={ev.id}
                  className="bg-[Canvas] text-[CanvasText]"
                >
                  #{ev.numero} — {formatFechaCorta(ev.fecha)}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          icon={CalendarFold}
          label="Eventos Creados"
          value={kpisGlobales.totalEventos}
          gradient="bg-gradient-to-br from-blue-500 to-purple-500"
        />
        <KpiCard
          icon={Dumbbell}
          label="Peleadores Registrados"
          value={kpisGlobales.totalLuchadores}
          gradient="bg-gradient-to-br from-green-500 to-emerald-500"
        />
        <KpiCard
          icon={Shield}
          label="Equipos Registrados"
          value={kpisGlobales.totalEquipos}
          gradient="bg-gradient-to-br from-orange-500 to-amber-500"
        />
        <KpiCard
          icon={Swords}
          label="Total Combates"
          value={kpisGlobales.totalCombates}
          gradient="bg-gradient-to-br from-red-500 to-rose-500"
        />
      </div>

      <Card size="sm" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/3 to-transparent" />
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/30 relative">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CalendarFold className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Cammada Fight Session
              </p>
              <p className="text-lg font-bold tracking-tight">
                #{evento.numero}
              </p>
            </div>
          </div>
          <MyBadge
            variant={
              ESTADO_BADGE_VARIANT[evento.estado as EstadoEvento] ?? "outline"
            }
            text={ESTADO_LABELS[evento.estado as EstadoEvento] ?? evento.estado}
          />
        </CardHeader>
        <CardContent className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarFold className="h-4 w-4 shrink-0 text-primary/70" />
              <span>{formatFecha(evento.fecha)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0 text-primary/70" />
              <span>
                {evento.horaInicio} — {evento.horaFin}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4 shrink-0 text-primary/70" />
              <span className="truncate">{evento.lugarNombre}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0 text-primary/70" />
              <span className="truncate">
                {evento.calle} {evento.calleNumero}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-border/20">
            <MyBadge
              variant="outline"
              text="Combates"
              secondaryText={String(evento.totalCombates)}
            />
            {evento.peleasDeTitulo > 0 && (
              <MyBadge
                variant="default"
                text="Título"
                secondaryText={String(evento.peleasDeTitulo)}
              />
            )}
            {Object.entries(evento.combatesPorTipo).map(([tipo, cantidad]) => (
              <MyBadge
                key={tipo}
                variant="secondary"
                text={TIPO_COMBATE_LABELS[tipo as TipoCombate] ?? tipo}
                secondaryText={String(cantidad)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {combatesDestacados.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Flame className="h-4.5 w-4.5 text-primary" />
            <h2 className="text-base font-semibold">Peleas Destacadas</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {combatesDestacados.map((combate) => (
              <CombateDestacadoCard key={combate.id} combate={combate} />
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card size="sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              <CardTitle>Top Categorías de Peso</CardTitle>
            </div>
            <CardDescription>
              Las categorías con más peleas en el evento #{evento.numero}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topCategorias.length > 0 ? (
              <div className="space-y-2.5">
                {topCategorias.map((cat) => (
                  <BarraProgreso
                    key={cat.nombre}
                    nombre={cat.nombre}
                    cantidad={cat.cantidad}
                    maxCantidad={maxCategorias}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="Sin categorías registradas" />
            )}
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <CardTitle>Top Equipos del Evento</CardTitle>
            </div>
            <CardDescription>
              Los equipos que más peleadores aportaron al evento #
              {evento.numero}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topEquiposEvento.length > 0 ? (
              <div className="space-y-2.5">
                {topEquiposEvento.map((eq) => (
                  <BarraProgreso
                    key={eq.nombre}
                    nombre={eq.nombre}
                    cantidad={eq.cantidad}
                    maxCantidad={maxEquiposEvento}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="Sin equipos registrados" />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card size="sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <CardTitle>Peleadores Más Activos</CardTitle>
            </div>
            <CardDescription>
              Peleadores con más combates en toda la historia
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topPeleadoresGlobal.length > 0 ? (
              <div className="divide-y divide-border/30">
                {topPeleadoresGlobal.map((p, i) => (
                  <RankingItem
                    key={p.id}
                    posicion={i + 1}
                    nombre={`${p.nombre} ${p.apellido}`}
                    subtitulo={p.equipo}
                    valor={p.totalPeleas}
                    valorLabel="peleas"
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="Sin datos de peleadores" />
            )}
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <CardTitle>Equipos con Más Peleadores</CardTitle>
            </div>
            <CardDescription>
              Equipos que más atletas llevaron a los eventos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topEquiposGlobal.length > 0 ? (
              <div className="divide-y divide-border/30">
                {topEquiposGlobal.map((eq, i) => (
                  <RankingItem
                    key={eq.nombre}
                    posicion={i + 1}
                    nombre={eq.nombre}
                    valor={eq.cantidad}
                    valorLabel="peleadores"
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="Sin datos de equipos" />
            )}
          </CardContent>
        </Card>
      </div>

      {Object.keys(evento.combatesPorEstado).length > 0 && (
        <Card size="sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <CardTitle>Estado de Combates</CardTitle>
            </div>
            <CardDescription>
              Distribución de estados de los combates en el evento #
              {evento.numero}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(evento.combatesPorEstado).map(
                ([estado, cantidad]) => (
                  <MyBadge
                    key={estado}
                    variant={
                      estado === "FINALIZADO"
                        ? "default"
                        : estado === "CONFIRMADO"
                          ? "green"
                          : estado === "CANCELADO"
                            ? "destructive"
                            : "outline"
                    }
                    text={estado.charAt(0) + estado.slice(1).toLowerCase()}
                    secondaryText={String(cantidad)}
                  />
                ),
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
