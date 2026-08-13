// ── Configuración del Índice de Impacto NPS ──────────

export const NPS_LABELS: Record<number, string> = {
  0: "Nada probable",
  1: "Nada probable",
  2: "Poco probable",
  3: "Poco probable",
  4: "Algo probable",
  5: "Neutral",
  6: "Neutral",
  7: "Probable",
  8: "Probable",
  9: "Muy probable",
  10: "Extremadamente probable",
};

export const NPS_CATEGORIAS = {
  DETRACTOR: { label: "Detractor", range: [0, 6] as const, color: "red" },
  PASIVO: { label: "Pasivo", range: [7, 8] as const, color: "yellow" },
  PROMOTOR: { label: "Promotor", range: [9, 10] as const, color: "green" },
} as const;

export const RETENCION_LABELS: Record<number, string> = {
  1: "No, definitivamente no",
  2: "Probablemente no",
  3: "Tal vez",
  4: "Probablemente sí",
  5: "¡Sí, seguro!",
};

export const CATEGORIA_LABELS: Record<
  string,
  { label: string; emoji: string; descripcion: string }
> = {
  WEB_PLATAFORMA: {
    label: "Web & Plataforma",
    emoji: "🌐",
    descripcion:
      "Usabilidad, inscripciones, claridad de información, rendimiento.",
  },
  ORGANIZACION: {
    label: "Organización & Cronograma",
    emoji: "🏆",
    descripcion: "Puntualidad de llaves, árbitros, atención del staff.",
  },
  LUGAR_INSTALACIONES: {
    label: "Lugar & Instalaciones",
    emoji: "📍",
    descripcion: "Comodidad, sonido, espacio para atletas y espectadores.",
  },
  KIT_PREMIACION: {
    label: "Kit / Premiación",
    emoji: "🎁",
    descripcion: "Medallas, regalos, trofeos y calidad de los premios.",
  },
  GENERAL: {
    label: "General",
    emoji: "💬",
    descripcion: "Comentario o sugerencia sobre el evento en general.",
  },
};

export const ROL_LABELS: Record<string, string> = {
  ATLETA: "Atleta Participante",
  ESPECTADOR: "Espectador / Acompañante",
  COACH: "Entrenador / Coach",
  OTRO: "Otro",
};

export const TIPO_OPINION_LABELS: Record<
  string,
  { label: string; descripcion: string }
> = {
  COMENTARIO: {
    label: "Comentario",
    descripcion: "Comparte tu experiencia y opinión sobre el evento.",
  },
  SUGERENCIA: {
    label: "Sugerencia",
    descripcion:
      "Propón una mejora para el próximo evento. Otros podrán votar tu idea.",
  },
};

export const ESTADO_OPINION_LABELS: Record<
  string,
  { label: string; color: string }
> = {
  PENDIENTE: { label: "Pendiente", color: "yellow" },
  APROBADA: { label: "Aprobada", color: "green" },
  RECHAZADA: { label: "Rechazada", color: "red" },
};

export const OPINION_RATE_LIMIT = {
  maxPerWindow: 3,
  windowSeconds: 24 * 60 * 60,
  prefix: "cammada:opiniones",
} as const;

export const VALORACION_RATE_LIMIT = {
  maxPerWindow: 3,
  windowSeconds: 24 * 60 * 60,
  prefix: "cammada:valoraciones",
} as const;

export const NPS_RATE_LIMIT = {
  maxPerWindow: 1,
  windowSeconds: 24 * 60 * 60,
  prefix: "cammada:nps",
} as const;
