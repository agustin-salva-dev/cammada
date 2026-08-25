"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { CammadaLogo } from "@/components/layout/CammadaLogo";
import {
  SIDEBAR_SECTIONS,
  SidebarNavSection,
  SidebarUserCard,
  SidebarThemeToggle,
  SidebarLogoutButton,
  type AdminUser,
} from "./admin-sidebar";
import { ROUTES } from "@/constants/routes";

interface AdminSidebarProps {
  user?: AdminUser | null;
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      className="font-heading border-r border-sidebar-border"
    >
      <SidebarHeader className="px-3 py-3 flex flex-row items-center justify-between group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center">
        <div className="group-data-[collapsible=icon]:hidden">
          <CammadaLogo />
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="gap-0 py-2">
        <SidebarNavSection
          section={SIDEBAR_SECTIONS.main}
          pathname={pathname}
        />
        <SidebarNavSection
          section={SIDEBAR_SECTIONS.competition}
          pathname={pathname}
        />
        <SidebarNavSection
          section={SIDEBAR_SECTIONS.parameters}
          pathname={pathname}
        />
        <SidebarNavSection
          section={SIDEBAR_SECTIONS.community}
          pathname={pathname}
        />
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="gap-2 p-2">
        {user && <SidebarUserCard user={user} />}
        <SidebarMenu>
          <SidebarThemeToggle />
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === ROUTES.DASHBOARD_SETTINGS}
              tooltip="Ajustes"
            >
              <Link
                href={ROUTES.DASHBOARD_SETTINGS}
                onClick={() => {
                  if (isMobile) setOpenMobile(false);
                }}
              >
                <Settings className="size-4 shrink-0" />
                <span>Ajustes</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarLogoutButton />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
