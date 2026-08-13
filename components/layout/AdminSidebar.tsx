"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { CammadaLogo } from "@/components/layout/CammadaLogo";
import { ModalConfirmacion } from "@/components/ui/ModalConfirmacion";
import {
  LayoutDashboard,
  Users,
  Shield,
  Swords,
  CalendarDays,
  Trophy,
  Weight,
  Medal,
  Settings,
  LogOut,
  MessageSquare,
} from "lucide-react";

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
];

const competitionItems = [
  {
    title: "Luchadores",
    url: "/dashboard/luchadores",
    icon: Users,
  },
  {
    title: "Equipos",
    url: "/dashboard/equipos",
    icon: Shield,
  },
  {
    title: "Combates",
    url: "/dashboard/combates",
    icon: Swords,
  },
  {
    title: "Eventos",
    url: "/dashboard/eventos",
    icon: CalendarDays,
  },
];

const configItems = [
  {
    title: "Rankings",
    url: "/dashboard/rankings",
    icon: Trophy,
  },
  {
    title: "Categorías de Peso",
    url: "/dashboard/categorias-peso",
    icon: Weight,
  },
  {
    title: "Modalidades de Combate",
    url: "/dashboard/modalidades",
    icon: Medal,
  },
];

const comunidadItems = [
  {
    title: "Opiniones",
    url: "/dashboard/opiniones",
    icon: MessageSquare,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-4">
        <CammadaLogo />
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Competición</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {competitionItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Configuración</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Comunidad</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {comunidadItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Ajustes">
              <Link href="/dashboard/settings">
                <Settings />
                <span>Ajustes</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <ModalConfirmacion
              title="¿Cerrar sesión?"
              description="¿Estás seguro de que deseas cerrar tu sesión actual? Tendrás que volver a ingresar tus credenciales para acceder."
              confirmText="Cerrar sesión"
              cancelText="Cancelar"
              onConfirm={async () => {
                const { logoutUser } = await import("@/features/auth/actions");
                await logoutUser();
              }}
              variant="destructive"
              trigger={
                <SidebarMenuButton tooltip="Cerrar sesión">
                  <LogOut />
                  <span>Cerrar sesión</span>
                </SidebarMenuButton>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
