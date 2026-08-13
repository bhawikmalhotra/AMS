# Employee Attendance Management System
# Final Database Requirements Specification

**Document:** `DB-requirement.md`  
**Version:** 1.0  
**Status:** Final Database Requirements  
**Related Document:** `SRS.md`  
**Database:** PostgreSQL 18  
**ORM:** Prisma  
**ER Tool:** dbdiagram.io

---

# 1. Purpose

This document defines the final relational database requirements for the Employee Attendance Management System.

The design is intentionally **beginner-friendly but realistic enough for internship-level PostgreSQL and Prisma practice**.

The database must support:

- User authentication data
- Employee information
- Employee roles
- Departments
- Department-based manager access
- Daily attendance
- Check-in/check-out
- Attendance status
- Attendance history
- Attendance analytics
- Sample data for testing
- Prisma relations and queries
- PostgreSQL joins, filtering, grouping, aggregation, constraints, and indexes

The database should avoid unnecessary enterprise-level complexity.

---

# 2. Design Philosophy

The database follows these principles:

1. Keep the number of tables small.
2. Avoid duplicated data.
3. Use relational modeling instead of storing repeated information.
4. Use primary keys and foreign keys correctly.
5. Enforce important business rules with database constraints.
6. Calculate statistics from source data instead of storing duplicate calculated values.
7. Keep authorization-related relationships clear.
8. Make the schema easy to understand in Prisma.
9. Provide enough relationships for meaningful SQL/Prisma query practice.
10. Preserve historical attendance data.

---

# 3. Core Entities

The final database contains three core entities:

```text
Department
    |
    | 1
    | N
    v
User
    |
    | 1
    | N
    v
Attendance
```

Entities:

1. `Department`
2. `User`
3. `Attendance`

A separate `Manager` table is intentionally NOT required.

A manager is represented by:

```text
User.role = MANAGER
```

---

# 4. Entity: Department

## Purpose

Represents an organizational department.

Examples:

- IT
- HR
- Finance
- Marketing
- Sales

## Columns

| Column | Type | Required | Constraints |
|---|---|---:|---|
| id | UUID | Yes | Primary Key |
| name | VARCHAR(100) | Yes | UNIQUE, NOT NULL |
| createdAt | TIMESTAMP | Yes | NOT NULL, default current time |
| updatedAt | TIMESTAMP | Yes | NOT NULL, default current time |

## Rules

- Department ID is unique.
- Department name is unique.
- Department name cannot be NULL.
- One department can have many users.
- A department may temporarily have zero users.

---

# 5. Entity: User

## Purpose

Represents every application user and employee.

Managers and normal employees are stored in the same table.

## Columns

| Column | Type | Required | Constraints |
|---|---|---:|---|
| id | UUID | Yes | Primary Key |
| name | VARCHAR(100) | Yes | NOT NULL |
| email | VARCHAR(255) | Yes | UNIQUE, NOT NULL |
| password | VARCHAR(255) | Yes | NOT NULL |
| role | ENUM | Yes | EMPLOYEE / MANAGER |
| departmentId | UUID | Yes | FK → Department.id |
| isActive | BOOLEAN | Yes | Default true |
| createdAt | TIMESTAMP | Yes | Default current time |
| updatedAt | TIMESTAMP | Yes | Default current time |

---

# 6. User Constraints

## 6.1 Email

Email must be:

- Required.
- Unique.
- Used as the login identifier.
- Stored consistently, preferably lowercase.

The application should validate email format.

---

## 6.2 Password

The database stores a password hash only.

Plain-text passwords must never be stored.

The authentication system is responsible for hashing and verifying passwords.

---

## 6.3 Role

Allowed values:

```text
EMPLOYEE
MANAGER
```

Role should be represented as a PostgreSQL/Prisma enum.

---

## 6.4 Department

Every user belongs to exactly one department.

```text
User.departmentId → Department.id
```

---

## 6.5 Account Status

`isActive` determines whether the user account is active.

An inactive user:

- Should not be allowed to log in.
- Retains their historical attendance.
- Remains associated with their department.

This is preferable to deleting historical employee data.

---

# 7. Entity: Attendance

## Purpose

Stores an employee's attendance for a specific date.

## Columns

| Column | Type | Required | Constraints |
|---|---|---:|---|
| id | UUID | Yes | Primary Key |
| employeeId | UUID | Yes | FK → User.id |
| date | DATE | Yes | NOT NULL |
| checkIn | TIMESTAMP | Yes | NOT NULL |
| checkOut | TIMESTAMP | No | NULL allowed |
| status | ENUM | Yes | PRESENT / LATE / ABSENT |
| createdAt | TIMESTAMP | Yes | Default current time |
| updatedAt | TIMESTAMP | Yes | Default current time |

