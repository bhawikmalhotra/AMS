# Antigravity Context — Employee Attendance Management System

## HOW TO WORK

This is a **learning project**.

Do NOT generate the entire app in one prompt.

Work:
```text
Explain → Implement small part → Test → Explain → Continue
```

Rules:
- Work ONE feature at a time.
- Explain important code before writing it.
- Do not make unrelated changes.
- Do not replace working code unnecessarily.
- Use production-grade practices but keep code beginner-friendly.
- Use shadcn/ui.
- Preserve existing Prisma/Auth.js architecture.
- Ask before any new database/schema change.
- Let me test each feature before moving on.

## STACK

- Next.js 16.3
- React
- JavaScript
- Tailwind CSS
- shadcn/ui
- Prisma 7
- PostgreSQL 18
- Auth.js / NextAuth v5 beta
- bcryptjs
- React Hook Form
- Zod

## DATABASE — COMPLETE

```text
Department 1 ─────< User 1 ─────< Attendance
```

User roles:

```text
EMPLOYEE
MANAGER
ADMIN
```

Important User fields:
```text
id: UUID
employeeId: unique human-friendly ID
name
email
password: hashed
role
departmentId: nullable
isActive
```

Department rule:
```text
EMPLOYEE → department required
MANAGER  → department required
ADMIN    → departmentId = NULL
```

Attendance:
```text
employeeId
date
checkIn
checkOut
status
```

Unique:
```text
(employeeId, date)
```

Database is seeded and working.

## AUTH — COMPLETE

Auth.js Credentials authentication is working.

Session contains:
```text
id
employeeId
name
email
role
departmentId
```

Auth route:
```text
src/app/api/auth/[...nextauth]/route.js
```

Login uses:
```text
React Hook Form
Server Action
Auth.js
bcrypt
```

Wrong credentials show:
```text
Invalid email or password
```

## PROXY / RBAC — COMPLETE

Next.js 16 uses:
```text
src/proxy.js
```

Current role mapping:
```text
EMPLOYEE → /dashboard/employee
MANAGER  → /dashboard/manager
ADMIN    → /dashboard/admin
```

RBAC is already implemented simply.

Do not rebuild authentication/RBAC unless a feature requires a change.

## DASHBOARD — CURRENT

```text
src/app/dashboard/
├── components/
│   └── DashboardNavbar.jsx
├── layout.js
├── page.js
├── employee/
│   └── page.js
├── manager/
│   └── page.js
└── admin/
    └── page.js
```

Shared `dashboard/layout.js` contains the dashboard shell/navbar.

Navbar is a Server Component:
- gets session with `auth()`
- shows name
- shows employeeId
- shows role
- gets department name from Prisma when departmentId exists
- logout button

Admin has no department and should not show a fake department.

A simple ADMIN page and RBAC are already built.

## ADMIN REQUIREMENT

ADMIN is company-wide.

Admin can:
- View all users
- Search/filter users
- Change employee department
- Change employee role
- Activate/deactivate users
- View all departments
- View all attendance
- Filter attendance
- View organization statistics

Admin is not attached to a department.

Admin seed user exists.

Do not make further schema changes unless a real feature requires one.

## AUTHORIZATION PRINCIPLE

```text
Auth.js
 ↓
Session
 ↓
Proxy: route protection
 ↓
Server-side auth()
 ↓
Prisma: data authorization
```

Never trust client-provided role, user ID, or department ID.

Manager queries must derive department scope from the authenticated session.

Admin queries can access company-wide data.

## UI

Use shadcn/ui.

Keep UI professional but understandable.

Useful components:
```text
Button
Card
Input
Label
Badge
Table
Dialog
Select
Dropdown Menu
Sidebar
Tabs
Calendar
Alert
Sheet
```

Do not add unnecessary abstractions.

## REMAINING WORK

```text
Employee dashboard UI
Employee attendance actions
Employee attendance history
Manager employee list
Manager attendance
Manager statistics
Admin dashboard improvements
Admin user management
Admin department/role changes
Admin attendance
Charts
Loading/error/empty states
Responsive polish
Security/authorization testing
Final testing
Deployment
```

## DEVELOPMENT ORDER

Do one feature at a time:

```text
1. Employee dashboard UI
2. Employee attendance actions
3. Employee attendance history
4. Manager employee list
5. Manager attendance
6. Manager statistics
7. Admin dashboard
8. Admin user management
9. Admin department/role changes
10. Admin attendance
11. Charts
12. Loading/error/empty states
13. Authorization/security testing
14. Final UI polish
15. Deployment
```

## IMPORTANT

The developer wants to **learn while building**.

Do not hide logic behind giant generated abstractions.

Explain:
- what the code does
- why it is needed
- why it belongs in that file
- what security rule it enforces

Then implement only that part and stop for testing.
