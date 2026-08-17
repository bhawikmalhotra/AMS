import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EmployeeStatsCards({ stats }) {
  const { presentCount = 0, lateCount = 0, totalDays = 0, percentage = 0 } = stats || {};

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Present Days Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Present Days</CardTitle>
          <span className="text-emerald-500 font-bold text-xs">✓</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{presentCount}</div>
          <p className="text-xs text-muted-foreground mt-1">On-time check ins</p>
        </CardContent>
      </Card>

      {/* Late Days Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Late Days</CardTitle>
          <span className="text-amber-500 font-bold text-xs">!</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{lateCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Checked in after 9:00 AM</p>
        </CardContent>
      </Card>

      {/* Total Recorded Days Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Days</CardTitle>
          <span className="text-blue-500 font-bold text-xs">📅</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalDays}</div>
          <p className="text-xs text-muted-foreground mt-1">Total attendance logs</p>
        </CardContent>
      </Card>

      {/* Attendance Rate Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Attendance Rate</CardTitle>
          <span className="text-purple-500 font-bold text-xs">%</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{percentage}%</div>
          <p className="text-xs text-muted-foreground mt-1">Overall punctuality rate</p>
        </CardContent>
      </Card>
    </div>
  );
}
