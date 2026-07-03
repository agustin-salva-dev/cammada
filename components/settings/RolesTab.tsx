"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, ShieldAlert, Trash2 } from "lucide-react";
import {
  createCustomRole,
  updateRolePermissions,
  deleteCustomRole,
} from "@/features/settings/actions";
import { toast } from "sonner";
import {
  PERMISSIONS,
  ALL_PERMISSIONS,
  PERMISSION_GROUP_LABELS,
  PERMISSION_ACTION_LABELS,
} from "@/constants/permissions";

type RoleConfig = {
  id: string;
  nombre: string;
  permisos: string[];
  isSystem: boolean;
};

type RolesTabProps = {
  rolesConfig: RoleConfig[];
  currentUser: { id: string; role: string };
};

export function RolesTab({ rolesConfig, currentUser }: RolesTabProps) {
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleConfig | null>(
    rolesConfig[0] || null,
  );
  const [isPending, startTransition] = useTransition();

  const currentRole =
    rolesConfig.find((r) => r.nombre === selectedRole?.nombre) ?? selectedRole;

  const currentUserPermissions =
    rolesConfig.find((r) => r.nombre === currentUser.role)?.permisos ?? [];

  const permissionGroups = Object.keys(PERMISSIONS) as Array<
    keyof typeof PERMISSIONS
  >;

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newRoleName.trim().toUpperCase();
    if (!cleanName) return;

    startTransition(async () => {
      const result = await createCustomRole(cleanName);
      if (result.success) {
        toast.success(`Rol "${cleanName}" creado correctamente`);
        setNewRoleName("");
        const newlyCreated = rolesConfig.find((r) => r.nombre === cleanName);
        if (newlyCreated) setSelectedRole(newlyCreated);
      } else {
        toast.error(result.error ?? "Error al crear el rol");
      }
    });
  };

  const handleTogglePermission = (permission: string) => {
    if (!currentRole) return;
    if (currentRole.nombre === "SUPERADMIN") {
      toast.error("No se pueden editar los permisos del SUPERADMIN");
      return;
    }
    if (currentUser.role === "ADMIN" && currentRole.nombre === "ADMIN") {
      toast.error("No puedes editar los permisos de tu propio rol");
      return;
    }
    if (
      !currentUserPermissions.includes(permission) &&
      currentUser.role !== "SUPERADMIN"
    ) {
      toast.error("No posees este permiso para poder otorgarlo");
      return;
    }

    const isAssigned = currentRole.permisos.includes(permission);
    const updatedPermissions = isAssigned
      ? currentRole.permisos.filter((p) => p !== permission)
      : [...currentRole.permisos, permission];

    startTransition(async () => {
      const result = await updateRolePermissions(
        currentRole.nombre,
        updatedPermissions,
      );
      if (result.success) {
        toast.success("Permiso actualizado");
      } else {
        toast.error(result.error ?? "Error al actualizar permisos");
      }
    });
  };

  const handleToggleAllPermissions = () => {
    if (!currentRole) return;

    const assignablePermissions = ALL_PERMISSIONS.filter(
      (p) =>
        currentUser.role === "SUPERADMIN" || currentUserPermissions.includes(p),
    );
    const hasAll = assignablePermissions.every((p) =>
      currentRole.permisos.includes(p),
    );
    const updatedPermissions = hasAll
      ? currentRole.permisos.filter((p) => !assignablePermissions.includes(p))
      : Array.from(
          new Set([...currentRole.permisos, ...assignablePermissions]),
        );

    startTransition(async () => {
      const result = await updateRolePermissions(
        currentRole.nombre,
        updatedPermissions,
      );
      if (result.success) {
        toast.success(
          hasAll
            ? "Se removieron los permisos"
            : "Se otorgaron todos tus permisos",
        );
      } else {
        toast.error(result.error ?? "Error al actualizar permisos");
      }
    });
  };

  const handleToggleGroupPermissions = (groupKey: keyof typeof PERMISSIONS) => {
    if (!currentRole) return;

    const groupPermissions = Object.values(PERMISSIONS[groupKey]);
    const assignableGroupPermissions = groupPermissions.filter(
      (p) =>
        currentUser.role === "SUPERADMIN" || currentUserPermissions.includes(p),
    );

    if (assignableGroupPermissions.length === 0) {
      toast.error("No tienes permisos en esta sección para otorgar");
      return;
    }

    const hasAll = assignableGroupPermissions.every((p) =>
      currentRole.permisos.includes(p),
    );
    const updatedPermissions = hasAll
      ? currentRole.permisos.filter(
          (p) => !assignableGroupPermissions.includes(p),
        )
      : Array.from(
          new Set([...currentRole.permisos, ...assignableGroupPermissions]),
        );

    startTransition(async () => {
      const result = await updateRolePermissions(
        currentRole.nombre,
        updatedPermissions,
      );
      if (result.success) {
        toast.success(
          hasAll
            ? "Se desmarcaron los permisos"
            : "Se marcaron todos los permisos",
        );
      } else {
        toast.error(result.error ?? "Error al actualizar permisos");
      }
    });
  };

  const handleDeleteRole = (roleName: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el rol "${roleName}"?`)) {
      startTransition(async () => {
        const result = await deleteCustomRole(roleName);
        if (result.success) {
          toast.success("Rol eliminado correctamente");
          if (selectedRole?.nombre === roleName) {
            setSelectedRole(rolesConfig[0] || null);
          }
        } else {
          toast.error(result.error ?? "Error al eliminar el rol");
        }
      });
    }
  };

  const isEditable =
    currentRole &&
    currentRole.nombre !== "SUPERADMIN" &&
    !(currentUser.role === "ADMIN" && currentRole.nombre === "ADMIN");

  return (
    <div className="grid gap-6 md:grid-cols-12">
      <div className="md:col-span-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Roles Disponibles</CardTitle>
            <CardDescription>
              Selecciona un rol para ver y editar sus permisos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              {rolesConfig.map((role) => (
                <div
                  key={role.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedRole(role)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedRole(role);
                    }
                  }}
                  className={`flex items-center justify-between p-3 rounded-lg text-left text-sm font-medium transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    currentRole?.nombre === role.nombre
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 hover:bg-muted text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {role.nombre}
                    {role.isSystem && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-foreground/10 text-current">
                        Sistema
                      </span>
                    )}
                  </span>
                  {!role.isSystem && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`h-7 w-7 text-destructive hover:bg-destructive/20 ${
                        currentRole?.nombre === role.nombre
                          ? "text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRole(role.nombre);
                      }}
                      disabled={isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleAddRole} className="pt-4 border-t space-y-3">
              <p className="text-sm font-semibold">Agregar Nuevo Rol</p>
              <div className="flex gap-2">
                <Input
                  placeholder="EJ: AYUDANTE_VIP"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  disabled={isPending}
                  className="uppercase text-xs"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isPending || !newRoleName.trim()}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-8">
        {currentRole ? (
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b mb-6">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Permisos de {currentRole.nombre}
                </CardTitle>
                <CardDescription>
                  {currentRole.nombre === "SUPERADMIN"
                    ? "El Super Admin posee todos los privilegios del sistema."
                    : "Configura qué acciones tiene permitido realizar este rol."}
                </CardDescription>
              </div>
              {isEditable && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleAllPermissions}
                  disabled={isPending}
                  className="shrink-0"
                >
                  Otorgar todos mis permisos
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {!isEditable && (
                <div className="mb-6 p-3 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>
                    Los permisos de este rol son fijos y no pueden ser
                    modificados.
                  </span>
                </div>
              )}

              <div className="space-y-8">
                {permissionGroups.map((groupKey) => {
                  const label = PERMISSION_GROUP_LABELS[groupKey] ?? groupKey;
                  const groupPermissions = Object.values(PERMISSIONS[groupKey]);

                  const viewableGroupPermissions = groupPermissions.filter(
                    (p) =>
                      currentUser.role === "SUPERADMIN" ||
                      currentUserPermissions.includes(p),
                  );

                  if (viewableGroupPermissions.length === 0) return null;

                  const hasAllGroup = viewableGroupPermissions.every((p) =>
                    currentRole.permisos.includes(p),
                  );

                  return (
                    <div key={groupKey} className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h4 className="text-sm font-semibold text-foreground">
                          {label}
                        </h4>
                        {isEditable && (
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleGroupPermissions(groupKey)
                            }
                            disabled={isPending}
                            className="text-xs text-primary hover:underline font-medium"
                          >
                            {hasAllGroup
                              ? "Desmarcar todos"
                              : "Seleccionar todos"}
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {viewableGroupPermissions.map((permission) => {
                          const action = permission.split(":")[1];
                          const actionLabel =
                            PERMISSION_ACTION_LABELS[action] ?? action;
                          const hasPermission =
                            currentRole.permisos.includes(permission);

                          return (
                            <label
                              key={permission}
                              className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition-colors ${
                                hasPermission
                                  ? "bg-primary/5 border-primary/20 text-primary"
                                  : "bg-background border-input text-muted-foreground"
                              } ${isEditable ? "cursor-pointer hover:bg-muted/50" : "opacity-80"}`}
                            >
                              <input
                                type="checkbox"
                                checked={hasPermission}
                                disabled={!isEditable || isPending}
                                onChange={() =>
                                  handleTogglePermission(permission)
                                }
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                              />
                              <span className="font-medium text-xs sm:text-sm">
                                {actionLabel}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="h-full flex items-center justify-center border-2 border-dashed rounded-lg p-12 text-muted-foreground">
            Selecciona un rol de la lista para ver su configuración de permisos.
          </div>
        )}
      </div>
    </div>
  );
}
