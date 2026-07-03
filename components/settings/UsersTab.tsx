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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Loader2, Trash2, Search, Mail, UserCheck } from "lucide-react";
import { deleteUser, updateUserRole } from "@/features/settings/actions";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

type UserItem = {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  imagen: string | null;
  createdAt: Date;
  cuentas: { proveedor: string }[];
};

type UsersTabProps = {
  users: UserItem[];
  currentUser: { id: string; role: string };
  roles: string[];
};

export function UsersTab({ users, currentUser, roles }: UsersTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserForDelete, setSelectedUserForDelete] =
    useState<UserItem | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredUsers = users.filter(
    (u) =>
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const canManage = (targetUser: UserItem) => {
    if (targetUser.id === currentUser.id) return false;

    if (currentUser.role === "ADMIN" && targetUser.rol === "SUPERADMIN")
      return false;
    return true;
  };

  const handleRoleChange = (
    userId: string,
    targetUserRol: string,
    newRole: string,
  ) => {
    if (currentUser.role === "ADMIN" && targetUserRol === "SUPERADMIN") {
      toast.error("No puedes cambiar el rol de un Super Admin");
      return;
    }
    if (currentUser.role === "ADMIN" && newRole === "SUPERADMIN") {
      toast.error("No tienes permisos para asignar el rol SUPERADMIN");
      return;
    }

    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        toast.success("Rol actualizado correctamente");
      } else {
        toast.error(result.error ?? "Error al actualizar rol");
      }
    });
  };

  const handleDeleteConfirm = () => {
    if (!selectedUserForDelete) return;

    startTransition(async () => {
      const result = await deleteUser(selectedUserForDelete.id);
      if (result.success) {
        toast.success("Usuario eliminado correctamente");
        setSelectedUserForDelete(null);
      } else {
        toast.error(result.error ?? "Error al eliminar usuario");
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Cuentas Creadas
          </CardTitle>
          <CardDescription>
            Administra los roles de las cuentas y elimina usuarios si es
            necesario.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre o correo..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="border rounded-md divide-y overflow-hidden">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No se encontraron usuarios.
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isGoogle = user.cuentas.some(
                  (c) => c.proveedor === "google",
                );
                const editable = canManage(user);

                return (
                  <div
                    key={user.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-sm overflow-hidden shrink-0">
                        {user.imagen ? (
                          <Image
                            src={user.imagen}
                            alt={user.nombre}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          user.nombre.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm">{user.nombre}</p>
                          {user.id === currentUser.id && (
                            <Badge
                              variant="outline"
                              className="text-[10px] py-0"
                            >
                              Tú
                            </Badge>
                          )}
                          <Badge
                            variant="secondary"
                            className="text-[10px] py-0"
                          >
                            {user.rol}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                          <span className="text-muted-foreground/50">•</span>
                          <span>{isGoogle ? "Google" : "Email"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      {editable ? (
                        <>
                          <div className="w-36">
                            <NativeSelect
                              value={user.rol}
                              disabled={isPending}
                              onChange={(e) =>
                                handleRoleChange(
                                  user.id,
                                  user.rol,
                                  e.target.value,
                                )
                              }
                            >
                              {roles.map((roleName) => (
                                <option
                                  key={roleName}
                                  value={roleName}
                                  className="bg-zinc-900 text-zinc-100 dark:bg-zinc-950 dark:text-zinc-50"
                                  disabled={
                                    currentUser.role === "ADMIN" &&
                                    roleName === "SUPERADMIN"
                                  }
                                >
                                  {roleName}
                                </option>
                              ))}
                            </NativeSelect>
                          </div>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 w-9"
                                onClick={() => setSelectedUserForDelete(user)}
                                disabled={isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  ¿Eliminar cuenta?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Se eliminará
                                  de forma permanente la cuenta de{" "}
                                  <strong className="text-foreground">
                                    {user.nombre}
                                  </strong>{" "}
                                  y todos sus datos asociados.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel
                                  onClick={() => setSelectedUserForDelete(null)}
                                >
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive hover:bg-destructive/95"
                                  onClick={handleDeleteConfirm}
                                  disabled={isPending}
                                >
                                  {isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  ) : null}
                                  Eliminar Cuenta
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      ) : (
                        <div className="text-xs text-muted-foreground italic px-3 py-1.5">
                          {user.id === currentUser.id
                            ? "No editable (Tu cuenta)"
                            : "Sin permisos"}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
