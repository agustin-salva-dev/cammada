"use client";

import { useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          backgroundColor: "#0d0d0f",
          color: "#f5f5f7",
          fontFamily:
            "'Geist Sans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          textAlign: "center",
          padding: "1rem",
          position: "relative",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: -1,
          }}
        >
          <div
            style={{
              width: "30rem",
              height: "30rem",
              borderRadius: "9999px",
              background: "oklch(56.507% 0.26941 309.748 / 12%)",
              filter: "blur(96px)",
            }}
          />
        </div>

        <p
          style={{
            fontSize: "7rem",
            fontWeight: 800,
            lineHeight: 1,
            color: "oklch(56.507% 0.26941 309.748)",
            fontFamily: "monospace",
            userSelect: "none",
          }}
        >
          :(
        </p>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Error crítico de la aplicación
          </h1>
          <p style={{ maxWidth: "28rem", color: "#a1a1aa", margin: "0 auto" }}>
            Ocurrió un fallo grave en la aplicación. Por favor, intentá recargar
            la página.
          </p>
        </div>

        <button
          onClick={reset}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            borderRadius: "0.5rem",
            background: "oklch(56.507% 0.26941 309.748)",
            padding: "0.625rem 1.25rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "oklch(0.977 0.014 308.299)",
            border: "none",
            cursor: "pointer",
          }}
        >
          Recargar
        </button>
      </body>
    </html>
  );
}
