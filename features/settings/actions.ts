"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { SYSTEM_ROLES } from "@/constants/permissions";
import {
  getAuthenticatedUser,
  requireAdmin,
  toAuthError,
} from "@/lib/action-guard";

/** ADMIN cannot target a SUPERADMIN for role changes. */
function assertCanManageRole(currentUserRole: string, targetUserRole: string) {
  if (currentUserRole === "ADMIN" && targetUserRole === "SUPERADMIN") {
    throw new Error("No tienes permisos para modificar un SUPERADMIN");
  }
}

export async function updateProfileName(name: string) {
  const user = await getAuthenticatedUser();
  const trimmed = name.trim();

  if (!trimmed || trimmed.length < 2 || trimmed.length > 25) {
    return {
      success: false,
      error: "El nombre debe tener entre 2 y 25 caracteres",
    };
  }

  try {
    await db.usuario.update({
      where: { id: user.id },
      data: { nombre: trimmed },
    });
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar nombre:", error);
    return { success: false, error: "No se pudo actualizar el nombre" };
  }
}

export async function getCurrentUserProfile() {
  const user = await getAuthenticatedUser();

  try {
    const profile = await db.usuario.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        imagen: true,
        telefono: true,
        createdAt: true,
        cuentas: {
          select: {
            proveedor: true,
          },
        },
      },
    });

    if (!profile) {
      return { success: false, error: "Usuario no encontrado" };
    }

    return { success: true, data: profile };
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    return { success: false, error: "No se pudo obtener el perfil" };
  }
}

export async function getAllUsers() {
  await requireAdmin();

  try {
    const usuarios = await db.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        imagen: true,
        password: false,
        createdAt: true,
        cuentas: {
          select: {
            proveedor: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return { success: true, data: usuarios };
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return { success: false, error: "No se pudieron cargar los usuarios" };
  }
}

export async function deleteUser(userId: string) {
  const currentUser = await requireAdmin();

  if (currentUser.id === userId) {
    return { success: false, error: "No puedes eliminar tu propia cuenta" };
  }

  try {
    const targetUser = await db.usuario.findUnique({
      where: { id: userId },
      select: { rol: true },
    });

    if (!targetUser) {
      return { success: false, error: "Usuario no encontrado" };
    }

    assertCanManageRole(currentUser.role, targetUser.rol);

    await db.usuario.delete({ where: { id: userId } });
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    if (error instanceof Error && error.message.includes("permisos")) {
      return { success: false, error: error.message };
    }
    console.error("Error al eliminar usuario:", error);
    return { success: false, error: "No se pudo eliminar el usuario" };
  }
}

export async function updateUserRole(userId: string, newRole: string) {
  const currentUser = await requireAdmin();

  if (currentUser.id === userId) {
    return { success: false, error: "No puedes cambiar tu propio rol" };
  }

  try {
    const targetUser = await db.usuario.findUnique({
      where: { id: userId },
      select: { rol: true },
    });

    if (!targetUser) {
      return { success: false, error: "Usuario no encontrado" };
    }

    assertCanManageRole(currentUser.role, targetUser.rol);

    if (currentUser.role === "ADMIN" && newRole === "SUPERADMIN") {
      return {
        success: false,
        error: "No tienes permisos para asignar el rol SUPERADMIN",
      };
    }

    const roleExists = await db.rolConfig.findUnique({
      where: { nombre: newRole },
    });

    if (!roleExists) {
      return { success: false, error: "El rol especificado no existe" };
    }

    await db.usuario.update({
      where: { id: userId },
      data: { rol: newRole },
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    const authError = toAuthError(error);
    if (authError) return authError;
    if (error instanceof Error && error.message.includes("permisos")) {
      return { success: false, error: error.message };
    }
    console.error("Error al actualizar rol:", error);
    return { success: false, error: "No se pudo actualizar el rol" };
  }
}

export async function getRolesConfig() {
  await requireAdmin();

  try {
    const roles = await db.rolConfig.findMany({
      orderBy: { createdAt: "asc" },
    });
    return { success: true, data: roles };
  } catch (error) {
    console.error("Error al obtener roles:", error);
    return { success: false, error: "No se pudieron cargar los roles" };
  }
}

export async function createCustomRole(name: string) {
  await requireAdmin();

  const trimmed = name.trim().toUpperCase();

  if (!trimmed || trimmed.length < 2 || trimmed.length > 30) {
    return {
      success: false,
      error: "El nombre del rol debe tener entre 2 y 30 caracteres",
    };
  }

  if (!/^[A-Z0-9_]+$/.test(trimmed)) {
    return {
      success: false,
      error:
        "El nombre del rol solo puede contener letras, números y guiones bajos",
    };
  }

  try {
    const existing = await db.rolConfig.findUnique({
      where: { nombre: trimmed },
    });

    if (existing) {
      return { success: false, error: "Ya existe un rol con ese nombre" };
    }

    await db.rolConfig.create({
      data: {
        nombre: trimmed,
        permisos: [],
        isSystem: false,
      },
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Error al crear rol:", error);
    return { success: false, error: "No se pudo crear el rol" };
  }
}

export async function updateRolePermissions(
  roleName: string,
  permissions: string[],
) {
  const user = await requireAdmin();

  if (roleName === "SUPERADMIN") {
    return {
      success: false,
      error: "No se pueden modificar los permisos del SUPERADMIN",
    };
  }
  if (user.role === "ADMIN" && roleName === "ADMIN") {
    return {
      success: false,
      error: "No puedes modificar los permisos de tu propio rol",
    };
  }

  try {
    await db.rolConfig.update({
      where: { nombre: roleName },
      data: { permisos: permissions },
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar permisos:", error);
    return { success: false, error: "No se pudieron actualizar los permisos" };
  }
}

export async function deleteCustomRole(roleName: string) {
  await requireAdmin();

  if ((SYSTEM_ROLES as readonly string[]).includes(roleName)) {
    return { success: false, error: "No se pueden eliminar roles del sistema" };
  }

  try {
    const usersWithRole = await db.usuario.count({
      where: { rol: roleName },
    });

    if (usersWithRole > 0) {
      return {
        success: false,
        error: `No se puede eliminar: hay ${usersWithRole} usuario(s) con este rol`,
      };
    }

    await db.rolConfig.delete({
      where: { nombre: roleName },
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar rol:", error);
    return { success: false, error: "No se pudo eliminar el rol" };
  }
}
