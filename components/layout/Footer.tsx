export default function Footer() {
  return (
    <footer className="backdrop-blur-sm font-extralight text-[8px] lg:text-[9px] 2xl:text-xs uppercase fixed bottom-0 left-0 w-full flex items-center justify-between px-4 md:px-8 lg:px-10.5 2xl:px-42 py-3 md:py-6 z-40 bg-background/40">
      <p className="text-shadow-sm">
        Desarrollado por{" "}
        <span className="font-semibold text-primary">agvsdev.</span>
      </p>
      <p className="text-shadow-sm hidden sm:block">
        Cuidado con lo que{" "}
        <span className="font-semibold text-primary">deseas.</span>
      </p>
      <p className="text-shadow-sm truncate max-w-35 sm:max-w-none">
        Cammada Fight Session |{" "}
        <span className="font-semibold text-primary">2026</span>
      </p>
    </footer>
  );
}
