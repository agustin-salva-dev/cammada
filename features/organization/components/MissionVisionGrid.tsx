import { Target, Globe, Shield, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Pillar {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const pillars: Pillar[] = [
  {
    id: "mision",
    icon: Target,
    title: "Misión",
    description:
      "Organizar eventos de deportes de combate de alta calidad en Salta Capital, brindando a los atletas del Norte Argentino un escenario profesional donde demostrar su nivel y proyectarse hacia competencias de mayor alcance.",
  },
  {
    id: "vision",
    icon: Globe,
    title: "Visión",
    description:
      "Ser la organización de referencia del circuito de artes marciales del Norte Argentino, reconocida por la seriedad de sus eventos, la transparencia de sus rankings y el compromiso genuino con el desarrollo de sus atletas.",
  },
  {
    id: "integridad",
    icon: Shield,
    title: "Integridad",
    description:
      "Operar con total transparencia: carteleras justas, rankings basados en resultados reales y un trato profesional y respetuoso hacia cada atleta, equipo y miembro de la comunidad.",
  },
  {
    id: "comunidad",
    icon: Users,
    title: "Comunidad",
    description:
      "Construir un espacio donde aficionados, atletas, coaches y equipos puedan encontrarse, apoyarse y crecer juntos alrededor de los deportes de combate.",
  },
];

export function MissionVisionGrid() {
  return (
    <section aria-label="Misión, Visión y Valores de Cammada">
      <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground mb-8">
        Quiénes somos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.id}
              className="group flex flex-col gap-3 p-5 sm:p-6 rounded-xl border border-border/50 bg-white/2 hover:bg-white/5 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <Icon size={18} aria-hidden="true" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground">
                  {pillar.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
