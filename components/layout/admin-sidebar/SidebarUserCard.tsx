"use client";

import { UserAvatar } from "@/components/ui/UserAvatar";
import { Badge } from "@/components/ui/badge";
import type { AdminUser } from "./types";

interface SidebarUserCardProps {
  user?: AdminUser | null;
}

export function SidebarUserCard({ user }: SidebarUserCardProps) {
  if (!user) return null;

  const role = user.role ?? "ADMIN";
  const name = user.name ?? "Administrador";
  const email = user.email ?? "";

  return (
    <div className="flex items-center gap-2.5 p-2 rounded-xl bg-sidebar-accent/40 border border-sidebar-border/60 transition-all duration-200 group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:justify-center">
      <UserAvatar src={user.image} name={name} />
      <div className="flex flex-col min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
        <div className="flex items-center justify-between gap-1">
          <span className="truncate text-xs font-semibold text-foreground">
            {name}
          </span>
          <Badge
            variant="outline"
            className="text-[9px] px-1.5 py-0 h-4 uppercase font-bold tracking-wider shrink-0 bg-primary/10 text-primary border-primary/20"
          >
            {role}
          </Badge>
        </div>
        {email && (
          <span className="truncate text-[10px] text-muted-foreground">
            {email}
          </span>
        )}
      </div>
    </div>
  );
}