---

# 8. Attendance Status

Allowed values:

```text
PRESENT
LATE
ABSENT
```

The employee does not freely choose the status.

The application determines it from the attendance workflow.

For example:

```text
Check in before configured threshold
        ↓
PRESENT

Check in after configured threshold
        ↓
LATE
```

Absence can be derived from missing attendance on a working day, or represented by an explicit attendance record if the application later requires that behavior.

---

# 9. Critical Attendance Constraint

An employee can have **only one attendance record per date**.

Required database constraint:

```text
UNIQUE(employeeId, date)
```

This prevents:

```text
Employee A | 2026-08-13
Employee A | 2026-08-13
```

from existing twice.

This constraint is important because application-level checks alone are not sufficient to guarantee uniqueness under concurrent requests.

---

# 10. Check-In Rules

When an employee checks in:

1. Identify the employee from the authenticated session.
2. Determine today's date.
3. Check whether today's attendance already exists.
4. Reject the operation if it exists.
5. Create the attendance record.
6. Store the current timestamp.
7. Determine the status.

The employee must not manually provide another employee's ID.

---

# 11. Check-Out Rules

When an employee checks out:

1. Identify the authenticated employee.
2. Find today's attendance record.
3. Reject if no attendance record exists.
4. Reject if `checkOut` is already populated.
5. Store the current timestamp.

`checkOut` is nullable because an employee may have checked in but not checked out yet.

---

# 12. Important Data Integrity Rule

The database should prevent invalid relationships.

Required foreign keys:

```text
User.departmentId
        ↓
Department.id
```

```text
Attendance.employeeId
        ↓
User.id
```

Therefore:

- A user cannot reference a non-existent department.
- Attendance cannot reference a non-existent user.

---

# 13. Manager Department Access

There is no direct `managerId` field on Attendance and no separate Manager table.

Manager access is derived from department membership.

Example:

```text
Manager
   |
   | departmentId = 1
   v
IT Department
   |
   +── Employee A
   +── Employee B
   +── Employee C
```

A manager can access employees where:

```text
employee.departmentId = manager.departmentId
```

And attendance where:

```text
attendance.employeeId
    belongs to
employee.departmentId = manager.departmentId
```

This provides an excellent opportunity to practice:

- Prisma nested relations
- Prisma `where`
- PostgreSQL JOIN
- WHERE
- GROUP BY
- COUNT
- AVG
- date filtering

---

# 14. Relationships

## Department → User

**One-to-Many**

```text
Department 1 ────────< User
```

One department can contain many users.

Each user belongs to exactly one department.

---

## User → Attendance

**One-to-Many**

```text
User 1 ────────< Attendance
```

One user can have many attendance records.

Each attendance record belongs to exactly one user.

---

# 15. Primary Key Strategy

Use generated UUIDs for all main entities:

```text
Department.id
User.id
Attendance.id
```

Reasons:

- Avoid predictable sequential identifiers.
- Good practice for real applications.
- Works cleanly with Prisma.
- Does not expose business meaning through IDs.

---

# 16. Foreign Key Strategy

Required relationships:

```text
Department.id
      ↑
      |
User.departmentId
```

```text
User.id
   ↑
   |
Attendance.employeeId
```

Foreign keys must enforce referential integrity.

---

# 17. Delete Strategy

Historical attendance is important.

Recommended behavior:

### User

Prefer deactivation:

```text
isActive = false
```

instead of deleting the user.

Historical attendance remains available.

### Department

A department should not be deleted while active users belong to it.

The application should either:

- prevent deletion, or
- require users to be moved first.

For learning purposes, hard-delete operations can be omitted from the initial UI.

---

# 18. Timestamp Strategy

All main entities contain:

```text
createdAt
updatedAt
```

Attendance additionally contains:

```text
date
checkIn
checkOut
```

Example:

```text
date:     2026-08-13
checkIn:  2026-08-13 09:42:15
checkOut: 2026-08-13 18:07:31
```

`date` represents the business attendance date.

`checkIn` and `checkOut` represent exact timestamps.

---

# 19. Database Constraints

## Department

```text
PRIMARY KEY(id)
NOT NULL(name)
UNIQUE(name)
NOT NULL(createdAt)
NOT NULL(updatedAt)
```

## User

