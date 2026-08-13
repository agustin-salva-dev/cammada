import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

export default function LoadingOpinar() {
  return (
    <div className="min-h-dvh w-full overflow-x-hidden flex flex-col items-center px-4 sm:px-6 md:px-8 py-20 sm:py-24 xl:pt-32 xl:pb-20 gap-10 sm:gap-12">
      <Navbar />

      <div className="w-full max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4 flex flex-col items-center">
          <Skeleton className="h-6 w-56 rounded-full" />
          <Skeleton className="h-10 w-80 sm:w-96 rounded-xl" />
          <Skeleton className="h-4 w-full max-w-xl rounded-md" />
          <div className="pt-2">
            <Skeleton className="h-11 w-48 rounded-xl" />
          </div>
        </header>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
          <Skeleton className="h-6 w-56 rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 p-4 space-y-3"
              >
                <Skeleton className="h-5 w-36 rounded-md" />
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} className="h-8 w-8 rounded-md" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
          <Skeleton className="h-6 w-48 rounded-md" />
          <div className="flex flex-wrap gap-2 justify-center">
            {Array.from({ length: 11 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
