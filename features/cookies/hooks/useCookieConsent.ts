"use client";

import { useState } from "react";

const CONSENT_KEY = "cammada-cookie-consent";

type ConsentStatus = "accepted" | "pending";

function getInitialStatus(): ConsentStatus {
  try {
    const stored = localStorage.getItem(CONSENT_KEY) as ConsentStatus | null;
    return stored ?? "pending";
  } catch {
    return "accepted";
  }
}

export function useCookieConsent() {
  const [status, setStatus] = useState<ConsentStatus>(getInitialStatus);

  const accept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {
      // Fallo silencioso: no bloquea la experiencia del usuario
    }
    setStatus("accepted");
  };

  return {
    isAccepted: status === "accepted",
    isLoading: status === null,
    accept,
  };
}
