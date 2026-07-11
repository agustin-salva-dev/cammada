"use server";

import { db } from "@/lib/db";
import { signIn, signOut } from "@/lib/auth";
import { hash } from "bcryptjs";
import { registerSchema, loginSchema } from "./zod";
import { AuthError } from "next-auth";
import { cookies, headers } from "next/headers";
import { requireAdmin, toAuthError } from "@/lib/action-guard";
import { checkRateLimit } from "@/lib/rate-limiter";

export type AuthFormState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

const AUTH_FLOW_COOKIE = "auth_flow";
const AUTH_FLOW_MAX_AGE = 600;

export async function registerUser(
  _prevState: AuthFormState | undefined,
  formData: FormData,
): Promise<AuthFormState> {
  try {
    await requireAdmin();
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) {
      return {
        success: false,
        message:
          "No tienes permisos para registrar usuarios. Debes estar autenticado como SUPERADMIN o ADMIN.",
      };
    }
    throw error;
  }

  const rawData = {
    nombre: formData.get("nombre") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    telefono: formData.get("telefono") as string,
    imagen: formData.get("imagen") as string,
  };

  const validated = registerSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { nombre, email, password, telefono, imagen } = validated.data;

  try {
    const existingUser = await db.usuario.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Ya existe una cuenta con este correo electrónico.",
      };
    }

    const hashedPassword = await hash(password, 12);

    await db.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        telefono: telefono || null,
        imagen: imagen || null,
      },
    });

    return {
      success: true,
      message: "Cuenta creada exitosamente.",
    };
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return {
      success: false,
      message: "Ocurrió un error al crear la cuenta. Intenta de nuevo.",
    };
  }
}

export async function loginUser(
  _prevState: AuthFormState | undefined,
  formData: FormData,
): Promise<AuthFormState> {
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const rateLimit = await checkRateLimit(`login:${ip}`);

  if (!rateLimit.allowed) {
    const minutesLeft = rateLimit.remainingMs
      ? Math.ceil(rateLimit.remainingMs / 60000)
      : 15;
    return {
      success: false,
      message: `Demasiados intentos fallidos. Espera ${minutesLeft} minuto(s) antes de intentar de nuevo.`,
    };
  }

  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validated = loginSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await signIn("credentials", {
      email: rawData.email,
      password: rawData.password,
      redirectTo: "/dashboard",
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Correo o contraseña incorrectos.",
          };
        default:
          return {
            success: false,
            message: "Ocurrió un error al iniciar sesión.",
          };
      }
    }
    throw error;
  }
}

export async function loginWithGoogle() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_FLOW_COOKIE, "login", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: AUTH_FLOW_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function registerWithGoogle() {
  await requireAdmin();

  const cookieStore = await cookies();
  cookieStore.set(AUTH_FLOW_COOKIE, "register", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: AUTH_FLOW_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function logoutUser() {
  await signOut({ redirectTo: "/admin" });
}
