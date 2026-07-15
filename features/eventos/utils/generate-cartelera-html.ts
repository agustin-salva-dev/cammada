import type { TipoCombate } from "@/features/combates/zod";

interface Luchador {
  id: string;
  nombre: string;
  apellido: string;
  apodo: string | null;
}

export interface CombateParaPDF {
  id: string;
  tipo: TipoCombate;
  numeroPelea: number;
  estado: string;
  ganadorId: string | null;
  viaVictoria: string | null;
  peleador1: Luchador;
  peleador2: Luchador;
  modalidad: { id: string; nombre: string };
  categoriaPeso: { id: string; nombre: string };
}

export interface EventoParaPDF {
  numero: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  lugarNombre: string;
  calle: string;
  calleNumero: string;
}

const C = {
  bg: "#0f0f12",
  bgCard: "#18181b",
  bgCardAlt: "#1c1c1f",
  border: "rgba(255,255,255,0.1)",
  borderDashed: "rgba(255,255,255,0.15)",
  text: "#f5f5f5",
  textMuted: "#a3a3a3",
  textDimmed: "#737373",
  primary: "#a855f7",
  primaryBg: "#7c3aed",
  winGreen: "#34d399",
  winGreenBg: "rgba(16,185,129,0.25)",
  loseRed: "#f87171",
  loseRedBg: "rgba(239,68,68,0.25)",
  amber: "#fbbf24",
  footerText: "#525252",
} as const;

