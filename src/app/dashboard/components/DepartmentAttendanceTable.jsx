"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function DepartmentAttendanceTable({ departmentEmployees = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const formatTime = (isoString) => {
    if (!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Filter employees based on search input and status dropdown
  const filteredEmployees = departmentEmployees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

    const empStatus = emp.todayAttendance?.status || "NOT_CHECKED_IN";

    if (statusFilter === "ALL") return matchesSearch;
    if (statusFilter === "PRESENT") return matchesSearch && empStatus === "PRESENT";
    if (statusFilter === "LATE") return matchesSearch && empStatus === "LATE";
    if (statusFilter === "NOT_CHECKED_IN") return matchesSearch && empStatus === "NOT_CHECKED_IN";

    return matchesSearch;
  });

  const getStatusBadge = (status, checkOut) => {
    if (!status) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          Not Checked In
        </span>
      );
    }

    if (checkOut) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
          Completed
        </span>
      );
    }

    if (status === "PRESENT") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          Present
        </span>
      );
    }

    if (status === "LATE") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
          Late
        </span>
      );
    }

    return null;
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl">Department Attendance</CardTitle>
            <CardDescription>
              Showing {filteredEmployees.length} of {departmentEmployees.length} team members
            </CardDescription>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              placeholder="Search by name, email, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 text-sm"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="ALL">All Statuses</option>
              <option value="PRESENT">Present</option>
              <option value="LATE">Late</option>
              <option value="NOT_CHECKED_IN">Not Checked In</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No department employees match your search or filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4 rounded-l-md">Employee</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Check In</th>
                  <th className="py-3 px-4">Check Out</th>
                  <th className="py-3 px-4 rounded-r-md">Today's Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-foreground">{emp.name}</p>
                        <p className="text-xs font-mono text-muted-foreground">{emp.employeeId}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">{emp.role}</td>
                    <td className="py-3 px-4 text-muted-foreground">{emp.email}</td>
                    <td className="py-3 px-4 font-medium">
                      {formatTime(emp.todayAttendance?.checkIn)}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {formatTime(emp.todayAttendance?.checkOut)}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(
                        emp.todayAttendance?.status,
                        emp.todayAttendance?.checkOut
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
