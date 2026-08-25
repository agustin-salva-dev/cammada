import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CommandMenu } from "@/components/layout/CommandMenu";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { UserPlus } from "lucide-react";
import { Settings } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { auth } from "@/lib/auth";
import { getRolConfig } from "@/lib/action-guard";

import { ALL_PERMISSIONS, DEFAULT_ROLE_PERMISSIONS } from "@/constants/permissions";
import { IconButtonConfig } from "@/constants/ui";

export async function DashboardHeader() {
  const session = await auth();
  const user = session?.user;

  const userRole = user?.role ?? "AYUDANTE";
  let userPermissions: string[] = [];

  if (userRole === "SUPERADMIN") {
    userPermissions = [...ALL_PERMISSIONS];
  } else if (userRole === "ADMIN") {
    userPermissions = [...DEFAULT_ROLE_PERMISSIONS.ADMIN];
  } else {
    try {
      const rolConfig = await getRolConfig(userRole);
      userPermissions = rolConfig?.permisos ?? [...DEFAULT_ROLE_PERMISSIONS.AYUDANTE];
    } catch (e) {
      console.error("Error al obtener rolConfig en Header:", e);
      userPermissions = [...DEFAULT_ROLE_PERMISSIONS.AYUDANTE];
    }
  }

  const canManageAccounts =
    userRole === "SUPERADMIN" || userRole === "ADMIN";

  return (
    <header className="flex justify-between items-center mb-5 gap-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <SidebarTrigger className="shrink-0" />
        <CommandMenu userPermissions={userPermissions} />
      </div>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <UserAvatar src={user?.image} name={user?.name} />
        {canManageAccounts && (
          <Button variant="outline" asChild>
            <Link
              href={ROUTES.ADMIN_REGISTER}
              target="_blank"
              rel="noopener noreferrer"
              title="Crear nueva cuenta"
            >
              <UserPlus
                size={IconButtonConfig.size}
                strokeWidth={IconButtonConfig.strokeWidth}
              />
            </Link>
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link href={ROUTES.DASHBOARD_SETTINGS}>
            <Settings
              size={IconButtonConfig.size}
              strokeWidth={IconButtonConfig.strokeWidth}
            />
          </Link>
        </Button>
      </div>
    </header>
  );
}
