# Employee Attendance Management System — SRS

**Version:** 1.3  
**Status:** Updated after ADMIN, RBAC, and sample dashboard implementation  
**Project Type:** Internship Learning Project

## 1. Purpose

A web application for employee attendance management.

Employees manage their own attendance. Managers monitor employees in their own department. Admins have company-wide access and can manage users, roles, departments, and attendance.

The project is intentionally beginner-friendly while following realistic production-style authentication, authorization, relational database, Prisma, PostgreSQL, and dashboard practices.

## 2. Roles

### Employee

- Login/logout
- View own profile and employee ID
- Check in/out
- View own attendance history and statistics
- Cannot access another employee's attendance

### Manager

- All normal employee actions
- View employees in their own department
- View/filter department attendance
- View individual employee attendance within the department
- View department statistics and visualizations
- Cannot access another department
- Must belong to a department

### Admin

- Company-wide access
- View all departments
- View all employees/users
- View all attendance
- Search/filter users and attendance
- Change employee department
- Change employee role
- Activate/deactivate users
- View organization-wide statistics
- Does not belong to a department

## 3. Authentication

- Registered users can log in and log out.
- Protected dashboards require authentication.
- Role is available to authorization logic.
- Passwords are never stored in plain text.
- Inactive users cannot authenticate.
- Invalid credentials should return a generic authentication error.

## 4. RBAC

Supported roles:

```text
EMPLOYEE
MANAGER
ADMIN
```

Authorization must be enforced server-side/data-access-side, not only by hiding UI elements.

Architecture:

```text
Auth.js
  ↓
Session
  ↓
Proxy
  ↓
Route protection
  ↓
Server-side authorization
  ↓
Prisma
```

## 5. Employee Identity

The system stores:

- UUID primary key
- Human-friendly unique employee ID such as EMP0001
- Name
- Email
- Role
- Department where applicable
- Account status

Admin may use an identifier such as ADM0001.

UUID remains the internal primary key.

## 6. Departments

- Multiple departments are supported.
- Employees belong to a department.
- Managers belong to a department.
- Admins are company-wide and do not belong to a department.
- One department can contain many users.
- Managers can access only their own department.
- Admins can access all departments.

## 7. Attendance

- An authenticated employee can check in once per day.
- Check-out requires check-in.
- An employee cannot check out twice.
- Timestamps are generated server-side.
- Duplicate employee/date attendance is prevented.
- Initial statuses are PRESENT, LATE, ABSENT.

## 8. Dashboards

### Employee Dashboard

- Profile
- Employee ID
- Today's attendance
- Check-in
- Check-out
- Attendance history
- Personal statistics

### Manager Dashboard

- Department information
- Employee list
- Today's department attendance
- Attendance filters
- Individual employee attendance
- Employee count
- Present/late/absent statistics
- Attendance percentage
- Basic charts

### Admin Dashboard

- Organization overview
- Department list
- All employees/users
- Search/filter
- User details
- Change department
- Change role
- Activate/deactivate users
- All attendance
- Attendance filters
- Organization-wide statistics
- Basic visualizations

## 9. UI Requirements

Use:

- Next.js 16
- React
- JavaScript
- Tailwind CSS
- shadcn/ui

Prefer simple reusable components.

Dashboard-specific components belong under:

```text
src/app/dashboard/components/
```

Global components belong under:

```text
src/components/
```

Normal nested routes and shared layouts are preferred. Parallel routes should only be introduced when a real UI requirement needs independent slots.

## 10. Security

- Protected pages require authentication.
- Server-side authorization is mandatory.
- Client-side role checks are not sufficient.
- Never trust client-provided role/user/department IDs for authorization.
- Passwords are hashed.
- Inactive users cannot authenticate.
- Managers are restricted to their department.
- Admins have company-wide access.

## 11. Acceptance Criteria

- Employee login/logout works.
- Manager login/logout works.
- Admin login/logout works.
- Correct dashboard is selected by role.
- Employees access only their own attendance.
- Managers access only their department.
- Admins access all departments/users/attendance.
- Employees can check in/out.
- Duplicate daily attendance is prevented.
- Attendance history works.
- Manager statistics work.
- Admin user management works.
- Server-side authorization works.
- Database constraints support business rules.

## 12. Learning Principle

This is a learning project.

Prioritize:

1. Understanding over speed.
2. Simple readable code over unnecessary abstraction.
3. Correct database design.
4. Understanding authentication/authorization.
5. Explaining important architectural decisions.
6. Building one feature at a time.
