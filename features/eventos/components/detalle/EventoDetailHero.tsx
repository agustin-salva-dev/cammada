import * as React from "react";
import { Calendar, Clock, Building2, MapPin } from "lucide-react";
import type { EventoPublicoDetalle } from "@/features/eventos/queries";
import {
  ESTADO_COLOR,
  ESTADO_LABEL,
  formatFechaLarga,
  groupByModalidadBase,
} from "../../utils/eventHelpers";

interface EventoDetailHeroProps {
  evento: EventoPublicoDetalle;
}

export function EventoDetailHero({ evento }: EventoDetailHeroProps) {
  const {
    numero,
    fecha,
    horaInicio,
    lugarNombre,
    calle,
    calleNumero,
    estado,
    combates,
  } = evento;

  const modalidadCounts = groupByModalidadBase(combates);
  const estadoLabel = ESTADO_LABEL[estado] ?? estado;
  const estadoClasses =
    ESTADO_COLOR[estado] ?? "bg-muted/60 text-muted-foreground border-border";

  return (
    <div className="group relative rounded-3xl border border-border bg-white/2 overflow-hidden p-4 sm:p-8 xl:p-12 w-full animate-fade-in">
      <p className="absolute right-0 top-2 sm:top-7.5 text-foreground opacity-[0.04] font-heading text-[140px] sm:text-[280px] xl:text-[420px] 2xl:text-[480px] font-bold italic leading-none pointer-events-none select-none">
        #{numero}
      </p>

      <div className="relative z-10 flex flex-col gap-6 sm:gap-8">
        <div className="flex flex-col gap-2 sm:gap-3">
          <span
            className={`w-fit text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border ${estadoClasses}`}
          >
            {estadoLabel}
          </span>
          <h1 className="font-heading font-black text-4xl sm:text-6xl xl:text-8xl 2xl:text-9xl uppercase leading-none text-foreground tracking-tight">
            CA<span className="text-primary">MMA</span>DA
          </h1>
          <p className="uppercase text-base sm:text-xl xl:text-2xl 2xl:text-4xl font-light mt-0.5 sm:mt-1 text-muted-foreground">
            Fight Session #{numero}
          </p>
          <p className="uppercase italic text-[8px] mt-2 sm:mt-3 bg-primary/5 w-fit py-1 sm:py-1.5 px-2.5 sm:px-3 rounded-md text-muted-foreground border border-primary/20 backdrop-blur-lg font-extralight group-hover:bg-primary group-hover:text-white transition-all duration-300 ease-in-out">
            Cammada Revolution
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              icon: Calendar,
              label: "Fecha",
              value: formatFechaLarga(fecha),
            },
            {
              icon: Clock,
              label: "Horario",
              value: `Desde las: ${horaInicio}`,
            },
            { icon: Building2, label: "Lugar", value: lugarNombre },
            {
              icon: MapPin,
              label: "Dirección",
              value: `${calle} ${calleNumero}`,
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-start gap-3 rounded-xl border border-border/60 drop-shadow-lg bg-white/2 backdrop-blur-xs p-3 sm:p-4 min-w-0"
            >
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                <Icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  {label}
                </p>
                <p className="text-xs sm:text-sm font-medium text-foreground capitalize mt-0.5 truncate max-w-full">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {combates.length > 0 && (
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            <div className="flex flex-col items-center px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border border-primary/20 bg-primary/5">
              <span className="text-xl sm:text-2xl font-black font-heading text-primary">
                {combates.length}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                Combates
              </span>
            </div>
            {Object.entries(modalidadCounts).map(([nombre, count]) => (
              <div
                key={nombre}
                className="flex flex-col items-center px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border border-white/10 bg-white/2"
              >
                <span className="text-xl sm:text-2xl font-black font-heading text-foreground">
                  {count}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                  {nombre}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
