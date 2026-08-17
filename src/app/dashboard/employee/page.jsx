import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import TodayStatusCard from "../components/TodayStatusCard";
import EmployeeStatsCards from "../components/EmployeeStatsCards";
import AttendanceHistoryTable from "../components/AttendanceHistoryTable";

export const metadata = {
  title: "Employee Dashboard",
  description: "View and record your daily attendance at VYNS Global.",
};

function getTodayDate() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

export default async function EmployeeDashboard() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="p-6 text-center text-destructive">
        Unauthorized access. Please log in.
      </div>
    );
  }

  const today = getTodayDate();

  // Fetch today's attendance record
  const todayRecord = await prisma.attendance.findUnique({
    where: {
      employeeId_date: {
        employeeId: userId,
        date: today,
      },
    },
  });

  // Fetch user's entire attendance history ordered by date (newest first)
  const attendanceHistory = await prisma.attendance.findMany({
    where: {
      employeeId: userId,
    },
    orderBy: {
      date: "desc",
    },
  });

  // Calculate dynamic stats
  const presentCount = attendanceHistory.filter((r) => r.status === "PRESENT").length;
  const lateCount = attendanceHistory.filter((r) => r.status === "LATE").length;
  const totalDays = attendanceHistory.length;
  const percentage = totalDays > 0 ? Math.round(((presentCount + lateCount) / totalDays) * 100) : 0;

  const stats = {
    presentCount,
    lateCount,
    totalDays,
    percentage,
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Employee Dashboard</h2>
        <p className="text-muted-foreground text-sm">
          Welcome back, <span className="font-semibold text-foreground">{session.user.name}</span>! Track and manage your daily attendance.
        </p>
      </div>

      {/* Top Grid: Today's Check-in Card & Stats Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <TodayStatusCard todayRecord={todayRecord} />
        </div>
        <div className="lg:col-span-2">
          <EmployeeStatsCards stats={stats} />
        </div>
      </div>

      {/* Attendance History Section */}
      <div>
        <AttendanceHistoryTable history={attendanceHistory} />
      </div>
    </div>
  );
}