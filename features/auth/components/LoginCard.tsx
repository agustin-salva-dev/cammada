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
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { loginUser, loginWithGoogle } from "@/features/auth/actions";
import type { AuthFormState } from "@/features/auth/actions";
import { toast } from "sonner";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  NoAccount:
    "No existe una cuenta con ese correo de Google. Contacta a un administrador.",
  Unauthorized:
    "No tienes permisos para registrar usuarios. Solo SUPERADMIN o ADMIN pueden hacerlo.",
  Unauthenticated: "Debes iniciar sesión para acceder a esa página.",
};

export default function LoginCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [state, formAction, isPending] = useActionState<
    AuthFormState | undefined,
    FormData
  >(loginUser, undefined);

  useEffect(() => {
    if (errorParam && AUTH_ERROR_MESSAGES[errorParam]) {
      toast.error(AUTH_ERROR_MESSAGES[errorParam]);
      router.replace("/admin");
    }
  }, [errorParam, router]);

  useEffect(() => {
    if (state?.success) {
      router.replace("/dashboard");
    }
  }, [state?.success, router]);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Ingresa a tu cuenta</CardTitle>
        <CardDescription>
          Ingresa tu correo para iniciar sesión en tu cuenta
        </CardDescription>
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
