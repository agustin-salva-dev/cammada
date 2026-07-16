import { Skeleton } from "@/components/ui/skeleton";

export default function EventosLoading() {
  return (
    <main className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/50 bg-card overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border/30 p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-5 w-10" />
                </div>
              </div>
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>

            <div className="flex flex-col gap-2.5 p-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-sm shrink-0" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-sm shrink-0" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-sm shrink-0" />
                <Skeleton className="h-4 w-36" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-sm shrink-0" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-border/30 p-4">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
              <div className="flex items-center gap-1">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
