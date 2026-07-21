import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <div
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="h-120 w-120 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <p className="font-mono text-8xl font-extrabold text-primary select-none leading-none">
        404
      </p>

      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          Página no encontrada
        </h1>
        <p className="max-w-sm text-muted-foreground">
          La página que buscas no existe o fue movida. Volvé al inicio para
          continuar.
        </p>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:brightness-110 active:scale-95"
      >
        Ir al inicio
      </Link>
    </main>
  );
}
