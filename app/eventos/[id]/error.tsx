"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

export default function ErrorEventoDetail({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error en /eventos/[id]:", error);
  }, [error]);

  return (
    <div className="min-h-dvh w-full flex flex-col items-center justify-center px-4 py-24 gap-6 text-center">
      <Navbar />

      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 mb-2">
        <AlertTriangle size={32} />
      </div>

      <div className="flex flex-col items-center gap-2 max-w-md">
        <h2 className="text-2xl font-bold font-heading uppercase text-foreground">
          Error al obtener la información del evento
        </h2>
        <p className="text-sm text-muted-foreground font-light">
          No pudimos consultar los detalles de este evento. Reintenta la solicitud o regresa a la lista de eventos.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mt-2">
        <Button onClick={() => reset()} className="cursor-pointer gap-2">
          <RefreshCw size={15} />
          Reintentar
        </Button>
        <Button variant="outline" asChild className="cursor-pointer gap-2">
          <Link href="/eventos">
            <ArrowLeft size={15} />
            Volver a eventos
          </Link>
        </Button>
      </div>

      <Footer />
    </div>
  );
}
