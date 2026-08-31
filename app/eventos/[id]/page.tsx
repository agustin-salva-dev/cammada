import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { getPublicEventoDetail } from "@/features/eventos/queries";
import { EventoDetalleClient } from "@/features/eventos/components/EventoDetalleClient";
import { EventoDetailHero } from "@/features/eventos/components/detalle/EventoDetailHero";
import { Swords, ChevronLeft, ArrowLeft } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const evento = await getPublicEventoDetail(id);
  if (!evento) return { title: "Evento no encontrado — Cammada" };
  return {
    title: `Fight Session #${evento.numero} — Cammada`,
    description: `Cartelera completa del Cammada Fight Session #${evento.numero}: combates, peleadores, resultados y más.`,
  };
}

export default async function EventoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const evento = await getPublicEventoDetail(id);

  if (!evento) notFound();

  const { combates } = evento;

  return (
    <div className="min-h-dvh w-full overflow-x-hidden flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10.5 2xl:px-42 gap-8 sm:gap-10">
      <Navbar />

      <main className="w-full flex flex-col gap-4 md:gap-6 xl:gap-8 2xl:gap-9 pt-20 pb-15 sm:pt-24 sm:pb-18 xl:pt-32 xl:pb-20">
        <div className="w-full">
          <Link
            href="/eventos"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <ChevronLeft size={16} />
            Todos los eventos
          </Link>
        </div>

        <EventoDetailHero evento={evento} />

        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Swords size={16} />
            </div>
            <h2 className="font-heading font-bold text-xl sm:text-2xl uppercase tracking-wide text-foreground">
              Cartelera
            </h2>
            {combates.length > 0 && (
              <span className="text-xs sm:text-sm text-muted-foreground">
                — {combates.length} {combates.length === 1 ? "pelea" : "peleas"}
              </span>
            )}
          </div>

          {combates.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 sm:py-20 rounded-2xl border border-dashed border-white/10 text-center px-4">
              <Swords size={40} className="text-primary/20" />
              <p className="text-xs sm:text-sm text-muted-foreground">
                La cartelera de este evento aún no fue publicada.
              </p>
            </div>
          ) : (
            <EventoDetalleClient evento={evento} />
          )}
        </div>

        <div className="flex justify-start w-full">
          <Link
            href="/eventos"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            <ArrowLeft size={15} />
            Volver a todos los eventos
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
