import type { Metadata } from "next";
import { Users } from "lucide-react";
import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { LuchadoresGrid } from "@/features/luchadores/components/public/grids/LuchadoresGrid";
import { getLuchadoresPublicos } from "@/features/luchadores/actions/public";

export const metadata: Metadata = {
  title: "Luchadores — Cammada",
  description:
    "Explorá el roster completo de peleadores de Cammada. Conocé sus récords, equipos, categorías de peso y su trayectoria dentro de la organización.",
  openGraph: {
    title: "Luchadores — Cammada",
    description:
      "Roster completo de peleadores de Cammada con récords, categorías y equipos.",
    type: "website",
  },
};

export default async function LuchadoresPage() {
  const result = await getLuchadoresPublicos();
  const luchadores = result.success && result.data ? result.data : [];

  return (
    <div className="min-h-dvh w-full overflow-x-hidden flex flex-col items-center px-4 sm:px-6 md:px-8 gap-10 sm:gap-12">
      <Navbar />
      <main className="w-full flex flex-col items-center gap-4 md:gap-6 xl:gap-8 2xl:gap-9 pt-20 pb-15 sm:pt-24 sm:pb-18 xl:pt-32 xl:pb-20">
        <div className="flex flex-col items-center gap-2.5 sm:gap-3 text-center max-w-3xl px-2 animate-fade-in">
          <div className="flex items-center py-1 px-1.5 rounded-md gap-2 bg-background/20 border border-border backdrop-blur-sm text-primary text-[10px] sm:text-xs font-medium uppercase tracking-widest">
            <Users size={14} />
            <span className="text-shadow-md">Cammada · Roster Oficial</span>
          </div>
          <h1 className="font-bold font-heading text-4xl sm:text-6xl lg:text-7xl 2xl:text-8xl uppercase text-foreground leading-none tracking-tight">
            Luchadores
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base font-light max-w-xl">
            Todos los atletas que han competido bajo el estandarte de{" "}
            <span className="text-foreground font-medium">Cammada</span>.
            Récords, categorías y equipos representados.
          </p>
        </div>

        <div className="w-full animate-fade-in">
          <LuchadoresGrid luchadores={luchadores} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
