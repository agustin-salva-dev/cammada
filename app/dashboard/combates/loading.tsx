import { Skeleton } from "@/components/ui/skeleton";

export default function CombatesLoading() {
  return (
    <main className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-32 ml-auto" />
      </div>

      <div className="flex flex-col gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/50 bg-card p-4 flex items-center gap-4"
          >
            <Skeleton className="h-8 w-8 rounded-md shrink-0" />

            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>

            <div className="flex flex-col items-center gap-1 shrink-0">
              <Skeleton className="h-5 w-8 rounded-sm" />
              <Skeleton className="h-3 w-16" />
            </div>

            <div className="flex flex-col gap-1.5 flex-1 min-w-0 items-end">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>

            <div className="flex flex-col gap-1.5 shrink-0 items-end">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>

            <Skeleton className="h-8 w-8 rounded-md shrink-0" />
          </div>
        ))}
      </div>
    </main>
  );
}
