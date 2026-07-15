"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, SearchIcon, PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  onCreateNew?: () => void;
  createNewText?: string;
  className?: string;
  id?: string;
  required?: boolean;
}

export function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = "Seleccionar...",
  searchPlaceholder = "Buscar...",
  emptyText = "Sin resultados.",
  disabled = false,
  onCreateNew,
  createNewText = "Crear nuevo...",
  className,
  id,
  required,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = React.useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(query));
  }, [options, search]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
      id={id}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-hidden select-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed text-left",
          "dark:bg-input/30 dark:hover:bg-input/50",
        )}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground opacity-50" />
      </button>

      {required && (
        <input
          type="text"
          value={value}
          onChange={() => {}}
          required
          tabIndex={-1}
          className="absolute inset-0 size-full pointer-events-none opacity-0"
        />
      )}

      {open && (
        <div className="absolute z-50 mt-1.5 flex w-full flex-col overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
          <div className="relative border-b border-border p-2">
            <SearchIcon className="absolute top-1/2 left-4 size-3.5 -translate-y-1/2 text-muted-foreground opacity-50" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 pr-3 text-xs bg-input/20 focus-visible:ring-2 focus-visible:ring-ring/40"
              autoFocus
            />
          </div>

          <div className="max-h-52 overflow-y-auto p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onValueChange(opt.value);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm select-none outline-hidden transition-colors hover:bg-muted focus-visible:bg-muted",
                    opt.value === value && "bg-accent/40 font-medium",
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                </button>
              ))
            ) : (
              <p className="px-2 py-3 text-center text-xs text-muted-foreground">
                {emptyText}
              </p>
            )}

            {onCreateNew && (
              <>
                <div className="my-1 border-t border-border" />
                <button
                  type="button"
                  onClick={() => {
                    onCreateNew();
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-1.5 rounded-sm px-2 py-1.5 text-left text-sm font-medium text-primary hover:bg-muted focus-visible:bg-muted"
                >
                  <PlusIcon className="size-3.5" />
                  <span className="truncate">{createNewText}</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
