"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, Loader2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { loginUser, loginWithGoogle } from "@/features/auth/actions";
import type { AuthFormState } from "@/features/auth/actions";

export default function LoginCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleError = searchParams.get("error");

  const [state, formAction, isPending] = useActionState<
    AuthFormState | undefined,
    FormData
  >(loginUser, undefined);

  useEffect(() => {
    if (state?.success) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [state?.success, router]);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Ingresa a tu cuenta</CardTitle>
        <CardDescription>
          Ingresa tu correo para iniciar sesión en tu cuenta
        </CardDescription>
        <CardAction className="flex">
          <Button
            variant="ghost"
            className="text-muted-foreground"
            onClick={() => router.push(ROUTES.ADMIN_REGISTER)}
          >
            Registrarse <ChevronRight />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="login-form" action={formAction}>
          <div className="flex flex-col gap-6">
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
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={isPending}
              />
              {state?.errors?.password && (
                <p className="text-sm text-destructive">
                  {state.errors.password[0]}
                </p>
              )}
            </div>
            {state?.message && !state.success && (
              <p className="text-sm text-destructive text-center">
                {state.message}
              </p>
            )}
            {googleError === "NoAccount" && (
              <p className="text-sm text-destructive text-center">
                No existe una cuenta con ese correo de Google. Regístrate
                primero.
              </p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          form="login-form"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" />
              Ingresando...
            </>
          ) : (
            "Ingresar"
          )}
        </Button>
        <form action={loginWithGoogle} className="w-full">
          <Button
            type="submit"
            variant="outline"
            className="w-full"
            disabled={isPending}
          >
            Iniciar sesión con Google
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
