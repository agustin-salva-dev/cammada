import type { LegalSectionData } from "../types";

interface LegalSectionProps {
  section: LegalSectionData;
}

export function LegalSection({ section }: LegalSectionProps) {
  return (
    <section id={section.id} className="scroll-mt-28 flex flex-col gap-4">
      <h2 className="text-base sm:text-lg font-semibold text-foreground font-heading border-b border-border pb-2">
        {section.title}
      </h2>
      <div className="flex flex-col gap-3">
        {section.clauses.map((clause, clauseIndex) => (
          <div key={clauseIndex} className="flex flex-col gap-2">
            {clause.text && (
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {clause.text}
              </p>
            )}
            {clause.items && clause.items.length > 0 && (
              <ul className="flex flex-col gap-1.5 pl-4 sm:pl-6">
                {clause.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="text-sm sm:text-base text-muted-foreground leading-relaxed list-disc list-outside marker:text-primary"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
