# Project Context & Architecture Guide — Employee Attendance Management System

> **Purpose**: This document explains what we built, how the UI is structured, and where Server Actions live in simple language for learning purposes.

---

## 🛠️ Stack & Architecture

- **Framework**: Next.js 16 (App Router) + React
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database & ORM**: PostgreSQL + Prisma 7
- **Authentication**: Auth.js (NextAuth v5 beta) with bcrypt password hashing
- **Security & Authorization**: Next.js `src/proxy.js` route middleware + Server-side `auth()` checks in Server Components & Server Actions

---

## 👥 User Roles & Data Rules

1. **EMPLOYEE**:
   - Access: `/dashboard/employee`
   - Data Scope: Can view only their own attendance history and check in/out for today.
   - Database Rule: Must belong to a `Department`.

2. **MANAGER**:
   - Access: `/dashboard/manager`
   - Data Scope: Can view employees and attendance **only within their own assigned department**.
   - Database Rule: Must belong to a `Department`.

3. **ADMIN**:
   - Access: `/dashboard/admin`
   - Data Scope: Company-wide access across all departments and all users.
   - Database Rule: Does not belong to a department (`departmentId = null`). Can assign roles, transfer departments, and activate/deactivate accounts.

---

## 🎨 UI Components Breakdown (`src/app/dashboard/components/`)

### 1. `DashboardNavbar.jsx`
- **Location**: `src/app/dashboard/components/DashboardNavbar.jsx`
- **Type**: Server Component (fetches `auth()` session)
- **What it does**:
  - Sticky top header for the entire dashboard.
  - Displays user's name, email, employee ID (`EMP0001`), and role badge (`EMPLOYEE`, `MANAGER • Engineering`, `ADMIN`).
  - Contains the **Logout** button.

### 2. `TodayStatusCard.jsx`
- **Location**: `src/app/dashboard/components/TodayStatusCard.jsx`
- **Type**: Client Component (`"use client"`)
- **What it does**:
  - Card on Employee Dashboard showing today's attendance status (`Not Checked In`, `Checked In`, `Checked In (Late)`, `Completed for Today`).
  - Displays Check-In & Check-Out timestamps.
  - Contains **Check In Now** and **Check Out Now** buttons.
  - Uses React `useTransition` to handle button loading states smoothly.

### 3. `EmployeeStatsCards.jsx`
- **Location**: `src/app/dashboard/components/EmployeeStatsCards.jsx`
- **Type**: Server Component
- **What it does**:
  - Displays 4 metric cards for the logged-in employee: **Present Days**, **Late Days**, **Total Days**, and **Attendance Rate (%)**.

### 4. `AttendanceHistoryTable.jsx`
- **Location**: `src/app/dashboard/components/AttendanceHistoryTable.jsx`
- **Type**: Client Component (`"use client"`)
- **What it does**:
  - Displays the employee's personal attendance history table (Date, Check In, Check Out, Shift Duration, Status Badge).
  - Shows the **latest 5 records** by default with a **"Show More / Show Less"** toggle button.

### 5. `ManagerStatsCards.jsx`
- **Location**: `src/app/dashboard/components/ManagerStatsCards.jsx`
- **Type**: Server Component
- **What it does**:
  - Metric cards for the Manager Dashboard: **Department Team Count**, **Present Today**, **Late Today**, and **Turnout Rate (%)**.

### 6. `DepartmentAttendanceTable.jsx`
- **Location**: `src/app/dashboard/components/DepartmentAttendanceTable.jsx`
- **Type**: Client Component (`"use client"`)
- **What it does**:
  - Displays all employees belonging to the manager's department.
  - Includes a real-time **Search bar** (search by name, email, employee ID) and a **Status Filter dropdown** (`All`, `Present`, `Late`, `Not Checked In`).

### 7. `AdminStatsCards.jsx`
- **Location**: `src/app/dashboard/components/AdminStatsCards.jsx`
- **Type**: Server Component
- **What it does**:
  - Organization-wide metric cards: **Total System Users**, **Total Departments**, **Company Present Today**, and **Company Turnout Rate (%)**.

### 8. `UserManagementTable.jsx`
- **Location**: `src/app/dashboard/components/UserManagementTable.jsx`
- **Type**: Client Component (`"use client"`)
- **What it does**:
  - Complete user directory for Admins.
  - Search and filter by Role, Department, or Account Status.
  - Interactive dropdowns to **change user roles** or **reassign departments**.
  - **Activate / Deactivate** account action buttons.

---

## ⚡ Server Actions Breakdown

### 1. Employee Attendance Actions (`src/app/dashboard/employee/actions.js`)
- **`checkInAction()`**:
  - Checks if user is authenticated with `auth()`.
  - Normalizes today's date to UTC midnight matching `@db.Date`.
  - Checks for 9:00 AM cutoff (`PRESENT` vs `LATE`).
  - Creates an `Attendance` record in PostgreSQL via Prisma.
  - Revalidates path `/dashboard/employee`.
- **`checkOutAction()`**:
  - Checks if user is authenticated with `auth()`.
  - Updates `checkOut` timestamp on today's attendance record.
  - Revalidates path `/dashboard/employee`.

### 2. Admin Management Actions (`src/app/dashboard/admin/adminActions.js`)
- **`updateUserRoleAction(userId, newRole)`**:
  - Verifies Admin session.
  - Updates user role in database. If assigned `ADMIN`, automatically sets `departmentId = null`.
  - Revalidates path `/dashboard/admin`.
- **`updateUserDepartmentAction(userId, newDepartmentId)`**:
  - Verifies Admin session.
  - Reassigns user to a new department.
  - Revalidates path `/dashboard/admin`.
- **`toggleUserStatusAction(userId, newStatus)`**:
  - Verifies Admin session.
  - Toggles `isActive` boolean (enabling or disabling account login without deleting history).
  - Revalidates path `/dashboard/admin`.

---

## 📄 Pages & Routes Summary

- **`/login`**: Credentials login form.
- **`/dashboard`**: Auto-redirects to appropriate role path via [`src/proxy.js`](file:///d:/Shared/VYNS/attendance-management/src/proxy.js).
- **`/dashboard/employee`**: Employee Dashboard page.
- **`/dashboard/manager`**: Manager Dashboard page (scoped strictly to `user.departmentId`).
- **`/dashboard/admin`**: Admin Dashboard page (company-wide access).
