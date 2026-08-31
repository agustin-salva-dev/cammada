"use client";

import Link from "next/link";
import { Cookie } from "lucide-react";
import { useCookieConsent } from "../hooks/useCookieConsent";
import { ROUTES } from "@/constants/routes";

export function CookieConsentBanner() {
  const { isAccepted, isLoading, accept } = useCookieConsent();

  if (isLoading || isAccepted) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      aria-live="polite"
      className="fixed bottom-10 sm:bottom-12 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none"
    >
      <div className="pointer-events-auto w-full max-w-2xl backdrop-blur-xl bg-background/80 border border-border rounded-xl shadow-2xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in">
        <div className="shrink-0 text-primary">
          <Cookie size={22} aria-hidden="true" />
        </div>

        <p className="flex-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Usamos{" "}
          <span className="text-foreground font-medium">cookies técnicas</span>{" "}
          necesarias para el funcionamiento del sitio (sesión, preferencias de
          tema). No usamos cookies de publicidad ni de terceros.{" "}
          <Link
            href={ROUTES.LEGAL_COOKIES}
            className="text-primary hover:underline transition-colors whitespace-nowrap"
          >
            Política de Cookies
          </Link>
          .
        </p>

        <button
          onClick={accept}
          id="cookie-consent-accept"
          aria-label="Aceptar cookies y cerrar aviso"
          className="shrink-0 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all text-xs sm:text-sm font-medium px-4 py-2 rounded-lg"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
