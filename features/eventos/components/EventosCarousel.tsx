"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import EventCard from "@/components/EventCard";
import type { EventoPublico } from "@/features/eventos/queries";

interface EventosCarouselProps {
  eventos: EventoPublico[];
}

export default function EventosCarousel({ eventos }: EventosCarouselProps) {
  return (
    <div className="w-full px-2 sm:px-8 md:px-12 relative max-w-full">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 sm:-ml-4">
          {eventos.map((evento) => (
            <CarouselItem
              key={evento.id}
              className="pl-2 sm:pl-4 basis-full md:basis-1/2"
            >
              <div className="p-1 h-full">
                <EventCard evento={evento} className="h-full" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-2 sm:-left-6 md:-left-12 z-10 cursor-pointer hover:bg-primary/50 transition-all duration-200" />
        <CarouselNext className="-right-2 sm:-right-6 md:-right-12 z-10 cursor-pointer hover:bg-primary/50 transition-all duration-200" />
      </Carousel>
    </div>
  );
}
