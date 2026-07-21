import { Flame } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export function CammadaLogo() {
  return (
    <Link href={ROUTES.HOME} className="relative leading-3.5 flex items-center gap-2 font-heading cursor-pointer hover:opacity-90 transition-opacity">
      <Flame size={21} className="drop-shadow-lg" />
      <div>
        <h1 className="text-shadow-md text-[22px] font-medium tracking-tight">
          Ca<span className="text-primary">MMA</span>da
        </h1>
        <h2 className="text-shadow-md text-md font-light tracking-tight">
          Fight Session
        </h2>
      </div>
    </Link>
  );
}

