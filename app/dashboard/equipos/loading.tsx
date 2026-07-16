import { Skeleton } from "@/components/ui/skeleton";

export default function EquiposLoading() {
  return (
    <main className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/50">
        <div className="flex items-center gap-4 border-b border-border bg-muted/50 px-5 py-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-24 ml-auto" />
          <Skeleton className="h-4 w-16" />
        </div>

        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-border/50 px-5 py-4 last:border-0"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Skeleton className="h-9 w-9 rounded-full shrink-0" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>

            <Skeleton className="h-5 w-28 rounded-full" />

            <div className="flex gap-1">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
