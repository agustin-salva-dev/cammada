import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { Trophy } from "lucide-react";
import { getPublicRankings } from "@/features/rankings/queries";
import { RankingsPageClient } from "@/features/rankings/components/RankingsPageClient";

export const metadata = {
  title: "Rankings — Cammada",
  description:
    "Consultá los rankings oficiales de Cammada por categoría de peso y libra por libra. Conocé quién lidera cada división y el historial de peleas.",
};

export default async function RankingsPage() {
  const rankings = await getPublicRankings();

  return (
    <div className="min-h-dvh w-full overflow-x-hidden flex flex-col items-center px-4 sm:px-6 md:px-8 gap-10 sm:gap-12">
      <Navbar />
      <main className="w-full flex flex-col items-center gap-4 md:gap-6 xl:gap-8 2xl:gap-9 pt-20 pb-15 sm:pt-24 sm:pb-18 xl:pt-32 xl:pb-20">
        <div className="flex flex-col items-center gap-2.5 sm:gap-3 text-center max-w-2xl px-2 animate-fade-in">
          <div className="flex items-center gap-2 text-primary text-[10px] sm:text-xs font-medium uppercase tracking-widest">
            <Trophy size={14} />
            <span>Cammada · Clasificaciones Oficiales</span>
          </div>
          <h1 className="font-bold font-heading text-5xl sm:text-6xl lg:text-8xl 2xl:text-9xl uppercase text-foreground leading-none tracking-tight">
            Rankings
          </h1>
          <p className="text-muted-foreground text-[8px] sm:text-xs md:text-sm xl:text-base font-light max-w-lg">
            Explorá las clasificaciones oficiales de{" "}
            <span className="text-foreground font-medium">Cammada</span> por
            categoría de peso y el ranking{" "}
            <span className="text-primary font-medium">libra por libra</span>.
            Conocé al campeón y los mejores peleadores de cada división.
          </p>
        </div>

        <div className="w-full max-w-5xl animate-fade-in">
          <RankingsPageClient rankings={rankings} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
