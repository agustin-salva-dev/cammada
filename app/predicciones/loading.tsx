import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

export default function LoadingPredicciones() {
  return (
    <div className="min-h-dvh w-full overflow-x-hidden flex flex-col items-center px-4 sm:px-6 md:px-8 py-20 sm:py-24 xl:pt-32 xl:pb-20 gap-10 sm:gap-14">
      <Navbar />

      <div className="w-full max-w-5xl mx-auto space-y-10">
        <header className="text-center space-y-4 flex flex-col items-center">
          <Skeleton className="h-6 w-44 rounded-full" />
          <Skeleton className="h-10 w-72 sm:w-96 rounded-xl" />
          <Skeleton className="h-4 w-full max-w-lg rounded-md" />
        </header>

        {/* Selector pills skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-9 w-36 rounded-xl" />
          <Skeleton className="h-9 w-36 rounded-xl" />
        </div>

        {/* Fight cards skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-40 rounded-md" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-4 w-16 rounded-md" />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Skeleton className="h-20 flex-1 rounded-xl" />
                  <Skeleton className="h-20 flex-1 rounded-xl" />
                </div>
                <Skeleton className="h-3 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
