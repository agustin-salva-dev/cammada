import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { Globe } from "lucide-react";
import { TalentoExportadoSkeleton } from "@/features/luchadores/components/exportados/TalentoExportadoSkeleton";

export default function TalentoExportadoLoading() {
  return (
    <div className="min-h-dvh w-full overflow-x-hidden flex flex-col items-center px-4 sm:px-6 md:px-8 py-20 sm:py-24 xl:pt-32 xl:pb-20 gap-10 sm:gap-12">
      <Navbar />

      <div className="flex flex-col items-center gap-2.5 sm:gap-3 text-center max-w-3xl px-2">
        <div className="flex items-center py-1 px-1.5 rounded-md gap-2 bg-black/30 border-border backdrop-blur-sm text-primary text-[10px] sm:text-xs font-medium uppercase tracking-widest">
          <Globe size={14} />
          <span className="text-shadow-md">
            Cammada · Proyección Internacional
          </span>
        </div>
        <h1 className="font-bold font-heading text-4xl sm:text-6xl lg:text-7xl 2xl:text-8xl uppercase text-foreground leading-none tracking-tight">
          Talento Exportado
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm md:text-base font-light max-w-xl">
          Nuestros atletas que han competido en las jaulas de{" "}
          <span className="text-foreground font-medium">Cammada</span> y han
          sido potenciados hacia grandes eventos de nivel nacional e
          internacional.
        </p>
      </div>

      <div className="w-full max-w-6xl">
        <TalentoExportadoSkeleton />
      </div>

      <Footer />
    </div>
  );
}
