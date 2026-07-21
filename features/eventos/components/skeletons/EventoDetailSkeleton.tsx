import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

export function EventoDetailSkeleton() {
  return (
    <div className="min-h-dvh w-full overflow-x-hidden flex flex-col px-4 sm:px-6 md:px-8 lg:px-10.5 2xl:px-42 py-20 sm:py-24 xl:pt-32 xl:pb-20 gap-8 sm:gap-10 animate-pulse">
      <Navbar />

      <div className="h-4 w-32 bg-white/10 rounded-md" />

      <div className="w-full h-72 sm:h-96 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-12 flex flex-col justify-between" />

      <div className="flex flex-col gap-4 w-full">
        <div className="h-8 w-40 bg-white/10 rounded-xl" />
        <div className="flex flex-col gap-3">
          <div className="h-16 w-full rounded-xl bg-white/5 border border-white/10" />
          <div className="h-16 w-full rounded-xl bg-white/5 border border-white/10" />
          <div className="h-16 w-full rounded-xl bg-white/5 border border-white/10" />
        </div>
      </div>

      <Footer />
    </div>
  );
}
