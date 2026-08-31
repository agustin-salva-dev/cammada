import Link from "next/link";
import { Scale } from "lucide-react";
import type { LegalDocument } from "../types";
import { LegalSection } from "./LegalSection";
import { LegalTableOfContents } from "./LegalTableOfContents";

interface LegalLayoutProps {
  document: LegalDocument;
}

export function LegalLayout({ document }: LegalLayoutProps) {
  return (
    <main className="w-full px-4 md:px-8 2xl:px-42 py-20 sm:py-24 xl:pt-32 xl:pb-24">
      <div className="flex flex-col gap-3 mb-10 sm:mb-14 animate-fade-in">
        <div className="flex items-center gap-2 text-primary text-[10px] sm:text-xs font-medium uppercase tracking-widest">
          <Scale size={14} aria-hidden="true" />
          <span>Legal — Cammada Fight Session</span>
        </div>
        <h1 className="font-bold font-heading text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight tracking-tight">
          {document.title}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Última actualización:{" "}
          <time dateTime={document.lastUpdated}>{document.lastUpdated}</time> ·
          Versión {document.version}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 animate-fade-in">
        <LegalTableOfContents sections={document.sections} />
        <article
          className="flex-1 flex flex-col gap-8 sm:gap-10 min-w-0"
          aria-label={document.title}
        >
          {document.sections.map((section) => (
            <LegalSection key={section.id} section={section} />
          ))}
        </article>
      </div>

      <div className="mt-14 sm:mt-20 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          Para consultas legales escribinos a{" "}
          <a
            href="mailto:legal@cammada.com"
            className="text-primary hover:underline transition-colors"
          >
            legal@cammada.com
          </a>
        </p>
        <Link
          href="/"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Volver al inicio
        </Link>
      </div>
    </main>
  );
}
