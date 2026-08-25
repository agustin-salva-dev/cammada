"use client";

import * as React from "react";
import { Users, Shield, Pencil, Trash2 } from "lucide-react";
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import type { SearchResult } from "@/features/search/actions";

const SEARCH_CATEGORY_LABELS: Record<SearchResult["category"], string> = {
  luchadores: "Luchadores",
  equipos: "Equipos",
};

const SEARCH_CATEGORY_ICONS: Record<
  SearchResult["category"],
  React.ElementType
> = {
  luchadores: Users,
  equipos: Shield,
};

function hasPermission(permissions: string[], required?: string): boolean {
  if (!required) return true;
  return permissions.includes(required);
}

interface CommandSearchResultsProps {
  groupedResults: Partial<Record<SearchResult["category"], SearchResult[]>>;
  userPermissions: string[];
  onNavigate: (url: string) => void;
  onEdit: (item: SearchResult) => void;
  onDelete: (item: SearchResult) => void;
}

export function CommandSearchResults({
  groupedResults,
  userPermissions,
  onNavigate,
  onEdit,
  onDelete,
}: CommandSearchResultsProps) {
  return (
    <>
      {(
        Object.entries(groupedResults) as [
          SearchResult["category"],
          SearchResult[],
        ][]
      ).map(([category, items]) => {
        const Icon = SEARCH_CATEGORY_ICONS[category] ?? Users;
        const heading = SEARCH_CATEGORY_LABELS[category] ?? category;
        return (
          <CommandGroup key={category} heading={heading}>
            {items.map((item) => (
              <CommandItem
                key={item.id}
                value={`${item.label} ${item.description ?? ""}`}
                onSelect={() => onNavigate(item.url)}
                className="flex items-center justify-between group/item"
              >
                <div className="flex items-center flex-1 min-w-0">
                  <Icon className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{item.label}</span>
                    {item.description && (
                      <span className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 focus-within/item:opacity-100 transition-opacity ml-2 shrink-0">
                  {hasPermission(
                    userPermissions,
                    `${item.category}:editar`,
                  ) && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(item);
                      }}
                      title="Editar"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {hasPermission(
                    userPermissions,
                    `${item.category}:eliminar`,
                  ) && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item);
                      }}
                      title="Eliminar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        );
      })}
      <CommandSeparator />
    </>
  );
}
