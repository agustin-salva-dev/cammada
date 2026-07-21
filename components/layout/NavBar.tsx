"use client";

import { CammadaLogo } from "./CammadaLogo";
import { Calendar, Trophy, MessageSquare, TrendingUp } from "lucide-react";
import SpecularButton from "../SpecularButton";
import { ModeToggle } from "../ui/ModeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: ROUTES.EVENTOS,
      label: "Eventos",
      icon: Calendar,
      active: pathname.startsWith(ROUTES.EVENTOS),
    },
    {
      href: ROUTES.RANKINGS,
      label: "Rankings",
      icon: Trophy,
      active: pathname.startsWith(ROUTES.RANKINGS),
    },
    {
      href: ROUTES.OPINIONES,
      label: "Opiniones",
      icon: MessageSquare,
      active: pathname.startsWith(ROUTES.OPINIONES),
    },
    {
      href: ROUTES.PREDICCIONES,
      label: "Predicciones",
      icon: TrendingUp,
      active: pathname.startsWith(ROUTES.PREDICCIONES),
    },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-8 lg:px-10.5 2xl:px-42 py-4 z-50 backdrop-blur-xl bg-transparent lg:backdrop-blur-none">
      <CammadaLogo />
      <section className="animate-fade-in hidden md:flex bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/40 rounded-xl drop-shadow-lg gap-5 font-normal text-xs 2xl:text-sm px-6 py-2 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex gap-2 items-center hover:scale-[102%] transition-all duration-200 cursor-pointer py-0.5 border-b border-transparent",
                item.active
                  ? "text-foreground font-semibold border-primary"
                  : "text-foreground/50 hover:text-foreground hover:opacity-100",
              )}
            >
              <Icon size={15} strokeWidth={1} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </section>
      <div className="flex items-center gap-2 md:gap-4">
        <SpecularButton
          size="sm"
          radius={18}
          tint="#ffffff"
          tintOpacity={0}
          blur={10}
          textColor="fffffff"
          lineColor="#ffffff"
          baseColor="#525252"
          intensity={1.5}
          shineSize={12}
          shineFade={26}
          thickness={0.8}
          speed={0.2}
          followMouse
          proximity={250}
          autoAnimate={false}
          onClick={() => console.log("clicked")}
          className="font-light text-shadow-md hidden md:block"
        >
          Entradas
        </SpecularButton>
        <SpecularButton
          size="sm"
          radius={18}
          tint="#c970f5"
          tintOpacity={0}
          blur={10}
          textColor="#a51fe8"
          lineColor="#a51fe8"
          baseColor="#805197"
          intensity={1.5}
          shineSize={12}
          shineFade={26}
          thickness={0.8}
          speed={0.2}
          followMouse
          proximity={250}
          autoAnimate={false}
          onClick={() => console.log("clicked")}
          className="font-medium text-shadow-md"
        >
          Ver en vivo
        </SpecularButton>
        <ModeToggle />
      </div>
    </nav>
  );
}
