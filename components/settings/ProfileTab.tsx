"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  LogOut,
  Mail,
  Shield,
  User,
  Calendar,
  Phone,
} from "lucide-react";
import { updateProfileName } from "@/features/settings/actions";
import { logoutUser } from "@/features/auth/actions";
import { toast } from "sonner";
import Image from "next/image";

type UserProfile = {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  imagen: string | null;
  telefono: string | null;
  createdAt: Date;
  cuentas: { proveedor: string }[];
};

export function ProfileTab({ profile }: { profile: UserProfile }) {
  const [name, setName] = useState(profile.nombre);
  const [isPending, startTransition] = useTransition();
  const [isLoggingOut, startLogout] = useTransition();

  const hasGoogle = profile.cuentas.some((c) => c.proveedor === "google");
  const hasPassword = !hasGoogle || profile.cuentas.length === 0;

  function handleSaveName() {
    startTransition(async () => {
      const result = await updateProfileName(name);
      if (result.success) {
        toast.success("Nombre actualizado correctamente");
      } else {
        toast.error(result.error ?? "Error al actualizar");
      }
    });
  }

  function handleLogout() {
    startLogout(async () => {
      await logoutUser();
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Información Personal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold shrink-0 overflow-hidden">
              {profile.imagen ? (
                <Image
                  src={profile.imagen}
                  alt={profile.nombre}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              ) : (
                profile.nombre.charAt(0).toUpperCase()
              )}
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold">{profile.nombre}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                {profile.email}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  <Shield className="h-3 w-3 mr-1" />
                  {profile.rol}
                </Badge>
                {hasGoogle && <Badge variant="outline">Google</Badge>}
                {hasPassword && <Badge variant="outline">Email</Badge>}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                Teléfono
              </p>
              <p className="text-sm">{profile.telefono ?? "No especificado"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Cuenta creada
              </p>
              <p className="text-sm">
                {new Date(profile.createdAt).toLocaleDateString("es-AR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Editar Nombre</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="profile-name" className="sr-only">
                Nombre
              </Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                maxLength={25}
                disabled={isPending}
              />
            </div>
            <Button
              onClick={handleSaveName}
              disabled={isPending || name.trim() === profile.nombre}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Guardar"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Cerrar sesión</p>
              <p className="text-sm text-muted-foreground">
                Serás redirigido a la página de inicio de sesión
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar sesión
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
