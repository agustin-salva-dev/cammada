import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";

function LuchadorCardSkeleton() {
  return (
    <Card className="flex flex-col justify-between border-border/80 bg-card/60 shadow-md">
      <CardHeader className="pb-3 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5 flex-1">
            <Skeleton className="h-5 w-3/4 rounded" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full shrink-0" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-3.5 w-28 rounded" />
          <Skeleton className="h-3.5 w-24 rounded" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-3 w-12 rounded" />
          <Skeleton className="h-3 w-14 rounded" />
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="rounded-xl border border-border/40 bg-muted/40 p-3 flex flex-col gap-2">
          <Skeleton className="h-3 w-16 rounded" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border/40 gap-2">
        <Skeleton className="h-9 flex-1 rounded-md" />
      </CardFooter>
    </Card>
  );
}

export function LuchadoresGridSkeleton() {
  return (
    <div className="w-full flex flex-col gap-8 animate-pulse">
      <div className="w-full p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/60 shadow-lg flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <Skeleton className="md:col-span-4 h-10 rounded-xl" />
          <Skeleton className="md:col-span-3 h-10 rounded-xl" />
          <Skeleton className="md:col-span-2 h-10 rounded-xl" />
          <Skeleton className="md:col-span-1 h-10 rounded-xl" />
          <Skeleton className="md:col-span-2 h-10 rounded-xl" />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <Skeleton className="h-4 w-40 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {Array.from({ length: 6 }).map((_, i) => (
          <LuchadorCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
