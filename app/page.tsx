import Navbar from "@/components/layout/NavBar";
import { Button } from "@/components/ui/button";
import SpotlightCard from "@/components/SpotlightCard";
import { Swords } from "lucide-react";
import ShinyText from "@/components/ShinyText";

export default function Home() {
  return (
    <div className="h-dvh relative flex gap-28 items-center justify-center">
      <Navbar />
      <div className="flex flex-col items-baseline">
        <div className="flex flex-col items-baseline gap-6">
          <div className="pl-2.5 flex gap-[3px] items-center">
            <div className="text-[10px] leading-2.5 flex flex-col items-baseline">
              <h3 className="font-extralight">FIGHT</h3>
              <h3 className="font-medium">SESSION</h3>
            </div>
            <h2 className="bg-primary py-[5px] pl-1.5 pr-2 rounded-xl leading-5 text-foreground text-[25px] font-medium font-heading italic">
              #10
            </h2>
          </div>
          <h1 className="text-[126px] font-heading font-black leading-[90px] tracking-tighter drop-shadow-2xl">
            CA<span className="text-primary">MMA</span>DA
          </h1>
          <p className="pl-2.5 text-start text-sm font-thin">
            Sigue los resultados <span className="font-light">en vivo</span>,
            explora los <span className="font-light">rankings</span>, las{" "}
            <span className="font-light">carteleras</span> <br /> y todos los
            detalles de los <span className="font-light">enfrentamientos</span>{" "}
            que definirán a los próximos{" "}
            <span className="text-primary font-medium">campeones.</span>
          </p>
        </div>
        <div className="flex gap-4 mt-10 pl-2.5">
          <Button className="cursor-pointer">Ver Cartelera #10</Button>
          <Button className="cursor-pointer" variant="ghost">
            Ver rankings
          </Button>
        </div>
      </div>
      <SpotlightCard
        className="group z-0 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 hover:scale-101 hover:-translate-y-1 translate-x-1.5 drop-shadow-xl transition-all duration-400 ease-in-out"
        spotlightColor="rgba(165, 31, 232, 1)"
      >
        <p className="drop-shadow-xl text-foreground opacity-[0.017] font-heading text-[365px] absolute left-[-110px] top-[-70px] font-bold italic -rotate-10">
          #10
        </p>
        <div className="flex flex-col items-center">
          <Swords
            size={40}
            className="drop-shadow-xl group-hover:text-primary transition-all duration-600"
          />
          <h3 className="drop-shadow-xl text-sm uppercase font-light tracking-normal mt-1.5">
            Próximo Evento
          </h3>
          <ShinyText
            text="03D : 04H : 23M : 05S"
            speed={0.9}
            delay={1.5}
            color="#a51fe8"
            shineColor="#bb7cdc"
            spread={70}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
            className="drop-shadow-lg font-heading font-semibold text-primary text-3xl tracking-normal"
          />
          {/* 
          <p className="drop-shadow-lg font-heading font-semibold text-primary text-3xl tracking-normal">
            03D : 04H : 23M : 05S
          </p>
 */}
        </div>
        <p className="drop-shadow-xl text-muted-foreground text-xs mt-3.5 text-center">
          Cartelera Estelar
        </p>
        <div className="flex gap-4 items-center mt-2">
          <div className="flex flex-col items-center">
            <p className="drop-shadow-md font-heading">
              Nombre{" "}
              <span className="text-primary font-semibold">
                &quot;Apodo&quot;
              </span>{" "}
              Apellido
            </p>
            <p className="drop-shadow-md text-xs text-muted-foreground">
              Team X
            </p>
          </div>
          <p className="drop-shadow-xl bg-primary py-0.5 px-1.5 rounded-lg">
            vs
          </p>
          <div className="flex flex-col items-center">
            <p className="drop-shadow-md font-heading">
              Nombre{" "}
              <span className="text-primary font-semibold">
                &quot;Apodo&quot;
              </span>{" "}
              Apellido
            </p>
            <p className="drop-shadow-md text-xs text-muted-foreground">
              Team Y
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-center justify-center mt-6">
          <p className="drop-shadow-xl bg-primary text-center w-fit py-[3px] px-2.5 rounded-lg font-medium text-sm">
            Titulo del Peso Pluma
          </p>
          <p className="drop-shadow-xl bg-trasparent/50 backdrop-blur-sm border border-border text-center w-fit py-[3px] px-2.5 rounded-lg font-medium text-sm">
            MMA Pro
          </p>
        </div>
        <div className="flex justify-between items-center mt-6">
          <div className="flex flex-col gap-1 text-center items-center">
            <p className="text-foreground bg-primary w-fit px-[7px] py-[3px] rounded-md font-heading font-semibold">
              67
            </p>
            <p className="text-[10px] font-light uppercase  text-foreground/70 group-hover:text-foreground group-hover:font-medium transition-all duration-600">
              Combates
            </p>
          </div>
          <div className="flex flex-col gap-1 text-center items-center">
            <p className="text-foreground bg-primary w-fit px-[7px] py-[3px] rounded-md font-heading font-semibold">
              7
            </p>
            <p className="text-[10px] font-light uppercase text-foreground/70 group-hover:text-foreground group-hover:font-medium transition-all duration-600">
              Peleas
              <br />
              de Grappling
            </p>
          </div>
          <div className="flex flex-col gap-1 text-center items-center">
            <p className="text-foreground bg-primary w-fit px-[7px] py-[3px] rounded-md font-heading font-semibold">
              35
            </p>
            <p className="text-[10px] font-light uppercase text-foreground/70 group-hover:text-foreground group-hover:font-medium transition-all duration-600">
              Peleas
              <br />
              de MMA
            </p>
          </div>
          <div className="flex flex-col gap-1 text-center items-center">
            <p className="text-foreground bg-primary w-fit px-[7px] py-[3px] rounded-md font-heading font-semibold">
              25
            </p>
            <p className="text-[10px] font-light uppercase text-foreground/70 group-hover:text-foreground group-hover:font-medium transition-all duration-600">
              Peleas
              <br />
              de Kick Boxing
            </p>
          </div>
        </div>
        <p className="drop-shadow-xl text-[10px] text-center mt-6 text-muted-foreground opacity-60 font-light">
          Club Sargento Cabral - Stgo. del Estero 1644-1698 - Desde las 11AM.
        </p>
      </SpotlightCard>
    </div>
  );
}
