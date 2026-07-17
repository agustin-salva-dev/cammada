import Navbar from "@/components/layout/NavBar";
import { Button } from "@/components/ui/button";
import SpotlightCard from "@/components/SpotlightCard";
import { Swords, Medal } from "lucide-react";
import ShinyText from "@/components/ShinyText";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-dvh w-full relative flex flex-col lg:flex-row gap-12 lg:gap-28 items-center justify-center px-4 md:px-8 lg:px-[45px] py-12 lg:py-0">
      <Navbar />
      <div className="flex flex-col items-center lg:items-baseline">
        <div className="flex flex-col items-center lg:items-baseline gap-4 lg:gap-6">
          <div className="flex gap-[3px] items-center">
            <div className="pl-[5px] text-[10px] leading-2.5 flex flex-col items-baseline">
              <h3 className="font-extralight">FIGHT</h3>
              <h3 className="font-medium">SESSION</h3>
            </div>
            <h2 className="bg-primary py-[5px] pl-1.5 pr-2 rounded-xl leading-5 text-foreground text-[25px] font-medium font-heading italic">
              #10
            </h2>
          </div>
          <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[126px] font-heading font-black leading-none lg:leading-[90px] tracking-tight drop-shadow-2xl text-center lg:text-start">
            CA<span className="text-primary">MMA</span>DA
          </h1>
          <p className="pl-[5px] 66text-center lg:text-start text-sm font-thin max-w-sm lg:max-w-none">
            Sigue los resultados <span className="font-light">en vivo</span>,
            explora los <span className="font-light">rankings</span>, las{" "}
            <span className="font-light">carteleras</span> y todos los detalles
            de los <span className="font-light">enfrentamientos</span> que
            definirán a los próximos{" "}
            <span className="text-primary font-medium">campeones.</span>
          </p>
        </div>
        <div className="pl-[5px] flex gap-4 mt-8 justify-center lg:justify-start">
          <Button className="cursor-pointer">Ver Cartelera #10</Button>
          <Button className="cursor-pointer" variant="ghost">
            Ver rankings
          </Button>
        </div>
      </div>
      <SpotlightCard
        className="group z-0 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 hover:scale-101 hover:-translate-y-1 translate-x-0 lg:translate-x-1.5 drop-shadow-xl transition-all duration-400 ease-in-out w-full max-w-md"
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
          <div className="flex items-center gap-1 drop-shadow-xl bg-primary text-center w-fit py-[3px] px-2.5 rounded-lg font-medium text-sm">
            <Medal size={15} strokeWidth={1} />
            <p>Titulo del Peso Pluma</p>
          </div>
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
      <Footer />
    </div>
  );
}
