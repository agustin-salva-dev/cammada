import Navbar from "@/components/layout/NavBar";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/EventCard";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { getPublicEventos } from "@/features/eventos/queries";

export default async function Home() {
  const eventos = await getPublicEventos();
  const eventoDestacado = eventos[0] ?? null;

  return (
    <div className="min-h-dvh w-full overflow-x-hidden relative flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10.5 2xl:px-42 py-20 sm:py-24 xl:pb-0 xl:py-0">
      <Navbar />
      <main className="flex flex-col xl:flex-row items-center gap-8 xl:gap-10 w-full max-w-full justify-center xl:justify-between animate-fade-in">
        <div className="flex flex-col items-center xl:items-baseline text-center xl:text-left w-full xl:w-auto">
          <div className="flex flex-col items-center xl:items-baseline gap-4 lg:gap-6 2xl:gap-12 w-full">
            {eventoDestacado && (
              <div className="flex gap-0.75 items-center justify-center xl:justify-start">
                <div className="pl-1.25 text-[10px] leading-2.5 flex flex-col items-baseline">
                  <h3 className="font-extralight">FIGHT</h3>
                  <h3 className="font-medium">SESSION</h3>
                </div>
                <h2 className="bg-primary py-1.25 pl-1.5 pr-2 rounded-xl leading-5 text-white text-[22px] sm:text-[25px] font-medium font-heading italic">
                  #{eventoDestacado.numero}
                </h2>
              </div>
            )}

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[126px] 2xl:text-[170px] font-heading font-black leading-none lg:leading-22.5 tracking-tight drop-shadow-2xl text-center xl:text-start text-foreground">
              CAMMADA
            </h1>

            <p className="px-2 xl:px-0 text-center xl:text-start text-[10px] sm:text-sm 2xl:text-lg font-thin max-w-md lg:max-w-none">
              Sigue los resultados <span className="font-light">en vivo</span>,
              explora los <span className="font-light">rankings</span>, las{" "}
              <span className="font-light">carteleras</span> y todos los
              detalles
              <br className="hidden sm:inline" /> de los{" "}
              <span className="font-light">enfrentamientos</span> que definirán
              a los próximos{" "}
              <span className="text-primary font-medium">campeones.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 justify-center xl:justify-start w-full sm:w-auto">
            {eventoDestacado ? (
              <Button className="cursor-pointer w-full sm:w-auto" asChild>
                <Link href={`/eventos/${eventoDestacado.numero}`}>
                  Ver Cartelera #{eventoDestacado.numero}
                </Link>
              </Button>
            ) : (
              <Button className="cursor-pointer w-full sm:w-auto" asChild>
                <Link href="/eventos">Ver eventos</Link>
              </Button>
            )}
            <Button
              className="cursor-pointer w-full sm:w-auto"
              variant="ghost"
              asChild
            >
              <Link href="/eventos">Ver todos los eventos</Link>
            </Button>
          </div>
        </div>

        {eventoDestacado ? (
          <div className="w-full xl:w-auto flex justify-center">
            <EventCard
              evento={eventoDestacado}
              variant="home"
              className="w-fit"
            />
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
