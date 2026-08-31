export default function SobreNosotrosLoading() {
  return (
    <div className="min-h-dvh w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-24 flex flex-col gap-10 animate-pulse">
        <div className="h-4 w-48 bg-primary/20 rounded" />
        <div className="h-12 w-72 bg-white/5 rounded-lg" />
        <div className="h-4 w-full max-w-xl bg-white/5 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-white/3 rounded-xl border border-border/30"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