```text
PRIMARY KEY(id)
NOT NULL(name)
NOT NULL(email)
UNIQUE(email)
NOT NULL(password)
NOT NULL(role)
NOT NULL(departmentId)
NOT NULL(isActive)
NOT NULL(createdAt)
NOT NULL(updatedAt)
```

## Attendance

```text
PRIMARY KEY(id)
NOT NULL(employeeId)
NOT NULL(date)
NOT NULL(checkIn)
NULLABLE(checkOut)
NOT NULL(status)
NOT NULL(createdAt)
NOT NULL(updatedAt)

UNIQUE(employeeId, date)
```

---

# 20. Additional PostgreSQL Integrity Checks

Where practical, PostgreSQL should also protect obvious invalid states.

Recommended checks:

### Check-out cannot be earlier than check-in

Conceptually:

```text
checkOut IS NULL OR checkOut >= checkIn
```

### Name should not be empty

Application validation should reject blank names.

### Email should not be empty

Application validation should reject blank emails.

Not every validation needs to be duplicated as a database CHECK constraint. Keep database constraints focused on data integrity.

---

# 21. Index Strategy

Do not add indexes to every column.

Use indexes based on actual query patterns.

## Department

```text
PRIMARY KEY(id)
UNIQUE(name)
```

## User

```text
UNIQUE(email)
INDEX(departmentId)
```

The department index supports manager queries such as:

```text
Find all employees in my department.
```

## Attendance

```text
UNIQUE(employeeId, date)
INDEX(date)
```

The composite unique index supports:

```text
Find today's attendance for an employee.
```

The date index supports:

```text
Find attendance for a specific date.
```

---

# 22. Why We Do Not Store Statistics

Do NOT create columns such as:

```text
User.presentDays
User.lateDays
User.absentDays
User.attendancePercentage
```

These values are derived from Attendance.

Example:

```text
Attendance records
       ↓
COUNT / GROUP BY
       ↓
Statistics
```

This prevents stale or inconsistent data.

It also gives useful PostgreSQL and Prisma query practice.

---

# 23. Analytics Requirements

The database must support calculation of:

## Employee statistics

- Present count
- Late count
- Absent count
- Total attendance records
- Attendance percentage

## Department statistics

- Total employees
- Present employees
- Late employees
- Absent employees
- Department attendance percentage

## Time-based analytics

- Daily attendance
- Weekly attendance
- Monthly attendance
- Attendance trends

These should be calculated dynamically.

---

# 24. PostgreSQL Query Practice

The project should intentionally provide opportunities to learn PostgreSQL through Prisma.

Required query concepts to practice:

### Basic

- SELECT
- WHERE
- ORDER BY
- LIMIT
- DISTINCT

### Relations

- INNER JOIN
- LEFT JOIN

### Aggregation

- COUNT
- AVG
- GROUP BY
- HAVING

### Filtering

- Date filtering
- Range filtering
- Multiple conditions

### More advanced practice

- CASE
- COALESCE
- Subqueries
- CTEs
- Window functions

Not every advanced query is required for application functionality. Some can be created as separate learning exercises using the same project database.

---

# 25. Prisma Query Practice

The same database should be used to learn Prisma concepts such as:

- `findUnique`
- `findFirst`
- `findMany`
- `create`
- `update`
- `delete`
- `where`
- `select`
- `include`
- Nested relation queries
- Aggregation
- `_count`
- `_avg`
- Transactions where appropriate

The goal is to understand how Prisma maps application operations to relational database concepts.

---

# 26. Example Manager Query Concept

Manager:

```text
manager.departmentId = IT
```

Query concept:

```text
Get users
WHERE departmentId = manager.departmentId
```

Then:

```text
Get attendance
WHERE employee belongs to manager's department
```

The same requirement can later be understood in SQL as a JOIN:

```text
Attendance
    JOIN User
    JOIN Department
```

This is intentionally part of the learning plan.

---

# 27. Sample Data Requirements

The project should include a development seed script.

Recommended dataset:

### Departments

```text
IT
HR
Finance
Marketing
```

### Users

Approximately:

```text
4 managers
20-30 employees
```

Each department should have:

```text
1 manager
5-8 employees
```

This creates enough relational data to test authorization and analytics.

---

# 28. Sample Attendance Requirements

Generate attendance across approximately:

```text
20-30 working days
```

for the sample employees.

The dataset should contain:

- Normal attendance
- Late attendance
- Employees with no attendance on selected dates
- Employees who have not checked out
- Different attendance patterns between departments

This should provide enough records for meaningful dashboard charts.

