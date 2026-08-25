import { LuchadoresGridSkeleton } from "@/features/luchadores/components/public/grids/LuchadoresGridSkeleton";

export default function LuchadoresLoading() {
  return (
    <div className="min-h-dvh w-full overflow-x-hidden flex flex-col items-center px-4 sm:px-6 md:px-8 py-20 sm:py-24 xl:pt-32 xl:pb-20 gap-10 sm:gap-12">
      <div className="flex flex-col items-center gap-3 text-center max-w-3xl w-full animate-pulse">
        <div className="h-6 w-48 bg-muted rounded-md" />
        <div className="h-12 sm:h-16 w-64 sm:w-80 bg-muted rounded-xl" />
        <div className="h-4 w-72 bg-muted rounded" />
      </div>

      <div className="w-full">
        <LuchadoresGridSkeleton />
      </div>
    </div>
  );
}
