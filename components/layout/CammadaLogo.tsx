import { Flame } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export function CammadaLogo() {
  return (
    <Link
      href={ROUTES.HOME}
      className="relative leading-3.5 flex items-center gap-1 sm:gap-2 font-heading cursor-pointer hover:opacity-90 transition-opacity"
    >
      <Flame className="size-4 sm:size-4.5 drop-shadow-lg" />
      <div className="mt-2 md:mt-3.25 lg:mt-3 leading-1.25 md:leading-0.75 lg:leading-2">
        <h1 className="text-shadow-md text-[16px] sm:text-[20px] lg:text-[22px] font-medium tracking-tight">
          Ca<span className="text-primary">MMA</span>da
        </h1>
        <h2 className="text-shadow-md text-xs sm:text-base font-light tracking-tight">
          Fight Session
        </h2>
      </div>
    </Link>
  );
}
