import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingDashboardOpiniones() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-64 rounded-md" />
        <Skeleton className="h-4 w-96 rounded-md mt-2" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-white/5 p-4 text-center space-y-2 flex flex-col items-center justify-center"
          >
            <Skeleton className="h-8 w-12 rounded-md" />
            <Skeleton className="h-3 w-20 rounded-md" />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Skeleton className="h-4 w-16 rounded-md" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-lg" />
        ))}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex justify-between items-center">
        <Skeleton className="h-5 w-40 rounded-md" />
        <Skeleton className="h-7 w-32 rounded-md" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Skeleton className="h-5 w-5 rounded-md" />
                <Skeleton className="h-5 w-28 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>
            <Skeleton className="h-5 w-1/2 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-4 w-40 rounded-md" />
              <div className="flex gap-2">
                <Skeleton className="h-7 w-20 rounded-lg" />
                <Skeleton className="h-7 w-20 rounded-lg" />
                <Skeleton className="h-7 w-20 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
