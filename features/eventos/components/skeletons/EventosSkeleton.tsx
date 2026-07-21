import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

export function EventosSkeleton() {
  return (
    <div className="min-h-dvh w-full overflow-x-hidden flex flex-col items-center px-4 sm:px-6 md:px-8 py-20 sm:py-24 xl:pt-32 xl:pb-20 gap-8 sm:gap-10 animate-pulse">
      <Navbar />

      <div className="flex flex-col items-center gap-3 text-center max-w-2xl w-full">
        <div className="h-4 w-36 bg-white/10 rounded-full" />
        <div className="h-16 sm:h-24 w-64 sm:w-96 bg-white/10 rounded-2xl" />
        <div className="h-4 w-80 max-w-full bg-white/5 rounded-lg mt-2" />
      </div>

      <div className="w-full max-w-4xl h-105 rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col justify-between" />

      <Footer />
    </div>
  );
}
