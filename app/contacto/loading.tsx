/**
 * Loading skeleton para /contacto.
 */
export default function ContactoLoading() {
  return (
    <div className="min-h-dvh w-full flex flex-col">
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-24 flex flex-col gap-12 animate-pulse">
        <div className="flex flex-col gap-4">
          <div className="h-4 w-36 bg-primary/20 rounded" />
          <div className="h-12 w-56 bg-white/5 rounded-lg" />
          <div className="h-4 w-full max-w-md bg-white/5 rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-white/3 rounded-xl border border-border/30"
            />
          ))}
        </div>
        <div className="flex flex-col gap-4 max-w-2xl">
          <div className="h-8 w-48 bg-white/5 rounded-lg" />
          <div className="h-64 bg-white/3 rounded-xl border border-border/30" />
        </div>
      </div>
    </div>
  );
}
