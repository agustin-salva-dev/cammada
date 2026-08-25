"use client";

import { LogOut } from "lucide-react";
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ModalConfirmacion } from "@/components/ui/ModalConfirmacion";

export function SidebarLogoutButton() {
  const handleLogout = async () => {
    const { logoutUser } = await import("@/features/auth/actions");
    await logoutUser();
  };

  return (
    <SidebarMenuItem>
      <ModalConfirmacion
        title="¿Cerrar sesión?"
        description="¿Estás seguro de que deseas cerrar tu sesión actual? Tendrás que volver a ingresar tus credenciales para acceder."
        confirmText="Cerrar sesión"
        cancelText="Cancelar"
        onConfirm={handleLogout}
        variant="destructive"
        trigger={
          <SidebarMenuButton tooltip="Cerrar sesión" className="text-destructive/80 hover:text-destructive hover:bg-destructive/10">
            <LogOut className="size-4 shrink-0" />
            <span>Cerrar sesión</span>
          </SidebarMenuButton>
        }
      />
    </SidebarMenuItem>
  );
}
