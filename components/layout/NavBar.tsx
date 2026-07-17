"use client";

import { CammadaLogo } from "./CammadaLogo";
import { Calendar, Sword, Trophy } from "lucide-react";
import SpecularButton from "../SpecularButton";
import { ModeToggle } from "../ui/ModeToggle";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-8 lg:px-[42px] 2xl:px-42 py-4 z-50 backdrop-blur-xl bg-transparent lg:backdrop-blur-none">
      <CammadaLogo />
      <section className="hidden md:flex bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/40 rounded-xl drop-shadow-lg gap-4 font-normal text-xs 2xl:text-lg text-foreground/50 px-6 py-2 items-center">
        <div className="group flex gap-2 items-center hover:text-foreground hover:opacity-100 hover:scale-[102%] transition-all duration-200 cursor-pointer">
          <Calendar size={15} strokeWidth={1} />
          <p>Eventos</p>
        </div>
        <div className="group flex gap-2 items-center hover:text-foreground hover:opacity-100 hover:scale-[102%] transition-all duration-200 cursor-pointer">
          <Sword size={15} strokeWidth={1} />
          <p>Combates</p>
        </div>
        <div className="group flex gap-2 items-center hover:text-foreground hover:opacity-100 hover:scale-[102%] transition-all duration-200 cursor-pointer">
          <Trophy size={15} strokeWidth={1} />
          <p>Rankings</p>
        </div>
      </section>
      <div className="flex items-center gap-2 md:gap-4">
        <SpecularButton
          size="sm"
          radius={18}
          tint="#ffffff"
          tintOpacity={0}
          blur={0}
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
          blur={11}
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
