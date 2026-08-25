"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SidebarNavMenuItem } from "./SidebarNavMenuItem";
import type { SidebarNavSectionConfig } from "./types";

interface SidebarNavSectionProps {
  section: SidebarNavSectionConfig;
  pathname: string;
  defaultOpen?: boolean;
}

function isRouteActive(url: string, currentPath: string): boolean {
  if (url === "/dashboard") {
    return currentPath === "/dashboard";
  }
  return currentPath === url || currentPath.startsWith(`${url}/`);
}

export function SidebarNavSection({
  section,
  pathname,
  defaultOpen = true,
}: SidebarNavSectionProps) {
  const hasActiveItem = section.items.some((item) =>
    isRouteActive(item.url, pathname),
  );

  const [userToggled, setUserToggled] = React.useState<boolean | null>(null);
  const isOpen = userToggled ?? (defaultOpen || hasActiveItem);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(next) => setUserToggled(next)}
      className="group/collapsible"
    >
      <SidebarGroup className="p-2">
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 cursor-pointer select-none transition-colors group-data-[collapsible=icon]:hidden">
            <span>{section.title}</span>
            <ChevronRight className="size-3.5 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent className="group-data-[collapsible=icon]:!block transition-all duration-200">
          <SidebarGroupContent>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarNavMenuItem
                  key={item.url}
                  item={item}
                  pathname={pathname}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
