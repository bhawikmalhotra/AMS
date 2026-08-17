# Database Requirements — Employee Attendance Management System

**Version:** 1.2  
**Status:** Updated after ADMIN implementation  
**Database:** PostgreSQL 18  
**ORM:** Prisma 7

## 1. Objective

The database stores departments, users, roles, and attendance records for an employee attendance management system.

The design stays intentionally small while supporting realistic Prisma/PostgreSQL queries, authorization, filtering, aggregation, and dashboards.

## 2. Core Entities

```text
Department 1 ─────< User 1 ─────< Attendance
```

There are three core tables:

- Department
- User
- Attendance

There is no separate Employee, Manager, or Admin table. All are Users with different roles.

## 3. Department

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| name | VARCHAR(100) | NOT NULL, UNIQUE |
| createdAt | TIMESTAMP | NOT NULL |
| updatedAt | TIMESTAMP | NOT NULL |

A department can contain many users.

## 4. User

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| employeeId | VARCHAR(8) | NOT NULL, UNIQUE |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| password | VARCHAR(255) | NOT NULL, hash only |
| role | ENUM | EMPLOYEE / MANAGER / ADMIN |
| departmentId | UUID | NULLABLE FK → Department.id |
| isActive | BOOLEAN | NOT NULL, default true |
| createdAt | TIMESTAMP | NOT NULL |
| updatedAt | TIMESTAMP | NOT NULL |

### Employee ID

Two identifiers are used:

```text
id
→ UUID
→ internal primary key / relationship target

employeeId
→ EMP0001 / ADM0001
→ human/business identifier
```

`employeeId` is unique.

### Roles

```text
EMPLOYEE
MANAGER
ADMIN
```

### Department rule

- Employees must have a department.
- Managers must have a department.
- Admins are company-wide and have `departmentId = NULL`.

The application should enforce the role/department business rule.

## 5. Attendance

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| employeeId | UUID | NOT NULL, FK → User.id |
| date | DATE | NOT NULL |
| checkIn | TIMESTAMP | NOT NULL |
| checkOut | TIMESTAMP | NULLABLE |
| status | ENUM | PRESENT / LATE / ABSENT |
| createdAt | TIMESTAMP | NOT NULL |
| updatedAt | TIMESTAMP | NOT NULL |

Constraint:

```text
UNIQUE(employeeId, date)
```

An employee can have at most one attendance record per day.

## 6. Authorization Data Rules

### Employee
Can access only their own profile and attendance.

### Manager
Can access users and attendance where:

```text
User.departmentId = manager.departmentId
```

### Admin
Has company-wide access and can access all departments, users, and attendance.

Never trust a client-supplied role, user ID, or department ID for authorization. Derive authorization scope from the authenticated server-side session.

## 7. Admin User Management

Admin can eventually:

- View all users
- Search/filter users
- Change department
- Change role
- Activate/deactivate accounts
- View all attendance
- Filter attendance
- View organization-wide statistics

Prefer deactivation over deleting users so historical attendance remains intact.

## 8. Indexes

Recommended:

```text
Department: UNIQUE(name)
User: UNIQUE(email), UNIQUE(employeeId), INDEX(departmentId)
Attendance: UNIQUE(employeeId, date), INDEX(date), INDEX(employeeId)
```

Do not add indexes without a query/use-case reason.

## 9. Statistics

Do not store derived fields such as:

```text
presentDays
lateDays
attendancePercentage
```

Calculate them from Attendance using queries/aggregations.

## 10. Future Entities

Not part of V1:

```text
Leave
Holiday
Shift
Branch
AttendanceCorrection
Notification
AuditLog
```
