import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminStatsCards({ stats }) {
  const {
    totalUsers = 0,
    totalDepartments = 0,
    presentToday = 0,
    companyAttendanceRate = 0,
  } = stats || {};

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Organization Users */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          <span className="text-blue-500 font-bold text-xs">👥</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalUsers}</div>
          <p className="text-xs text-muted-foreground mt-1">Employees, Managers & Admins</p>
        </CardContent>
      </Card>

      {/* Total Departments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Departments</CardTitle>
          <span className="text-indigo-500 font-bold text-xs">🏢</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{totalDepartments}</div>
          <p className="text-xs text-muted-foreground mt-1">Active company departments</p>
        </CardContent>
      </Card>

      {/* Present Today (Company-wide) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Present Today</CardTitle>
          <span className="text-emerald-500 font-bold text-xs">✓</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{presentToday}</div>
          <p className="text-xs text-muted-foreground mt-1">Checked in across company</p>
        </CardContent>
      </Card>

      {/* Company Attendance Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Company Turnout</CardTitle>
          <span className="text-purple-500 font-bold text-xs">%</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{companyAttendanceRate}%</div>
          <p className="text-xs text-muted-foreground mt-1">Organization attendance rate</p>
        </CardContent>
      </Card>
    </div>
  );
}
