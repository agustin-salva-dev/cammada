import { Button } from "@/components/ui/button";
import { CommandMenu } from "@/components/layout/CommandMenu";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { UserPlus } from "lucide-react";
import { Settings } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { auth } from "@/lib/auth";
import { getRolConfig } from "@/lib/action-guard";

import { IconButtonConfig } from "@/constants/ui";

export async function DashboardHeader() {
  const session = await auth();
  const user = session?.user;

  const userRole = user?.role ?? "AYUDANTE";
  let userPermissions: string[] = [];
  
  if (userRole === "SUPERADMIN") {
    userPermissions = [];
  } else if (userRole === "ADMIN") {
    userPermissions = [];
  } else {
    try {
      const rolConfig = await getRolConfig(userRole);
      userPermissions = rolConfig?.permisos ?? [];
    } catch (e) {
      console.error("Error al obtener rolConfig en Header:", e);
    }
  }

  const canManageAccounts =
    userRole === "SUPERADMIN" || userRole === "ADMIN";

  return (
    <header className="flex justify-between items-center mb-5">
      <CommandMenu userPermissions={userPermissions} />
      <div className="flex items-center gap-3">
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
