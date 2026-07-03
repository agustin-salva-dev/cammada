"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { registerUser, registerWithGoogle } from "@/features/auth/actions";
import type { AuthFormState } from "@/features/auth/actions";

export default function RegisterCard() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<
    AuthFormState | undefined,
    FormData
  >(registerUser, undefined);

  useEffect(() => {
    if (state?.success) {
      router.push(ROUTES.ADMIN);
    }
  }, [state?.success, router]);

  return (
    <Card className="w-full max-w-sm flex flex-col max-h-[calc(100vh-140px)]">
      <CardHeader className="shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => router.push(ROUTES.ADMIN)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>Crea una cuenta</CardTitle>
            <CardDescription>
              Rellena los datos para crear tu cuenta de gestion
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-y-auto flex-1">
        <form id="register-form" action={formAction}>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Nombre"
                maxLength={25}
                required
                disabled={isPending}
              />
              {state?.errors?.nombre && (
                <p className="text-sm text-destructive">
                  {state.errors.nombre[0]}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@correo.com"
                required
                disabled={isPending}
              />
              {state?.errors?.email && (
                <p className="text-sm text-destructive">
                  {state.errors.email[0]}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Al menos 8 caracteres"
                required
                disabled={isPending}
              />
              {state?.errors?.password && (
                <div className="text-sm text-destructive">
                  <ul className="list-disc pl-4 space-y-1">
                    {state.errors.password.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="telefono">
                Número de teléfono{" "}
                <span className="text-muted-foreground font-normal">
                  (opcional)
                </span>
              </Label>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                placeholder="+54 387 1234567"
                maxLength={20}
                disabled={isPending}
              />
              {state?.errors?.telefono && (
                <p className="text-sm text-destructive">
                  {state.errors.telefono[0]}
                </p>
              )}
            </div>

            {state?.message && (
              <p
                className={`text-sm text-center ${
                  state.success ? "text-green-600" : "text-destructive"
                }`}
              >
                {state.message}
              </p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="shrink-0 flex-col gap-2">
        <Button
          type="submit"
          form="register-form"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" />
              Creando cuenta...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Crear cuenta
            </>
          )}
        </Button>
        <form action={registerWithGoogle} className="w-full">
          <Button
            type="submit"
            variant="outline"
            className="w-full"
            disabled={isPending}
          >
            Registrarse con Google
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
