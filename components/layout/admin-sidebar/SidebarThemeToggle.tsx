"use client";

import * as React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const emptySubscribe = () => () => {};

export function SidebarThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const themeLabel = mounted
    ? theme === "dark"
      ? "Oscuro"
      : theme === "light"
        ? "Claro"
        : "Sistema"
    : "Sistema";

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton tooltip="Cambiar tema">
            <div className="relative flex items-center justify-center size-4 shrink-0">
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
            </div>
            <span>Tema: {themeLabel}</span>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="end" className="w-36 font-heading">
          <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2 cursor-pointer">
            <Sun className="h-4 w-4 text-amber-500" />
            <span>Claro</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2 cursor-pointer">
            <Moon className="h-4 w-4 text-blue-400" />
            <span>Oscuro</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2 cursor-pointer">
            <Laptop className="h-4 w-4 text-muted-foreground" />
            <span>Sistema</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
