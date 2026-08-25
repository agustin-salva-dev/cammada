"use client";

import Link from "next/link";
import SpotlightCard from "@/components/SpotlightCard";
import ShinyText from "@/components/ShinyText";
import { Swords, Medal, MapPin, Calendar, ArrowRight } from "lucide-react";
import type { EventoPublico } from "@/features/eventos/queries";
import {
  ESTADO_LABEL,
  formatFechaCorta,
  groupByModalidadBase,
} from "@/features/eventos/utils/eventHelpers";
import { useEventCountdown } from "@/features/eventos/hooks/useEventCountdown";

interface EventCardProps {
  evento: EventoPublico;
  variant?: "default" | "home";
  className?: string;
}

export default function EventCard({
  evento,
  variant = "default",
  className = "",
}: EventCardProps) {
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

  const peleaEstelar = combates.find((c) => c.tipo === "ESTELAR");
  const modalidadCounts = groupByModalidadBase(combates);
  const estadoLabel = ESTADO_LABEL[estado] ?? estado;
  const isHome = variant === "home";

  const countdown = useEventCountdown(fecha, horaInicio);

  return (
    <SpotlightCard
      className={`mt-auto lg:mt-0 group z-0 flex flex-col gap-3 justify-between bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 hover:scale-98 hover:-translate-y-1 translate-x-0 drop-shadow-xl transition-all duration-400 overflow-hidden ${className}`}
      spotlightColor="rgba(165, 31, 232, 1)"
    >
      <p className="drop-shadow-xl text-foreground opacity-[0.017] font-heading text-[180px] sm:text-[260px] lg:text-[365px] 2xl:text-[500px] absolute -top-30 -left-25 font-bold italic -rotate-10 pointer-events-none select-none">
        #{numero}
      </p>

      <div className="flex flex-col items-center">
        <Swords className="drop-shadow-xl group-hover:text-primary transition-all duration-600 size-4 md:size-7 2xl:size-11" />
        <h3 className="drop-shadow-xl text-[10px] sm:text-xs 2xl:text-lg uppercase font-light tracking-normal">
          {estadoLabel}
        </h3>

        {isHome ? (
          !countdown.isExpired ? (
            <ShinyText
              text={
                countdown.isMounted
                  ? countdown.formatted
                  : `0${String(numero).padStart(2, "0")}D : 00H : 00M : 00S`
              }
              speed={0.9}
              delay={1.5}
              color="#a51fe8"
              shineColor="#bb7cdc"
              spread={70}
              direction="left"
              yoyo={false}
              pauseOnHover={false}
              disabled={false}
              className="drop-shadow-lg font-heading font-semibold text-primary text-xl sm:text-3xl xl:text-5xl 2xl:text-7xl tracking-normal text-center"
            />
          ) : (
            <ShinyText
              text={`CAMMADA FIGHT SESSION - ${numero}`}
              speed={0.9}
              delay={1.5}
              color="#a51fe8"
              shineColor="#bb7cdc"
              spread={70}
              direction="left"
              yoyo={false}
              pauseOnHover={false}
              disabled={false}
              className="text-center mt-2 drop-shadow-lg font-heading font-semibold text-primary text-2xl sm:text-3xl xl:text-[34px] 2xl:text-4xl tracking-normal"
            />
          )
        ) : (
          <ShinyText
            text={`CAMMADA FIGHT SESSION - ${numero}`}
            speed={0.9}
            delay={1.5}
            color="#a51fe8"
            shineColor="#bb7cdc"
            spread={70}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
            className="text-center mt-2 drop-shadow-lg font-heading font-semibold text-primary text-2xl sm:text-3xl xl:text-[34px] 2xl:text-4xl tracking-normal"
          />
        )}
      </div>

      {peleaEstelar ? (
        <>
          <p className="drop-shadow-xl text-muted-foreground text-[10px] xl:text-xs 2xl:text-xl text-center">
            Cartelera Estelar
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 xl:gap-6 2xl:gap-10 items-center justify-between">
            <div className="flex flex-col items-center">
              <p className="drop-shadow-md text-sm sm:text-base 2xl:text-3xl font-heading text-center">
                {peleaEstelar.peleador1.nombre}{" "}
                {peleaEstelar.peleador1.apodo && (
                  <span className="text-primary font-semibold">
                    &quot;{peleaEstelar.peleador1.apodo}&quot;
                  </span>
                )}{" "}
                {peleaEstelar.peleador1.apellido}
              </p>
              <p className="drop-shadow-md text-[10px] sm:text-xs 2xl:text-xl text-muted-foreground">
                {peleaEstelar.peleador1.equipo?.nombre ?? ""}
              </p>
            </div>

            <p className="drop-shadow-xl w-fit mx-auto bg-primary py-0.5 px-2 rounded-lg shrink-0 text-xs xl:text-sm 2xl:text-2xl font-bold text-primary-foreground">
              vs
            </p>

            <div className="flex flex-col items-center">
              <p className="drop-shadow-md text-sm sm:text-base 2xl:text-3xl font-heading text-center">
                {peleaEstelar.peleador2.nombre}{" "}
                {peleaEstelar.peleador2.apodo && (
                  <span className="text-primary font-semibold">
                    &quot;{peleaEstelar.peleador2.apodo}&quot;
                  </span>
                )}{" "}
                {peleaEstelar.peleador2.apellido}
              </p>
              <p className="drop-shadow-md text-[10px] sm:text-xs 2xl:text-xl text-muted-foreground">
                {peleaEstelar.peleador2.equipo?.nombre ?? ""}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 xl:gap-4 2xl:gap-6 items-center justify-center">
            {peleaEstelar.titulo && (
              <div className="flex items-center gap-1 drop-shadow-xl bg-primary text-center w-fit py-0.5 sm:py-0.75 2xl:py-1.5 px-2.5 2xl:px-3.5 rounded-lg font-medium text-[10px] sm:text-xs 2xl:text-sm">
                <Medal strokeWidth={1} className="size-4 2xl:size-5" />
                <p>Título — {peleaEstelar.categoriaPeso.nombre}</p>
              </div>
            )}
            <p className="drop-shadow-xl bg-transparent/50 backdrop-blur-sm border border-border/20 text-center w-fit py-0.5 sm:py-0.75 2xl:py-1.5 px-2.5 2xl:px-3.5 rounded-lg font-medium text-[10px] sm:text-xs 2xl:text-sm">
              {peleaEstelar.modalidad.nombre}
            </p>
          </div>
        </>
      ) : (
        <p className="drop-shadow-xl text-muted-foreground text-xs sm:text-sm xl:text-lg 2xl:text-2xl text-center font-heading italic">
          Cartelera por confirmar
        </p>
      )}

      {Object.keys(modalidadCounts).length > 0 && (
        <div className="flex justify-around items-center flex-wrap gap-2 sm:gap-y-3">
          <div className="flex flex-col gap-0.5 text-center items-center">
            <p className="text-white bg-primary w-fit px-1.75 2xl:px-2.25 py-0.5 2xl:py-1 2xl:text-2xl rounded-md font-heading font-semibold text-xs sm:text-sm">
              {combates.length}
            </p>
            <p className="text-[9px] sm:text-[10px] 2xl:text-lg font-light uppercase text-foreground/70 group-hover:text-foreground group-hover:font-medium transition-all duration-600">
              Combates
            </p>
          </div>
          {Object.entries(modalidadCounts).map(([nombre, count]) => (
            <div
              key={nombre}
              className="flex flex-col gap-0.5 text-center items-center"
            >
              <p className="text-white bg-primary w-fit  px-1.75 2xl:px-2.5 py-0.5 2xl:py-1 2xl:text-2xl rounded-md font-heading font-semibold text-xs sm:text-sm">
                {count}
              </p>
              <p className="text-[9px] sm:text-[10px] 2xl:text-sm font-light uppercase text-foreground/70 group-hover:text-foreground group-hover:font-medium transition-all duration-600">
                {nombre}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 justify-center text-[10px] sm:text-xs 2xl:text-lg text-muted-foreground text-center">
          <Calendar size={11} className="shrink-0" />
          <span>
            {formatFechaCorta(fecha)} — Desde las {horaInicio}
          </span>
        </div>
        <div className="flex items-center gap-1.5 justify-center text-[9px] sm:text-[10px] 2xl:text-lg text-center text-muted-foreground opacity-60 font-light">
          <MapPin size={11} className="shrink-0" />
          <span className="truncate max-w-full">
            {lugarNombre} — {calle} {calleNumero}
          </span>
        </div>
      </div>

      <Link
        href={`/eventos/${numero}`}
        className="flex items-center justify-center gap-2 w-full py-1.5 2xl:py-2 px-3 2xl:px-4 rounded-xl bg-primary/10 border border-primary/30 text-primary font-medium text-xs sm:text-sm 2xl:text-2xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 group/btn mt-1"
      >
        <span>Ver cartelera</span>
        <ArrowRight
          size={15}
          className="transition-transform duration-300 group-hover/btn:translate-x-1"
        />
      </Link>
    </SpotlightCard>
  );
}
