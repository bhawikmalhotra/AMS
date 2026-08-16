import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ManagerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Manager Dashboard</h2>
        <p className="text-muted-foreground">
          Monitor your department's attendance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Employees</CardTitle>
          </CardHeader>
          <CardContent>6</CardContent>
        </Card>

        <Card>  
          <CardHeader>
            <CardTitle>Present</CardTitle>
          </CardHeader>
          <CardContent>5</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Late</CardTitle>
          </CardHeader>
          <CardContent>1</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance</CardTitle>
          </CardHeader>
          <CardContent>83%</CardContent>
        </Card>
      </div>
    </div>
  );
}