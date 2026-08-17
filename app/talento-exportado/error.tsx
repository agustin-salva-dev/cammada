"use client";

import * as React from "react";
import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TalentoExportadoError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Error en la página de Talento Exportado:", error);
  }, [error]);

  return (
    <div className="min-h-dvh w-full overflow-x-hidden flex flex-col items-center px-4 sm:px-6 md:px-8 py-20 sm:py-24 xl:pt-32 xl:pb-20 gap-10 sm:gap-12">
      <Navbar />

      <div className="w-full max-w-xl my-auto flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-destructive/30 bg-destructive/5 backdrop-blur-md shadow-xl animate-fade-in gap-4">
        <div className="p-3 rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          No se pudo cargar el Talento Exportado
        </h2>
        <p className="text-sm text-muted-foreground">
          Ocurrió un error inesperado al intentar obtener los datos del servidor.
          Por favor, intenta nuevamente.
        </p>
        <Button
          onClick={() => reset()}
          variant="default"
          className="mt-2 flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reintentar
        </Button>
      </div>

      <Footer />
    </div>
  );
}
