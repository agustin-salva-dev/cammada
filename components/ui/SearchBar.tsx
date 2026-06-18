"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (value: string) => void;
}

export function SearchBar({
  placeholder = "¿Qué quieres buscar?...",
  className,
  onSearch,
}: SearchBarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleClose = () => {
    setIsOpen(false);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleClose();
    }
    if (e.key === "Enter" && onSearch) {
      onSearch(value);
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex items-center justify-end", className)}
    >
      <div
        className={cn(
          "flex items-center rounded-lg bg-input overflow-hidden",
          "transition-all duration-500 ease-in-out",
          isOpen
            ? "w-64 pr-2 pl-4 opacity-100 shadow-md"
            : "w-0 pr-0 pl-0 opacity-0 pointer-events-none",
        )}
        style={{ height: "40px" }}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "flex-1 bg-transparent text-sm text-foreground outline-none",
            "placeholder:text-muted-foreground min-w-0",
            "transition-opacity duration-300",
            isOpen ? "opacity-100 delay-200" : "opacity-0",
          )}
        />
      </div>
      <Button
        onClick={isOpen ? handleClose : handleOpen}
        aria-label={isOpen ? "Close search" : "Open search"}
        className={cn(
          "relative z-10 flex items-center justify-center",
          "h-10 w-10 rounded-lg shrink-0",
          "bg-primary text-primary-foreground",
          "transition-transform duration-300 ease-in-out",
          "hover:scale-105 active:scale-95",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isOpen && "-ml-10",
        )}
      >
        <Search
          className={cn(
            "h-4 w-4 transition-transform duration-300",
            isOpen && "rotate-90",
          )}
          strokeWidth={2.5}
        />
      </Button>
    </div>
  );
}
