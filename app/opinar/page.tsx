import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { ValoracionAspectos } from "@/features/opiniones/components/interactive/ValoracionAspectos";
import { IndiceImpactoNPS } from "@/features/opiniones/components/interactive/IndiceImpactoNPS";
import { ModalOpinion } from "@/features/opiniones/components/interactive/ModalOpinion";

export const metadata: Metadata = {
  title: "Dejá tu Opinión & Feedback - Cammada",
  description:
    "Calificá los aspectos del evento Cammada, completá la evaluación y dejanos tu comentario o sugerencia.",
};

export default function OpinarPage() {
  return (
    <div className="min-h-dvh w-full overflow-x-hidden flex flex-col items-center px-4 sm:px-6 md:px-8 py-20 sm:py-24 xl:pt-32 xl:pb-20 gap-10 sm:gap-12">
      <Navbar />

      <div className="w-full max-w-4xl mx-auto space-y-12 animate-fade-in">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
            <Sparkles className="w-3.5 h-3.5" /> Tu opinión nos ayuda a crecer
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Calificá tu Experiencia en Cammada
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            Valorá los aspectos del torneo e indicá tu nivel de satisfacción.
            ¡Tus respuestas son fundamentales para la próxima edición!
          </p>

          <div className="pt-2 flex justify-center">
            <ModalOpinion />
          </div>
        </header>

        <ValoracionAspectos />
        <IndiceImpactoNPS />

        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 text-center space-y-4">
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-xl font-bold">
              ¿Querés agregar un comentario o sugerencia escrita?
            </h2>
            <p className="text-sm text-muted-foreground">
              Contanos más detalles de tu vivencia o proponé una idea concreta
              para el próximo evento. Las sugerencias pueden ser votadas por la
              comunidad.
            </p>
          </div>

          <div className="pt-2">
            <ModalOpinion />
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
