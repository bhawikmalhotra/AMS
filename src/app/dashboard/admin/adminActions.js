"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

/**
 * Helper to verify Admin authorization server-side
 */
async function verifyAdminSession() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized. Only Admins can perform this action.");
  }
  return session;
}

export async function createUserAction(formData) {
  try {
    await verifyAdminSession();

    const { name, email, employeeId, password, role, departmentId } = formData;

    if (!name || !email || !employeeId || !password || !role) {
      return { success: false, error: "Please fill in all required fields." };
    }

    // Check unique constraints
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return { success: false, error: "An account with this email already exists." };
    }

    const existingEmpId = await prisma.user.findUnique({ where: { employeeId } });
    if (existingEmpId) {
      return { success: false, error: "An account with this Employee ID already exists." };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Business rule: ADMINs have departmentId = null
    const finalDepartmentId = role === "ADMIN" ? null : departmentId || null;

    await prisma.user.create({
      data: {
        name,
        email,
        employeeId,
        password: hashedPassword,
        role,
        departmentId: finalDepartmentId,
        isActive: true,
      },
    });

    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error) {
    console.error("Create user error:", error);
    return { success: false, error: error.message || "Failed to create user account." };
  }
}

export async function updateUserRoleAction(userId, newRole) {
  try {
    await verifyAdminSession();

    if (!["EMPLOYEE", "MANAGER", "ADMIN"].includes(newRole)) {
      return { success: false, error: "Invalid role specified." };
    }

    // Business rule: ADMINs have departmentId = null
    const updateData = {
      role: newRole,
      ...(newRole === "ADMIN" ? { departmentId: null } : {}),
    };

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error) {
    console.error("Update role error:", error);
    return { success: false, error: error.message || "Failed to update role." };
  }
}

export async function updateUserDepartmentAction(userId, newDepartmentId) {
  try {
    await verifyAdminSession();

    // Check if target user is an Admin
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (targetUser?.role === "ADMIN") {
      return { success: false, error: "Admins cannot belong to a specific department." };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        departmentId: newDepartmentId || null,
      },
    });

    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error) {
    console.error("Update department error:", error);
    return { success: false, error: error.message || "Failed to update department." };
  }
}

export async function toggleUserStatusAction(userId, newStatus) {
  try {
    await verifyAdminSession();

    await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: newStatus,
      },
    });

    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error) {
    console.error("Toggle status error:", error);
    return { success: false, error: error.message || "Failed to update user status." };
  }
}
