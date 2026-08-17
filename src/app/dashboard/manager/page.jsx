import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ManagerStatsCards from "../components/ManagerStatsCards";
import DepartmentAttendanceTable from "../components/DepartmentAttendanceTable";

export const metadata = {
  title: "Manager Dashboard",
  description: "Monitor department employee attendance and daily statistics at VYNS Global.",
};

function getTodayDate() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

export default async function ManagerDashboard() {
  const session = await auth();
  const user = session?.user;

  // Security check: Ensure user is logged in and belongs to a department
  if (!user || !user.departmentId) {
    return (
      <div className="p-6 text-center text-destructive font-medium">
        Unauthorized. Managers must belong to an assigned department.
      </div>
    );
  }

  const today = getTodayDate();

  // 1. Fetch Department Info
  const department = await prisma.department.findUnique({
    where: {
      id: user.departmentId,
    },
    select: {
      name: true,
    },
  });

  // 2. Fetch all employees in this department + today's attendance for each
  // SECURITY: Restricted strictly to user.departmentId derived from auth()
  const departmentUsers = await prisma.user.findMany({
    where: {
      departmentId: user.departmentId,
    },
    include: {
      attendance: {
        where: {
          date: today,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  // 3. Compute dynamic department metrics
  const totalEmployees = departmentUsers.length;
  const presentCount = departmentUsers.filter(
    (emp) => emp.attendance[0]?.status === "PRESENT"
  ).length;
  const lateCount = departmentUsers.filter(
    (emp) => emp.attendance[0]?.status === "LATE"
  ).length;
  const notCheckedInCount = totalEmployees - (presentCount + lateCount);
  const attendanceRate =
    totalEmployees > 0
      ? Math.round(((presentCount + lateCount) / totalEmployees) * 100)
      : 0;

  const stats = {
    totalEmployees,
    presentCount,
    lateCount,
    notCheckedInCount,
    attendanceRate,
  };

  // 4. Format data for table component
  const formattedEmployees = departmentUsers.map((emp) => ({
    id: emp.id,
    employeeId: emp.employeeId,
    name: emp.name,
    email: emp.email,
    role: emp.role,
    todayAttendance: emp.attendance[0] || null,
  }));

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Manager Dashboard</h2>
        <p className="text-muted-foreground text-sm">
          Department: <span className="font-semibold text-foreground">{department?.name || "Unassigned"}</span> &bull; Welcome back, {user.name}
        </p>
      </div>

      {/* Department Metric Cards */}
      <ManagerStatsCards stats={stats} />

      {/* Department Employees & Attendance Table */}
      <DepartmentAttendanceTable departmentEmployees={formattedEmployees} />
    </div>
  );
}