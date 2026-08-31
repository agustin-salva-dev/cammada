import type { TimelineEvent } from "../types";

const events: TimelineEvent[] = [
  {
    period: "2023",
    title: "El nacimiento de Cammada",
    description:
      "Apasionados por las artes marciales y buscando hacerlas crecer en Salta, dimos vida a Cammada Fight Session. La primera edición demuestra que Salta Capital tiene nivel para organizar eventos de combate serios y profesionales.",
  },
  {
    period: "2024",
    title: "Crecimiento y consolidación",
    description:
      "Las ediciones de Cammada Fight Session comienzan a crecer en convocatoria, calidad de la cartelera y diversidad de modalidades: MMA, Kickboxing y Grappling. La organización se consolida como referente regional.",
  },
  {
    period: "2025",
    title: "Talento exportado",
    description:
      "Los atletas que surgieron en nuestro circuito comienzan a participar en eventos nacionales e internacionales. Actuamos como vidriera y plataforma de lanzamiento para el talento del Norte Argentino.",
  },
  {
    period: "2026",
    title: "Plataforma digital oficial",
    description:
      "Lanzamiento de la plataforma web oficial de Cammada Fight Session: carteleras en tiempo real, rankings, perfiles de atletas, predicciones comunitarias y sistema de venta de entradas digitales.",
  },
];

export function AboutTimeline() {
  return (
    <section
      aria-label="Historia de Cammada Fight Session"
      className="flex flex-col gap-0"
    >
      <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground mb-8">
        Nuestra historia
      </h2>
      <ol className="relative border-l border-border/50 flex flex-col gap-0">
        {events.map((event, index) => (
          <li key={index} className="ml-6 pb-10 last:pb-0 relative">
            <span
              aria-hidden="true"
              className="absolute -left-6.75 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 border border-primary/50 ring-4 ring-background"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <time className="text-xs font-semibold uppercase tracking-widest text-primary mb-1 block">
              {event.period}
            </time>
            <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1.5">
              {event.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
