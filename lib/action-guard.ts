/**
 * Centralized authorization helpers for Server Actions.
 *
 * Principles:
 * - Single Responsibility: one place for all auth/permission checks.
 * - SUPERADMIN → always has all permissions (no DB query needed).
 * - ADMIN → has all permissions except `ajustes:configurar_roles`.
 * - Other roles → permissions are read dynamically from `rolConfig` in the DB,
 *   so admins can grant/revoke them at runtime from the Settings panel.
 */

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// Roles that bypass dynamic permission checks entirely.
const SUPERADMIN_ROLE = "SUPERADMIN";
const ADMIN_ROLE = "ADMIN";
// The one permission ADMIN cannot have (not configurable).
const ADMIN_FORBIDDEN_PERMISSION = "ajustes:configurar_roles";

export interface AuthorizedUser {
  id: string;
  name: string | null | undefined;
  role: string;
}

// ─────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────

async function getSession(): Promise<AuthorizedUser> {
  const session = await auth();

  if (!session?.user?.id || !session.user.role) {
    throw new ActionUnauthorizedError("No autenticado. Inicia sesión para continuar.");
  }

  return {
    id: session.user.id,
    name: session.user.name,
    role: session.user.role,
  };
}

// ─────────────────────────────────────────────────────────────
// Custom error classes for clean error handling downstream
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// Public helpers
// ─────────────────────────────────────────────────────────────

/**
 * Verifies the user is authenticated.
 * Throws `ActionUnauthorizedError` if there is no active session.
 */
export async function getAuthenticatedUser(): Promise<AuthorizedUser> {
  return getSession();
}

/**
 * Verifies the user is authenticated AND has the required permission.
 *
 * - SUPERADMIN: always allowed.
 * - ADMIN: allowed for everything except `ajustes:configurar_roles`.
 * - Other roles: permission must be listed in `rolConfig.permisos` for that role.
 *
 * Throws `ActionUnauthorizedError` or `ActionForbiddenError` on failure.
 */
export async function requirePermission(permission: string): Promise<AuthorizedUser> {
  const user = await getSession();

  // SUPERADMIN bypasses all checks.
  if (user.role === SUPERADMIN_ROLE) {
    return user;
  }

  // ADMIN bypasses most checks (except the forbidden one).
  if (user.role === ADMIN_ROLE) {
    if (permission === ADMIN_FORBIDDEN_PERMISSION) {
      throw new ActionForbiddenError(
        "No tienes permisos para realizar esta acción.",
      );
    }
    return user;
  }

  // Dynamic roles: consult the DB.
  const rolConfig = await db.rolConfig.findUnique({
    where: { nombre: user.role },
    select: { permisos: true },
  });

  if (!rolConfig) {
    throw new ActionForbiddenError(
      "Tu rol no está configurado en el sistema.",
    );
  }

  if (!rolConfig.permisos.includes(permission)) {
    throw new ActionForbiddenError(
      "No tienes permisos para realizar esta acción.",
    );
  }

  return user;
}

/**
 * Verifies the user is authenticated AND has an admin-level role
 * (SUPERADMIN or ADMIN). Used for account/user management actions.
 *
 * Throws `ActionUnauthorizedError` or `ActionForbiddenError` on failure.
 */
export async function requireAdmin(): Promise<AuthorizedUser> {
  const user = await getSession();

  if (user.role !== SUPERADMIN_ROLE && user.role !== ADMIN_ROLE) {
    throw new ActionForbiddenError(
      "Solo los administradores pueden realizar esta acción.",
    );
  }

  return user;
}

/**
 * Converts an `ActionUnauthorizedError` or `ActionForbiddenError` into a
 * standard `{ success: false, error: string }` result object, so actions
 * can return a typed error without crashing.
 *
 * Usage:
 * ```ts
 * } catch (error) {
 *   const authError = toAuthError(error);
 *   if (authError) return authError;
 *   // handle other errors...
 * }
 * ```
 */
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