function formatFecha(fechaStr: string): string {
  const date = new Date(fechaStr);
  return date.toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getFighterName(f: Luchador): string {
  return f.apodo
    ? `${f.nombre} "${f.apodo}" ${f.apellido}`
    : `${f.nombre} ${f.apellido}`;
}

const pca = `-webkit-print-color-adjust:exact; print-color-adjust:exact;`;

function renderFightRow(fight: CombateParaPDF): string {
  const isFinished = fight.estado === "FINALIZADO" || !!fight.ganadorId;
  const isP1Winner = isFinished && fight.ganadorId === fight.peleador1.id;
  const isP2Winner = isFinished && fight.ganadorId === fight.peleador2.id;

  const p1Name = getFighterName(fight.peleador1);
  const p2Name = getFighterName(fight.peleador2);

  const p1Color = isP1Winner ? C.primary : C.textDimmed;
  const p2Color = isP2Winner ? C.primary : C.textDimmed;

  const wlBadge = (isWinner: boolean) =>
    isFinished
      ? `<span style="${pca}
            display:inline-block; font-size:9px; font-weight:900;
            padding:1px 4px; border-radius:3px; margin-left:3px;
            background:${isWinner ? C.winGreenBg : C.loseRedBg};
            color:${isWinner ? C.winGreen : C.loseRed};
            vertical-align:middle;
          ">${isWinner ? "W" : "L"}</span>`
      : "";

  const viaVictoria =
    isFinished && fight.viaVictoria
      ? `<div style="${pca} font-size:10px; color:${C.textMuted}; margin-top:4px; padding-left:2px;">
          <span style="color:${C.amber};">🏆</span>
          Ganador por:
          <strong style="${pca} color:${C.text};">${fight.viaVictoria}</strong>
        </div>`
      : "";

  return `
    <div style="${pca} padding:8px 0; border-bottom:1px solid ${C.border};">
      <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:6px;">
        <div style="display:flex; align-items:center; flex-wrap:wrap; gap:5px; font-size:12px;">
          <span style="${pca}
            background:${C.primaryBg}; color:#fff;
            font-size:10px; font-weight:700;
            padding:2px 6px; border-radius:4px;
          ">#${fight.numeroPelea}</span>

          <span style="${pca} font-weight:600; color:${p1Color};"
          >${p1Name}${wlBadge(isP1Winner)}</span>

          <span style="color:${C.textDimmed}; padding:0 2px;">vs</span>

          <span style="${pca} font-weight:600; color:${p2Color};"
          >${p2Name}${wlBadge(isP2Winner)}</span>
        </div>

        <div style="display:flex; gap:5px; flex-shrink:0;">
          <span style="${pca}
            font-size:10px; color:${C.textMuted};
            background:rgba(255,255,255,0.08); border:1px solid ${C.border};
            padding:2px 8px; border-radius:999px;
          ">${fight.modalidad.nombre}</span>
          <span style="${pca}
            font-size:10px; color:${C.textMuted};
            background:rgba(255,255,255,0.08); border:1px solid ${C.border};
            padding:2px 8px; border-radius:999px;
          ">${fight.categoriaPeso.nombre}</span>
        </div>
      </div>
      ${viaVictoria}
    </div>`;
}

function renderSection(
  icon: string,
  label: string,
  fights: CombateParaPDF[],
  isEmpty: boolean,
): string {
  if (isEmpty) {
    return `
      <div style="${pca}
        border:1px dashed ${C.borderDashed}; border-radius:8px;
        padding:12px; margin-bottom:10px;
        color:${C.textDimmed}; font-size:12px;
        background:${C.bgCard};
      ">
        <span style="margin-right:6px;">${icon}</span>${label}
        <span style="margin-left:6px; font-style:italic;">— Aún no asignada</span>
      </div>`;
  }

  const rows = fights.map(renderFightRow).join("");

  return `
    <div style="${pca}
      border:1px solid ${C.border}; border-radius:8px;
      padding:12px; margin-bottom:10px;
      background:${C.bgCard};
    ">
      <div style="${pca}
        font-size:12px; font-weight:600; color:${C.text}; margin-bottom:8px;
        display:flex; align-items:center; gap:6px;
      ">
        <span>${icon}</span>${label}
        <span style="font-weight:400; color:${C.textDimmed}; font-size:11px;">
          (${fights.length} ${fights.length === 1 ? "pelea" : "peleas"})
        </span>
      </div>
      ${rows}
    </div>`;
}

export function generateCarteleraHTML(
  evento: EventoParaPDF,
  combates: CombateParaPDF[],
): string {
  const peleaEstelar = combates.find((c) => c.tipo === "ESTELAR");
  const peleaCoEstelar = combates.find((c) => c.tipo === "CO_ESTELAR");

  const carteleraPrincipal = [...combates]
    .filter((c) => c.tipo === "CARTELERA_PRINCIPAL")
    .sort((a, b) => b.numeroPelea - a.numeroPelea);

  const preliminares = [...combates]
    .filter((c) => c.tipo === "PRELIMINAR")
    .sort((a, b) => b.numeroPelea - a.numeroPelea);

  const fechaFormateada = formatFecha(evento.fecha);

  const estelarSection = renderSection(
    "⭐",
    "Pelea Estelar",
    peleaEstelar ? [peleaEstelar] : [],
    !peleaEstelar,
  );
  const coEstelarSection = renderSection(
    "⚡",
    "Pelea Co-Estelar",
    peleaCoEstelar ? [peleaCoEstelar] : [],
    !peleaCoEstelar,
  );
  const principalSection =
    carteleraPrincipal.length > 0
      ? renderSection("🏆", "Cartelera Principal", carteleraPrincipal, false)
      : "";
  const preliminaresSection =
    preliminares.length > 0
      ? renderSection("⚔️", "Peleas Preliminares", preliminares, false)
      : "";

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- Forzar modo oscuro en el navegador/motor de renderizado -->
  <meta name="color-scheme" content="dark" />
  <title>Cammada Fight Session #${evento.numero} — Cartelera</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

    /* Forzar color-scheme: dark globalmente */
    :root {
      color-scheme: dark;
    }

    /* print-color-adjust en el selector universal para que Chrome
       preserve backgrounds sin necesitar la opción "Gráficos de fondo" */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      forced-color-adjust: none !important;
    }

    html {
      background: ${C.bg} !important;
      color-scheme: dark !important;
    }

    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: ${C.bg} !important;
      color: ${C.text};
      padding: 32px 40px;
      min-height: 100vh;
    }

    /* ── Header ─────────────────────────────────────── */
    .header {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 24px;
      padding-bottom: 18px;
      border-bottom: 1px solid ${C.border};
    }
    .event-name {
      font-size: 22px;
      font-weight: 700;
      color: ${C.text};
    }
    .event-info {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      margin-top: 8px;
    }
    .info-chip {
      font-size: 12px;
      color: ${C.textMuted};
    }

    /* ── Section title ───────────────────────────────── */
    .section-title {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: ${C.textMuted};
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 12px;
    }
    .section-title .icon { color: ${C.primary}; }

    /* ── Footer ──────────────────────────────────────── */
    .print-footer {
      margin-top: 28px;
      padding-top: 14px;
      border-top: 1px solid rgba(255,255,255,0.08);
      font-size: 10px;
      color: ${C.footerText};
      text-align: center;
    }

    @media print {
      html, body {
        background: ${C.bg} !important;
      }
      @page {
        margin: 0;
      }
      body {
        padding: 20mm 20mm;
        background: ${C.bg} !important;
      }
    }
  </style>
</head>
<body>

  <header class="header">
    <span class="event-name">⚔ Cammada Fight Session #${evento.numero}</span>
    <div class="event-info">
      <span class="info-chip">📅 ${fechaFormateada}</span>
      <span class="info-chip">🕐 ${evento.horaInicio} — ${evento.horaFin}</span>
      <span class="info-chip">🏢 ${evento.lugarNombre}</span>
      <span class="info-chip">📍 ${evento.calle} ${evento.calleNumero}</span>
    </div>
  </header>

  <div class="section-title">
    <span class="icon">⚔</span>
    Cartelera (${combates.length} ${combates.length === 1 ? "pelea" : "peleas"})
  </div>

  ${estelarSection}
  ${coEstelarSection}
  ${principalSection}
  ${preliminaresSection}

  <div class="print-footer">
    Generado por Cammada · ${new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}
  </div>

</body>
</html>`;
}
