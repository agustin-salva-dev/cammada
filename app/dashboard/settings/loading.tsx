import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-1 rounded-lg bg-muted p-1">
          <Skeleton className="h-8 w-28 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
          <Skeleton className="h-8 w-36 rounded-md" />
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border/50 bg-card p-6 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full shrink-0" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>

            <Skeleton className="h-px w-full" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Skeleton className="h-9 w-36 rounded-md" />
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-card p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-px w-full" />
            <div className="flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-9 w-40 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
