import type { ElementType } from "react";

export interface SidebarNavItem {
  title: string;
  url: string;
  icon: ElementType;
  publicUrl?: string;
  publicLabel?: string;
  badge?: {
    text: string;
    variant?: "default" | "outline" | "secondary" | "destructive";
  };
}

export interface SidebarNavSectionConfig {
  title: string;
  items: SidebarNavItem[];
}

export interface AdminUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}
