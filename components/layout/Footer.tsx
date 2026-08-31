import Link from "next/link";
import { Swords } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site";

const navLinks = [
  { href: ROUTES.EVENTOS, label: "Eventos" },
  { href: ROUTES.RANKINGS, label: "Rankings" },
  { href: ROUTES.LUCHADORES, label: "Luchadores" },
  { href: ROUTES.EQUIPOS, label: "Equipos" },
  { href: ROUTES.PREDICCIONES, label: "Predicciones" },
  { href: ROUTES.OPINIONES, label: "Opiniones" },
  { href: ROUTES.TALENTO_EXPORTADO, label: "Talento Exportado" },
];

const institutionalLinks = [
  { href: ROUTES.SOBRE_NOSOTROS, label: "Sobre Nosotros" },
  { href: ROUTES.CONTACTO, label: "Contacto" },
];

const legalLinks = [
  { href: ROUTES.LEGAL_PRIVACIDAD, label: "Política de Privacidad" },
  { href: ROUTES.LEGAL_TERMINOS, label: "Términos y Condiciones" },
  { href: ROUTES.LEGAL_COOKIES, label: "Política de Cookies" },
  { href: ROUTES.LEGAL_DISCLAIMER, label: "Descargo de Responsabilidad" },
];

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer
      aria-label="Pie de página de Cammada Fight Session"
      className="border-t border-border/40 bg-background/60 backdrop-blur-sm mt-auto w-dvw"
    >
      <div className="mx-auto px-4 md:px-8 2xl:px-42 py-10 sm:py-14 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2 group w-fit"
            aria-label="Ir al inicio — Cammada Fight Session"
          >
            <Swords
              size={20}
              className="text-primary group-hover:scale-110 transition-transform"
              aria-hidden="true"
            />
            <div className="flex flex-col">
              <span className="font-heading font-black text-base tracking-tight text-foreground uppercase">
                Somos
              </span>
              <span className="font-heading font-black text-base tracking-tight text-foreground uppercase">
                Cammada
              </span>
            </div>
          </Link>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-52">
            Organización de eventos de deportes de combate en el Norte
            Argentino.
          </p>
          <p className="font-heading font-medium text-primary text-[10px] uppercase">
            Ten cuidado con lo que deseas.
          </p>
          <div
            className="flex items-center gap-3 mt-1"
            role="list"
            aria-label="Redes sociales"
          >
            {siteConfig.socialLinks.instagram && (
              <a
                href={siteConfig.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Cammada Fight Session"
                role="listitem"
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
              >
                {/* Instagram icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            )}
            {siteConfig.socialLinks.youtube && (
              <a
                href={siteConfig.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube de Cammada Fight Session"
                role="listitem"
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
              >
                {/* YouTube icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <path d="m10 15 5-3-5-3z" />
                </svg>
              </a>
            )}
            {siteConfig.socialLinks.tiktok && (
              <a
                href={siteConfig.socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok de Cammada Fight Session"
                role="listitem"
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
              >
                {/* TikTok icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                </svg>
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/60">
            Plataforma
          </h3>
          <nav aria-label="Navegación principal en footer">
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/60">
            Organización
          </h3>
          <nav aria-label="Navegación institucional en footer">
            <ul className="flex flex-col gap-2">
              {institutionalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/60">
            Legal
          </h3>
          <nav aria-label="Navegación legal en footer">
            <ul className="flex flex-col gap-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-border/30 px-4 sm:px-6 md:px-8 lg:px-10.5 2xl:px-42 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-[10px] sm:text-xs text-muted-foreground text-center sm:text-left">
          © {currentYear}{" "}
          <span className="text-foreground/70 font-medium">
            {siteConfig.name}
          </span>
        </p>
        <p className="text-[10px] sm:text-xs text-muted-foreground">
          Desarrollado por{" "}
          <span className="text-primary font-semibold">agvsdev.</span>
        </p>
      </div>
    </footer>
  );
}
