import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

export default function LoadingOpiniones() {
  return (
    <div className="min-h-dvh w-full overflow-x-hidden flex flex-col items-center px-4 sm:px-6 md:px-8 py-20 sm:py-24 xl:pt-32 xl:pb-20 gap-10 sm:gap-14">
      <Navbar />

      <div className="w-full max-w-5xl mx-auto space-y-14">
        <header className="text-center space-y-4 flex flex-col items-center">
          <Skeleton className="h-6 w-48 rounded-full" />
          <Skeleton className="h-10 w-80 sm:w-96 rounded-xl" />
          <Skeleton className="h-4 w-full max-w-xl rounded-md" />
          <Skeleton className="h-4 w-3/4 max-w-md rounded-md" />
          <div className="pt-2">
            <Skeleton className="h-11 w-44 rounded-xl" />
          </div>
        </header>

        <div className="space-y-4">
          <Skeleton className="h-7 w-48 rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-md" />
                </div>
                <Skeleton className="h-5 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <Skeleton className="h-7 w-56 rounded-md" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-28 rounded-lg" />
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-32 rounded-full" />
                  <Skeleton className="h-4 w-24 rounded-md" />
                </div>
                <Skeleton className="h-5 w-2/3 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
