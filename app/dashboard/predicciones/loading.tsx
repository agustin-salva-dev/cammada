import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingDashboardPredicciones() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Skeleton className="h-8 w-64 rounded-md" />
        <Skeleton className="h-4 w-96 rounded-md" />
      </div>

      <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex justify-between items-center">
        <Skeleton className="h-10 w-64 rounded-md" />
        <div className="flex gap-3">
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
      </div>

      <div className="space-y-3">
        <Skeleton className="h-5 w-40 rounded-md" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
