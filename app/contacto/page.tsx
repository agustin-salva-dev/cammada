import type { Metadata } from "next";
import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { ContactInfoCards } from "@/features/organization/components/ContactInfoCards";
import { siteConfig } from "@/config/site";
import { MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contacto — Cammada Fight Session",
  description: `Contactate con ${siteConfig.name}: consultas generales, prensa, participación de equipos y gimnasios, o asuntos legales.`,
  alternates: {
    canonical: `${siteConfig.url}/contacto`,
  },
};

/**
 * Página de Contacto.
 * La parte estática (hero + tarjetas) es Server Component.
 * El formulario es Client Component (necesita estado e interactividad).
 */
export default function ContactoPage() {
  return (
    <div className="min-h-dvh w-full overflow-x-hidden flex flex-col">
      <Navbar />

      <main className="flex-1 w-full px-4 md:px-8 2xl:px-42 py-20 sm:py-24 xl:pt-32 xl:pb-24 flex flex-col gap-12 sm:gap-16">
        {/* Hero */}
        <header className="flex flex-col gap-4 animate-fade-in">
          <div className="flex items-center gap-2 text-primary text-[10px] sm:text-xs font-medium uppercase tracking-widest">
            <MessageSquare size={14} aria-hidden="true" />
            <span>Cammada Fight Session</span>
          </div>
          <h1 className="font-bold font-heading text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight tracking-tight">
            Contacto
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
            La forma más directa de comunicarte con nosotros es a través de nuestras
            redes sociales. Seguinos para estar al día con cada edición.
          </p>
        </header>

        {/* Canales de contacto */}
        <section className="animate-fade-in">
          <ContactInfoCards />
        </section>


      </main>

      <Footer />
    </div>
  );
}
