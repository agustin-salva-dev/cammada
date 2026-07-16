import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriasPesoLoading() {
  return (
    <main className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-9 w-36 self-start sm:self-auto" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
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

            <div className="flex flex-col gap-3 p-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-px w-full" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
