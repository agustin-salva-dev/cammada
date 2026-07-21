"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorEventos({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error en /eventos:", error);
  }, [error]);

  return (
    <div className="min-h-dvh w-full flex flex-col items-center justify-center px-4 py-24 gap-6 text-center">
      <Navbar />

      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 mb-2">
        <AlertTriangle size={32} />
      </div>

      <div className="flex flex-col items-center gap-2 max-w-md">
        <h2 className="text-2xl font-bold font-heading uppercase text-foreground">
          No pudimos cargar los eventos
        </h2>
        <p className="text-sm text-muted-foreground font-light">
          Ocurrió un problema temporal de conexión o servidor al intentar obtener la lista de eventos.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mt-2">
        <Button onClick={() => reset()} className="cursor-pointer gap-2">
          <RefreshCw size={15} />
          Reintentar
        </Button>
        <Button variant="outline" asChild className="cursor-pointer">
          <Link href="/">Ir al Inicio</Link>
        </Button>
      </div>

      <Footer />
    </div>
  );
}
