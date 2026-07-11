import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const SUPERADMIN_ROLE = "SUPERADMIN";
const ADMIN_ROLE = "ADMIN";
const ADMIN_FORBIDDEN_PERMISSION = "ajustes:configurar_roles";

export interface AuthorizedUser {
  id: string;
  name: string | null | undefined;
  role: string;
}

async function getSession(): Promise<AuthorizedUser> {
  const session = await auth();

  if (!session?.user?.id || !session.user.role) {
    throw new ActionUnauthorizedError(
      "No autenticado. Inicia sesión para continuar.",
    );
  }

  return {
    id: session.user.id,
    name: session.user.name,
    role: session.user.role,
  };
}

export class ActionUnauthorizedError extends Error {
  constructor(message = "No autenticado.") {
    super(message);
    this.name = "ActionUnauthorizedError";
  }
}

export class ActionForbiddenError extends Error {
  constructor(message = "No tienes permisos para realizar esta acción.") {
    super(message);
    this.name = "ActionForbiddenError";
  }
}

export async function getAuthenticatedUser(): Promise<AuthorizedUser> {
  return getSession();
}

export async function requirePermission(
  permission: string,
): Promise<AuthorizedUser> {
  const user = await getSession();

  if (user.role === SUPERADMIN_ROLE) {
    return user;
  }

  if (user.role === ADMIN_ROLE) {
    if (permission === ADMIN_FORBIDDEN_PERMISSION) {
      throw new ActionForbiddenError(
        "No tienes permisos para realizar esta acción.",
      );
    }
    return user;
  }

  const rolConfig = await db.rolConfig.findUnique({
    where: { nombre: user.role },
    select: { permisos: true },
  });

  if (!rolConfig) {
    throw new ActionForbiddenError("Tu rol no está configurado en el sistema.");
  }

  if (!rolConfig.permisos.includes(permission)) {
    throw new ActionForbiddenError(
      "No tienes permisos para realizar esta acción.",
    );
  }

  return user;
}

export async function hasPermission(permission: string): Promise<boolean> {
  try {
    await requirePermission(permission);
    return true;
  } catch {
    return false;
  }
}

export async function getUserRole(): Promise<string | null> {
  try {
    const user = await getSession();
    return user.role;
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<AuthorizedUser> {
  const user = await getSession();

  if (user.role !== SUPERADMIN_ROLE && user.role !== ADMIN_ROLE) {
    throw new ActionForbiddenError(
      "Solo los administradores pueden realizar esta acción.",
    );
  }

  return user;
}

export function toAuthError(
  error: unknown,
): { success: false; error: string } | null {
  if (
    error instanceof ActionUnauthorizedError ||
    error instanceof ActionForbiddenError
  ) {
    return { success: false, error: error.message };
  }
  return null;
}
