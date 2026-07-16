import { Skeleton } from "@/components/ui/skeleton";

export default function RankingsLoading() {
  return (
    <main className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-9 w-36 self-start sm:self-auto" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/50 bg-card overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border/30 p-4">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>

            <div className="flex items-center gap-3 border-b border-border/30 p-4 bg-primary/5">
              <Skeleton className="h-6 w-6 rounded-full shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full shrink-0" />
            </div>

            <div className="flex flex-col divide-y divide-border/40 p-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center gap-3 py-2.5 px-2">
                  <Skeleton className="h-4 w-4 shrink-0" />
                  <Skeleton className="h-4 w-32 flex-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>

            <div className="border-t border-border/30 p-3 flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-24 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
