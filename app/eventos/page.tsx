import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import EventosCarousel from "@/features/eventos/components/EventosCarousel";
import { getPublicEventos } from "@/features/eventos/queries";
import { Swords } from "lucide-react";

export const metadata = {
  title: "Eventos — Cammada",
  description:
    "Revivé cada edición de Cammada Fight Session: carteleras completas, resultados, combates y toda la información de nuestros eventos de MMA, Kick Boxing y Grappling.",
};

export default async function Eventos() {
  const eventos = await getPublicEventos();

  return (
    <div className="min-h-dvh w-full overflow-x-hidden flex flex-col items-center px-4 sm:px-6 md:px-8 gap-8 sm:gap-10">
      <Navbar />
      <main className="w-full flex flex-col items-center gap-4 md:gap-6 xl:gap-8 2xl:gap-9 pt-20 pb-15 sm:pt-24 sm:pb-18 xl:pt-32 xl:pb-20">
        <div className="flex flex-col items-center gap-2.5 sm:gap-3 text-center max-w-2xl px-2 animate-fade-in">
          <div className="flex items-center gap-2 text-primary text-[10px] sm:text-xs font-medium uppercase tracking-widest">
            <Swords size={14} />
            <span>Cammada Fight Session</span>
          </div>
          <h1 className="font-bold font-heading text-5xl sm:text-6xl lg:text-8xl 2xl:text-9xl uppercase text-foreground leading-none tracking-tight">
            Eventos
          </h1>
          <p className="text-muted-foreground text-[10px] sm:text-sm xl:text-base font-light max-w-lg">
            Explorá cada edición de{" "}
            <span className="text-foreground font-medium">Cammada</span>; sus
            carteleras, combates, estadísticas y toda la información de cada
            noche de peleas.
          </p>
        </div>

        <div className="w-full animate-fade-in">
          {eventos.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 sm:py-24 text-center">
              <Swords size={48} className="text-primary/30" />
              <p className="text-muted-foreground text-base sm:text-lg">
                Todavía no hay eventos registrados.
              </p>
            </div>
          ) : (
            <EventosCarousel eventos={eventos} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
