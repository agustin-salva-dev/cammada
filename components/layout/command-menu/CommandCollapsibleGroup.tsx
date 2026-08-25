"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";
import type { CommandItemConfig } from "./types";

interface CommandCollapsibleGroupProps {
  id: string;
  heading: string;
  items: CommandItemConfig[];
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onNavigate: (route: string) => void;
}

export const CommandCollapsibleGroup = React.memo(
  function CommandCollapsibleGroup({
    id,
    heading,
    items,
    isExpanded,
    onToggle,
    onNavigate,
  }: CommandCollapsibleGroupProps) {
    if (items.length === 0) return null;

    return (
      <CommandGroup
        value={id}
        heading={
          <button
            type="button"
            onClick={() => onToggle(id)}
            aria-expanded={isExpanded}
            className={cn(
              "flex w-full items-center justify-between pr-1 py-0.5",
              "cursor-pointer select-none rounded",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              "hover:text-foreground transition-colors",
            )}
          >
            <span>{heading}</span>
            <span className="flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center justify-center rounded-full px-1.5 py-0 text-[10px] font-semibold leading-4 tabular-nums",
                  "bg-muted text-muted-foreground transition-colors",
                )}
              >
                {items.length}
              </span>
              <ChevronRight
                className={cn(
                  "h-3 w-3 text-muted-foreground transition-transform duration-200",
                  isExpanded && "rotate-90",
                )}
              />
            </span>
          </button>
        }
      >
        {isExpanded &&
          items.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.route ?? item.label}
                value={`${item.label} ${item.keywords}${item.shortcut ? ` ${item.shortcut}` : ""}`}
                onSelect={() =>
                  item.onSelect ? item.onSelect() : onNavigate(item.route!)
                }
              >
                <Icon className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
                <span>{item.label}</span>
                {item.shortcut && (
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                )}
              </CommandItem>
            );
          })}
      </CommandGroup>
    );
  },
);
