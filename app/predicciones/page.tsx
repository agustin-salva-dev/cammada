import type { Metadata } from "next";
import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { PrediccionesPublicClient } from "@/features/predicciones/components/display/PrediccionesPublicClient";
import {
  getEventosConPredicciones,
  getPrediccionesEvento,
} from "@/features/predicciones/queries";

export const metadata: Metadata = {
  title: "Predicciones de Combates - Cammada",
  description:
    "Votá por tus peleadores favoritos para el próximo evento de Cammada y mirá los porcentajes de predicción de la comunidad en tiempo real.",
};

export default async function PrediccionesPage() {
  const eventos = await getEventosConPredicciones();
  const primerEventoId = eventos[0]?.id;

  const eventoInicial = primerEventoId
    ? await getPrediccionesEvento(primerEventoId)
    : null;

  return (
    <div className="min-h-dvh w-full overflow-x-hidden flex flex-col items-center px-4 sm:px-6 md:px-8 gap-10 sm:gap-14">
      <Navbar />

      <main className="w-full flex flex-col items-center gap-4 md:gap-6 xl:gap-8 2xl:gap-9 pt-20 pb-15 sm:pt-24 sm:pb-18 xl:pt-32 xl:pb-20">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            🎯 Predicciones de la Comunidad
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            ¿Quién ganará?
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
            Elegí a tu ganador para cada combate de la cartelera y descubrí a
            quién apoya la comunidad.
          </p>
        </header>

        <PrediccionesPublicClient
          eventos={eventos}
          eventoInicial={eventoInicial}
        />
      </main>

      <Footer />
    </div>
  );
}
