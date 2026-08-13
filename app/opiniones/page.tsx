import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquarePlus } from "lucide-react";
import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { DashboardMetricas } from "@/features/opiniones/components/display/DashboardMetricas";
import { MuroOpiniones } from "@/features/opiniones/components/display/MuroOpiniones";
import { TopSugerencias } from "@/features/opiniones/components/display/TopSugerencias";
import {
  getPublicOpiniones,
  getTopSugerencias,
  getMetricasGenerales,
  getNPSResultados,
} from "@/features/opiniones/queries";

export const metadata: Metadata = {
  title: "Opiniones & Comunidad - Cammada",
  description:
    "Conocé las experiencias, valoraciones y sugerencias más votadas de los atletas y espectadores en Cammada.",
};

export default async function OpinionesPage() {
  const [metricas, opiniones, sugerencias, npsResultados] = await Promise.all([
    getMetricasGenerales(),
    getPublicOpiniones(),
    getTopSugerencias(),
    getNPSResultados(),
  ]);

  return (
    <div className="min-h-dvh w-full overflow-x-hidden flex flex-col items-center px-4 sm:px-6 md:px-8 py-20 sm:py-24 xl:pt-32 xl:pb-20 gap-10 sm:gap-14">
      <Navbar />

      <div className="w-full max-w-5xl mx-auto space-y-14 animate-fade-in">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
            💬 Transparencia & Comunidad
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Opiniones del Evento
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            Explorá el impacto del evento, las ideas más votadas por los
            participantes y las valoraciones de la comunidad.
          </p>

          <div className="pt-2">
            <Link
              href="/opinar"
              id="btn-hero-ir-a-opinar"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-yellow-400 text-black hover:bg-yellow-300 transition-all duration-200 shadow-lg shadow-yellow-400/20 hover:scale-105"
            >
              <MessageSquarePlus className="w-4 h-4" /> Dejar tu opinión
            </Link>
          </div>
        </header>

        <TopSugerencias sugerencias={sugerencias} />

        <MuroOpiniones opiniones={opiniones} />

        <DashboardMetricas metricas={metricas} npsResultados={npsResultados} />

        <section className="rounded-2xl border border-yellow-400/20 bg-linear-to-r from-yellow-400/10 via-yellow-400/5 to-transparent p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold">
              ¿Participaste del evento Cammada?
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg">
              Tu feedback nos ayuda a mejorar cada aspecto de la competencia.
              Calificá las áreas del evento o dejá tu sugerencia.
            </p>
          </div>

          <Link
            href="/opinar"
            id="btn-banner-ir-a-opinar"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-yellow-400 text-black hover:bg-yellow-300 transition-all duration-200 shadow-lg shadow-yellow-400/20 hover:scale-105"
          >
            <MessageSquarePlus className="w-4 h-4" /> Dejar tu opinión
          </Link>
        </section>
      </div>

      <Footer />
    </div>
  );
}