---

# 29. Seed Data Must Test Authorization

Example:

```text
IT Manager
   ↓
IT Employees
   ↓
IT Attendance

HR Manager
   ↓
HR Employees
   ↓
HR Attendance
```

The application should prove that:

```text
IT Manager ≠ HR Attendance Access
```

while:

```text
IT Manager = IT Attendance Access
```

---

# 30. Edge Cases

The database/application must handle:

### Edge Case 1

Employee checks in twice.

Expected:

```text
Rejected
```

### Edge Case 2

Employee checks out without checking in.

Expected:

```text
Rejected
```

### Edge Case 3

Employee checks out twice.

Expected:

```text
Rejected
```

### Edge Case 4

Employee has checked in but not checked out.

Expected:

```text
checkOut = NULL
```

### Edge Case 5

Inactive employee attempts login.

Expected:

```text
Rejected
```

### Edge Case 6

Manager requests another department's employee.

Expected:

```text
Unauthorized / no access
```

### Edge Case 7

Duplicate attendance is attempted concurrently.

Expected:

```text
Database unique constraint prevents duplicate record.
```

---

# 31. Normalization

The database should avoid duplicated attributes.

Do NOT store:

```text
Attendance.employeeName
Attendance.departmentName
```

Instead:

```text
Attendance
   ↓ employeeId
User
   ↓ departmentId
Department
```

This allows the database to maintain a single source of truth.

---

# 32. Tables We Intentionally Do Not Create

Do not create separate tables for:

- Manager
- Employee
- Role
- AttendanceStatus
- Dashboard
- AttendanceStatistics
- AttendanceChart
- PresentDays
- LateDays
- AbsentDays

Reason:

These are either represented by:

- one `User` table,
- enums,
- relationships,
- or dynamically calculated data.

---

# 33. Future Extension Points

The schema should remain extendable for future features such as:

```text
Leave
Holiday
Shift
Branch
AttendanceCorrection
AuditLog
Notification
```

These are not part of the current database.

They should only be introduced when an actual requirement requires them.

---

# 34. Final ER Structure

```text
┌─────────────────────────┐
│       Department        │
├─────────────────────────┤
│ id PK                   │
│ name UNIQUE             │
│ createdAt               │
│ updatedAt               │
└────────────┬────────────┘
             │
             │ 1
             │
             │ N
┌────────────▼────────────┐
│          User           │
├─────────────────────────┤
│ id PK                   │
│ name                    │
│ email UNIQUE            │
│ password                │
│ role                    │
│ departmentId FK         │
│ isActive                │
│ createdAt               │
│ updatedAt               │
└────────────┬────────────┘
             │
             │ 1
             │
             │ N
┌────────────▼────────────┐
│       Attendance        │
├─────────────────────────┤
│ id PK                   │
│ employeeId FK           │
│ date                    │
│ checkIn                 │
│ checkOut                │
│ status                  │
│ createdAt               │
│ updatedAt               │
└─────────────────────────┘

UNIQUE(employeeId, date)
```

---

# 35. Final Design Checklist

Before converting this design to Prisma:

- [ ] Department has a primary key.
- [ ] User has a primary key.
- [ ] Attendance has a primary key.
- [ ] Department → User is one-to-many.
- [ ] User → Attendance is one-to-many.
- [ ] User role is an enum.
- [ ] Attendance status is an enum.
- [ ] User email is unique.
- [ ] User belongs to one department.
- [ ] Attendance belongs to one user.
- [ ] `(employeeId, date)` is unique.
- [ ] Check-out is nullable.
- [ ] Foreign keys enforce relationships.
- [ ] Manager access is derived through department.
- [ ] Statistics are calculated instead of stored.
- [ ] Historical attendance is preserved.
- [ ] Indexes support expected queries.
- [ ] Sample data supports visualization.
- [ ] Sample data supports authorization testing.
- [ ] Schema is simple enough to understand.
- [ ] Schema provides useful PostgreSQL/Prisma practice.

---

# 36. Implementation Flow

```text
SRS.md
   ↓
DB-requirement.md
   ↓
ER Design
   ↓
dbdiagram.io
   ↓
Review Relationships
   ↓
Prisma Schema
   ↓
PostgreSQL Migration
   ↓
Seed Sample Data
   ↓
Test Constraints
   ↓
Build Prisma Queries
   ↓
Build Authentication
   ↓
Build Authorization
   ↓
Build Dashboards
   ↓
Build Analytics
```

The ER diagram must be reviewed before creating the Prisma schema.
