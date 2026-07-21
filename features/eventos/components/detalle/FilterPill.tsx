import * as React from "react";
import { X } from "lucide-react";

interface FilterPillProps {
  label: string;
  active: boolean;
  onClear: () => void;
}

export const FilterPill = React.memo(function FilterPill({
  label,
  active,
  onClear,
}: FilterPillProps) {
  if (!active) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-primary/15 text-primary border border-primary/30 px-2 py-0.5 rounded-full max-w-full truncate">
      <span className="truncate">{label}</span>
      <button
        type="button"
        onClick={onClear}
        className="ml-0.5 shrink-0 hover:text-primary-foreground hover:bg-primary rounded-full p-0.5 transition-colors cursor-pointer"
        aria-label={`Quitar filtro ${label}`}
      >
        <X size={9} />
      </button>
    </span>
  );
});
