import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import AdminStatsCards from "../components/AdminStatsCards";
import UserManagementTable from "../components/UserManagementTable";

function getTodayDate() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

export default async function AdminDashboard() {
  const session = await auth();
  const user = session?.user;

  // Security check: Ensure Admin role
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="p-6 text-center text-destructive font-medium">
        Unauthorized access. Admin privileges required.
      </div>
    );
  }

  const today = getTodayDate();

  // 1. Fetch company-wide users
  const users = await prisma.user.findMany({
    select: {
      id: true,
      employeeId: true,
      name: true,
      email: true,
      role: true,
      departmentId: true,
      isActive: true,
      department: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  // 2. Fetch list of departments
  const departments = await prisma.department.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // 3. Fetch today's company-wide attendance
  const todayAttendance = await prisma.attendance.findMany({
    where: {
      date: today,
    },
  });

  // 4. Compute company metrics
  const totalUsers = users.length;
  const totalDepartments = departments.length;
  const presentToday = todayAttendance.length;
  const companyAttendanceRate =
    totalUsers > 0 ? Math.round((presentToday / totalUsers) * 100) : 0;

  const stats = {
    totalUsers,
    totalDepartments,
    presentToday,
    companyAttendanceRate,
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground text-sm">
          Organization-wide management &bull; Welcome back, <span className="font-semibold text-foreground">{user.name}</span>
        </p>
      </div>

      {/* Organization Metric Cards */}
      <AdminStatsCards stats={stats} />

      {/* User Management & Directory */}
      <UserManagementTable users={users} departments={departments} />
    </div>
  );
}