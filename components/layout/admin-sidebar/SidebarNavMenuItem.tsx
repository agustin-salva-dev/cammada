"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SidebarNavItem } from "./types";

interface SidebarNavMenuItemProps {
  item: SidebarNavItem;
  pathname: string;
}

function isRouteActive(url: string, currentPath: string): boolean {
  if (url === "/dashboard") {
    return currentPath === "/dashboard";
  }
  return currentPath === url || currentPath.startsWith(`${url}/`);
}

export function SidebarNavMenuItem({
  item,
  pathname,
}: SidebarNavMenuItemProps) {
  const { isMobile, setOpenMobile } = useSidebar();
  const Icon = item.icon;
  const isActive = isRouteActive(item.url, pathname);

  const handleClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
        <Link href={item.url} onClick={handleClick}>
          <Icon className="shrink-0" />
          <span className="tracking-tight">{item.title}</span>
        </Link>
      </SidebarMenuButton>

      {item.publicUrl && (
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuAction asChild showOnHover>
              <Link
                href={item.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={
                  item.publicLabel ?? `Ver ${item.title} en web pública`
                }
                className="hover:text-primary hover:bg-sidebar-accent transition-colors"
              >
                <ExternalLink className="size-3.5" />
              </Link>
            </SidebarMenuAction>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            {item.publicLabel ?? `Ver versión pública (${item.publicUrl})`}
          </TooltipContent>
        </Tooltip>
      )}

      {item.badge && <SidebarMenuBadge>{item.badge.text}</SidebarMenuBadge>}
    </SidebarMenuItem>
  );
}
