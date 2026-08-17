import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ManagerStatsCards({ stats }) {
  const {
    totalEmployees = 0,
    presentCount = 0,
    lateCount = 0,
    notCheckedInCount = 0,
    attendanceRate = 0,
  } = stats || {};

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Employees */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Department Team</CardTitle>
          <span className="text-blue-500 font-bold text-xs">👥</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalEmployees}</div>
          <p className="text-xs text-muted-foreground mt-1">Total department members</p>
        </CardContent>
      </Card>

      {/* Present Today */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Present Today</CardTitle>
          <span className="text-emerald-500 font-bold text-xs">✓</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{presentCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Checked in on time</p>
        </CardContent>
      </Card>

      {/* Late Today */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Late Today</CardTitle>
          <span className="text-amber-500 font-bold text-xs">!</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{lateCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Checked in after 9:00 AM</p>
        </CardContent>
      </Card>

      {/* Department Attendance Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Today's Turnout</CardTitle>
          <span className="text-purple-500 font-bold text-xs">%</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{attendanceRate}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            {notCheckedInCount} members pending
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
