"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  updateUserRoleAction,
  updateUserDepartmentAction,
  toggleUserStatusAction,
} from "../admin/adminActions";

export default function UserManagementTable({ users = [], departments = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  const handleRoleChange = (userId, newRole) => {
    setErrorMsg("");
    startTransition(async () => {
      const res = await updateUserRoleAction(userId, newRole);
      if (!res.success) setErrorMsg(res.error);
    });
  };

  const handleDepartmentChange = (userId, newDeptId) => {
    setErrorMsg("");
    startTransition(async () => {
      const res = await updateUserDepartmentAction(userId, newDeptId);
      if (!res.success) setErrorMsg(res.error);
    });
  };

  const handleToggleStatus = (userId, currentStatus) => {
    setErrorMsg("");
    startTransition(async () => {
      const res = await toggleUserStatusAction(userId, !currentStatus);
      if (!res.success) setErrorMsg(res.error);
    });
  };

  // Filter users based on search, role, and department
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesDept =
      deptFilter === "ALL" ||
      (deptFilter === "UNASSIGNED" ? !u.departmentId : u.departmentId === deptFilter);

    return matchesSearch && matchesRole && matchesDept;
  });

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-xl">User Directory & Management</CardTitle>
            <CardDescription>
              Managing {filteredUsers.length} of {users.length} registered accounts
            </CardDescription>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-48 text-sm"
            />

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="ALL">All Roles</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="ALL">All Depts</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
              <option value="UNASSIGNED">Unassigned / Admin</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {errorMsg && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
            {errorMsg}
          </div>
        )}

        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No users match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4 rounded-l-md">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 rounded-r-md text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    {/* User Name & Employee ID */}
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-foreground">{u.name}</p>
                        <p className="text-xs font-mono text-muted-foreground">{u.employeeId}</p>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4 text-muted-foreground">{u.email}</td>

                    {/* Role Dropdown */}
                    <td className="py-3 px-4">
                      <select
                        disabled={isPending}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="h-8 rounded border border-input bg-background px-2 py-0 text-xs font-medium focus-visible:outline-none"
                      >
                        <option value="EMPLOYEE">EMPLOYEE</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>

                    {/* Department Dropdown */}
                    <td className="py-3 px-4">
                      {u.role === "ADMIN" ? (
                        <span className="text-xs italic text-muted-foreground">None (Company-wide)</span>
                      ) : (
                        <select
                          disabled={isPending}
                          value={u.departmentId || ""}
                          onChange={(e) => handleDepartmentChange(u.id, e.target.value)}
                          className="h-8 rounded border border-input bg-background px-2 py-0 text-xs font-medium focus-visible:outline-none"
                        >
                          <option value="">Unassigned</option>
                          {departments.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                          u.isActive
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400"
                        }`}
                      >
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Activate/Deactivate Action Button */}
                    <td className="py-3 px-4 text-right">
                      <Button
                        disabled={isPending}
                        variant={u.isActive ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleToggleStatus(u.id, u.isActive)}
                        className={`h-7 text-xs ${
                          u.isActive
                            ? "border-rose-300 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                      >
                        {u.isActive ? "Deactivate" : "Activate"}
                      </Button>
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
