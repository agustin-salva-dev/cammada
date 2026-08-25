"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { CommandScopeId, CommandScopeTab } from "./types";

interface CommandScopeTabsProps {
  tabs: CommandScopeTab[];
  activeScope: CommandScopeId;
  onScopeChange: (scope: CommandScopeId) => void;
}

export const CommandScopeTabs = React.memo(function CommandScopeTabs({
  tabs,
  activeScope,
  onScopeChange,
}: CommandScopeTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Filtrar comandos por categoría"
      className="flex items-center gap-1 px-2 py-1.5 border-b border-border/50"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeScope === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onScopeChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150 select-none cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            <Icon className="h-3 w-3 shrink-0" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
});
