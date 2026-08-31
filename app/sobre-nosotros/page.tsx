import type { Metadata } from "next";
import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { AboutTimeline } from "@/features/organization/components/AboutTimeline";
import { MissionVisionGrid } from "@/features/organization/components/MissionVisionGrid";
import { siteConfig } from "@/config/site";
import { Swords } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Sobre Nosotros — Cammada Fight Session",
  description: `Conocé la historia y la misión de ${siteConfig.name}: la organización independiente de artes marciales mixtas del Norte Argentino, con base en Salta Capital.`,
  alternates: {
    canonical: `${siteConfig.url}/sobre-nosotros`,
  },
};

/**
 * Página institucional "Sobre Nosotros".
 * Componente de servidor: sin estado cliente. Performance máxima. (SRP)
 */
export default function SobreNosotrosPage() {
  return (
    <div className="min-h-dvh w-full overflow-x-hidden flex flex-col">
      <Navbar />

      <main className="flex-1 w-full px-4 md:px-8 2xl:px-42 py-20 sm:py-24 xl:pt-32 xl:pb-24 flex flex-col gap-14 sm:gap-20">
        <header className="flex flex-col gap-4 animate-fade-in">
          <div className="flex items-center gap-2 text-primary text-[10px] sm:text-xs font-medium uppercase tracking-widest">
            <Swords size={14} aria-hidden="true" />
            <span>Cammada Fight Session — Salta Capital, Argentina</span>
          </div>
          <h1 className="font-bold font-heading text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight tracking-tight">
            Sobre Nosotros
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
            Somos personas apasionadas por las artes marciales mixtas del Norte
            Argentino. Desde{" "}
            <span className="text-foreground font-medium">Salta Capital</span>,
            organizamos eventos donde los atletas locales pueden demostrar su
            nivel y proyectarse hacia escenarios de mayor alcance.
          </p>
        </header>

        <section className="animate-fade-in">
          <MissionVisionGrid />
        </section>

        <section className="animate-fade-in">
          <AboutTimeline />
        </section>

        <section
          aria-label="Contactanos"
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 sm:p-8 rounded-xl border border-border/50 bg-white/2 animate-fade-in"
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-base sm:text-lg font-semibold text-foreground font-heading">
              ¿Querés saber más o participar?
            </h2>
            <p className="text-sm text-muted-foreground">
              Si representás un gimnasio, equipo o atleta y te interesa
              participar en próximas ediciones de Cammada, escribinos.
            </p>
          </div>
          <Link
            href={ROUTES.CONTACTO}
            className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all text-sm font-medium px-5 py-2.5 rounded-lg"
          >
            Contactanos
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
