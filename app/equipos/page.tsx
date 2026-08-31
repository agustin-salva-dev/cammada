import type { Metadata } from "next";
import { Shield } from "lucide-react";
import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { EquiposGrid } from "@/features/equipos/components/public/grids/EquiposGrid";
import { getEquiposPublicos } from "@/features/equipos/actions/public";

export const metadata: Metadata = {
  title: "Equipos — Cammada",
  description:
    "Conocé todos los equipos y gimnasios que han participado en Cammada. Explorá sus planteles, récords acumulados y atletas representados.",
  openGraph: {
    title: "Equipos — Cammada",
    description:
      "Directorio de equipos y gimnasios participantes en Cammada con sus planteles y estadísticas.",
    type: "website",
  },
};

export default async function EquiposPage() {
  const result = await getEquiposPublicos();
  const equipos = result.success && result.data ? result.data : [];

  return (
    <div className="min-h-dvh w-full overflow-x-hidden flex flex-col items-center px-4 sm:px-6 md:px-8 gap-10 sm:gap-12">
      <Navbar />
      <main className="w-full flex flex-col items-center gap-4 md:gap-6 xl:gap-8 2xl:gap-9 pt-20 pb-15 sm:pt-24 sm:pb-18 xl:pt-32 xl:pb-20">
        <div className="flex flex-col items-center gap-2.5 sm:gap-3 text-center max-w-3xl px-2 animate-fade-in">
          <div className="flex items-center py-1 px-1.5 rounded-md gap-2 bg-background/20 border border-border backdrop-blur-sm text-primary text-[10px] sm:text-xs font-medium uppercase tracking-widest">
            <Shield size={14} />
            <span className="text-shadow-md">
              Cammada · Equipos Participantes
            </span>
          </div>
          <h1 className="font-bold font-heading text-4xl sm:text-6xl lg:text-7xl 2xl:text-8xl uppercase text-foreground leading-none tracking-tight">
            Equipos
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base font-light max-w-xl">
            Los gimnasios y academias que forman parte de la historia de{" "}
            <span className="text-foreground font-medium">Cammada</span>.
            Explorá sus planteles y estadísticas.
          </p>
        </div>

        <div className="w-full animate-fade-in">
          <EquiposGrid equipos={equipos} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
