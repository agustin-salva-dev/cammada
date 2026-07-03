import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getCurrentUserProfile,
  getAllUsers,
  getRolesConfig,
} from "@/features/settings/actions";
import { ProfileTab } from "@/components/settings/ProfileTab";
import { UsersTab } from "@/components/settings/UsersTab";
import { RolesTab } from "@/components/settings/RolesTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Users, ShieldAlert } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin");
  }

  const profileRes = await getCurrentUserProfile();
  if (!profileRes.success || !profileRes.data) {
    return (
      <div className="p-6 text-center text-destructive">
        Error al cargar el perfil del usuario.
      </div>
    );
  }

  const currentUser = {
    id: session.user.id,
    role: session.user.role || "AYUDANTE",
  };

  const isManagementAllowed =
    currentUser.role === "SUPERADMIN" || currentUser.role === "ADMIN";

  let usersData: any[] = [];
  let rolesData: any[] = [];

  if (isManagementAllowed) {
    const [usersRes, rolesRes] = await Promise.all([
      getAllUsers(),
      getRolesConfig(),
    ]);

    if (usersRes.success && usersRes.data) {
      usersData = usersRes.data;
    }
    if (rolesRes.success && rolesRes.data) {
      rolesData = rolesRes.data;
    }
  }

  const roleNames = rolesData.map((r) => r.nombre);
  if (roleNames.length === 0) {
    roleNames.push("SUPERADMIN", "ADMIN", "AYUDANTE");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ajustes</h1>
        <p className="text-muted-foreground">
          Gestiona tu cuenta personal y configura los roles y permisos de la
          aplicación.
        </p>
      </div>

      <Tabs defaultValue="perfil" className="space-y-4">
        <TabsList className="bg-muted p-1 rounded-lg">
          <TabsTrigger value="perfil" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Mi Perfil</span>
          </TabsTrigger>
          {isManagementAllowed && (
            <>
              <TabsTrigger value="usuarios" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Usuarios</span>
              </TabsTrigger>
              <TabsTrigger value="roles" className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                <span>Roles y Permisos</span>
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="perfil" className="space-y-4">
          <ProfileTab profile={profileRes.data as any} />
        </TabsContent>

        {isManagementAllowed && (
          <>
            <TabsContent value="usuarios" className="space-y-4">
              <UsersTab
                users={usersData}
                currentUser={currentUser}
                roles={roleNames}
              />
            </TabsContent>

            <TabsContent value="roles" className="space-y-4">
              <RolesTab rolesConfig={rolesData} currentUser={currentUser} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
