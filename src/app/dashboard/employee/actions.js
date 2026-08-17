"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Returns a Date object normalized to midnight UTC (YYYY-MM-DD)
 * to match PostgreSQL @db.Date column in Prisma schema.
 */
function getTodayDate() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

export async function checkInAction() {
  // 1. Get authenticated session (Security: never trust client inputs)
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized. Please log in again." };
  }

  const userId = session.user.id;
  const today = getTodayDate();
  const now = new Date();

  try {
    // 2. Check if user already checked in today
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: userId,
          date: today,
        },
      },
    });

    if (existingAttendance) {
      return { success: false, error: "You have already checked in today." };
    }

    // 3. Determine status (If 9:00 AM or later, mark LATE, otherwise PRESENT)
    const isLate = now.getHours() >= 9;
    const status = isLate ? "LATE" : "PRESENT";

    // 4. Create attendance record
    await prisma.attendance.create({
      data: {
        employeeId: userId,
        date: today,
        checkIn: now,
        status: status,
      },
    });

    // 5. Revalidate cache for employee dashboard UI
    revalidatePath("/dashboard/employee");

    return { success: true };
  } catch (error) {
    console.error("Check-in error:", error);
    return { success: false, error: "Failed to record check-in. Please try again." };
  }
}

export async function checkOutAction() {
  // 1. Get authenticated session
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized. Please log in again." };
  }

  const userId = session.user.id;
  const today = getTodayDate();
  const now = new Date();

  try {
    // 2. Find today's attendance record
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: userId,
          date: today,
        },
      },
    });

    if (!existingAttendance) {
      return { success: false, error: "You must check in first before checking out." };
    }

    if (existingAttendance.checkOut) {
      return { success: false, error: "You have already checked out today." };
    }

    // 3. Update checkOut timestamp
    await prisma.attendance.update({
      where: {
        id: existingAttendance.id,
      },
      data: {
        checkOut: now,
      },
    });

    // 4. Revalidate cache for employee dashboard UI
    revalidatePath("/dashboard/employee");

    return { success: true };
  } catch (error) {
    console.error("Check-out error:", error);
    return { success: false, error: "Failed to record check-out. Please try again." };
  }
}
