"use client";

import { useEffect } from "react";
import Link from "next/link";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function EquiposError({ error, reset }: Props) {
  useEffect(() => {
    console.error("[EquiposError]", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <div
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="h-120 w-120 rounded-full bg-destructive/10 blur-3xl" />
      </div>

      <p className="font-mono text-8xl font-extrabold text-destructive select-none leading-none">
        500
      </p>

      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          Error al cargar los equipos
        </h1>
        <p className="max-w-sm text-muted-foreground">
          No se pudieron obtener los datos. Podés intentarlo de nuevo o volver
          al inicio.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:brightness-110 active:scale-95"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-muted active:scale-95"
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
