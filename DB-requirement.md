# Database Requirements — Employee Attendance Management System

**Version:** 1.1  
**Status:** Final / Updated  
**Database:** PostgreSQL 18  
**ORM:** Prisma 7

---

## 1. Database Objective

The database stores departments, users/employees, and employee attendance records.

The design should remain simple enough for a beginner project while supporting realistic relational queries, Prisma relations, filtering, aggregation, authorization, and dashboard visualization.

---

## 2. Entity Relationship

```text
Department 1 ─────< User 1 ─────< Attendance
```

### Relationships

- One Department has many Users.
- One User belongs to exactly one Department.
- One User can have many Attendance records.
- One Attendance record belongs to exactly one User.
- Managers are Users whose `role` is `MANAGER`; there is no separate Manager table.

---

## 3. Department

### Purpose

Stores the departments to which employees belong.

### Attributes

| Column | Type | Constraints | Purpose |
|---|---|---|---|
| id | UUID | PK, auto-generated | Internal identifier |
| name | VARCHAR | NOT NULL, UNIQUE | Department name |
| createdAt | TIMESTAMP | NOT NULL, default now | Creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL, auto-updated | Last modification timestamp |

### Rules

- Department names must be unique.
- A department can contain multiple users.
- A department should not be deleted casually if users depend on it.

---

## 4. User

### Purpose

Stores employee accounts and role/department information.

There is no separate Employee table.

### Attributes

| Column | Type | Constraints | Purpose |
|---|---|---|---|
| id | UUID | PK, auto-generated | Internal database identity |
| employeeId | VARCHAR(8) | NOT NULL, UNIQUE | Human-friendly employee identifier |
| name | VARCHAR | NOT NULL | Employee full name |
| email | VARCHAR | NOT NULL, UNIQUE | Login/contact identifier |
| password | VARCHAR | NOT NULL | Hashed password |
| role | ENUM | NOT NULL, default EMPLOYEE | Access level |
| departmentId | UUID | NOT NULL, FK | Employee's department |
| isActive | BOOLEAN | NOT NULL, default true | Account status |
| createdAt | TIMESTAMP | NOT NULL, default now | Creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL, auto-updated | Last modification timestamp |

### Employee ID

The system uses two identifiers:

```text
id
→ UUID
→ Internal database identity and foreign-key target

employeeId
→ EMP0001
→ Human/business identifier
```

Examples:

```text
EMP0001
EMP0002
EMP0003
...
```

`employeeId` must be unique.

It should not replace the UUID primary key.

---

## 5. User Roles

```text
EMPLOYEE
MANAGER
```

### EMPLOYEE

Can access:

- Own profile
- Own employee ID
- Own attendance
- Check-in/check-out

### MANAGER

Can access:

- Own profile/attendance
- Employees belonging to the manager's department
- Attendance belonging to those employees
- Department statistics and visualization data

A manager's department is determined by:

```text
User.departmentId
```

Therefore, department-based authorization can be implemented without adding a `managerId` column.

---

## 6. Attendance

### Purpose

Stores daily employee attendance.

### Attributes

| Column | Type | Constraints | Purpose |
|---|---|---|---|
| id | UUID | PK, auto-generated | Attendance identifier |
| employeeId | UUID | NOT NULL, FK | References User.id |
| date | DATE | NOT NULL | Attendance calendar date |
| checkIn | TIMESTAMP | NOT NULL | Check-in time |
| checkOut | TIMESTAMP | NULL | Check-out time |
| status | ENUM | NOT NULL | Attendance status |
| createdAt | TIMESTAMP | NOT NULL, default now | Creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL, auto-updated | Last modification timestamp |

### Attendance Status

```text
PRESENT
LATE
ABSENT
```

### Important Constraint

```text
(employeeId, date) UNIQUE
```

This prevents an employee from having two attendance records for the same day.

Example:

```text
EMP0001 + 2026-08-15 → allowed
EMP0001 + 2026-08-15 → duplicate, rejected
EMP0001 + 2026-08-16 → allowed
```

---

## 7. Foreign Keys

### User → Department

```text
User.departmentId
        ↓
Department.id
```

Relationship:

```text
Department 1 : N User
```

### Attendance → User

```text
Attendance.employeeId
        ↓
User.id
```

Relationship:

```text
User 1 : N Attendance
```

---

## 8. Indexes and Constraints

### Required unique constraints

```text
Department.name
User.employeeId
User.email
Attendance(employeeId, date)
```

### Recommended indexes

```text
User.departmentId
Attendance.date
Attendance.employeeId
```

The composite unique constraint on:

```text
(employeeId, date)
```

also creates an index useful for common attendance lookups.

---

## 9. Data Integrity Rules

1. Every User must belong to a Department.
2. Every Attendance record must belong to a User.
3. `employeeId` must be unique.
4. Email must be unique.
5. One employee can have only one attendance record per date.
6. `checkOut` may be NULL while the employee is still checked in.
7. Check-out should only be allowed when a check-in exists.
8. Attendance timestamps should be generated by the server.
9. Passwords must contain only hashes, never plain-text passwords.
10. Deactivating a user is preferred over deleting a user with attendance history.

---

## 10. Manager Department Access

A manager does not need a direct `managerId` field.

Example:

```text
Manager
  User.departmentId = IT
          ↓
      Department
          ↓
      All IT Users
```

A manager can retrieve their department using their own `departmentId`, then restrict employee/attendance queries to that department.

Conceptually:

```sql
SELECT u.*
FROM "User" u
WHERE u."departmentId" = manager_department_id
  AND u.role = 'EMPLOYEE';
```

With Prisma, this relationship will later be expressed using relation filters/includes rather than manually writing every SQL JOIN.

---

## 11. Dashboard Query Requirements

The database must support queries for:

### Employee

- Own attendance history
- Current-day attendance
- Total present days
- Total late days
- Attendance percentage

### Manager

- Employees in own department
- Department attendance history
- Present count
- Late count
- Absent/missing attendance information
- Attendance percentage
- Employee-level attendance summaries
- Date-range filtering

These should generally be calculated from the stored attendance records instead of storing duplicated summary values.

---

## 12. Sample Development Data

The seed database should contain enough data to test relationships and visualizations.

Current seed structure:

```text
Departments: 4
Users: 24
    Managers: 4
    Employees: 20
Attendance: multiple records across approximately 30 days
```

Example departments:

```text
IT
HR
Finance
Marketing
```

Employee IDs:

```text
EMP0001
EMP0002
...
EMP0024
```

The seed should contain a mixture of:

```text
PRESENT
LATE
```

and missing attendance days so dashboard queries and visualizations have meaningful variation.

---

## 13. Database Design Principles

- Keep the schema normalized.
- Avoid duplicated employee/department information in Attendance.
- Use UUIDs for internal relationships.
- Use `employeeId` for human-facing identification.
- Use foreign keys to enforce relationships.
- Use unique constraints for business rules that must never be duplicated.
- Prefer database constraints over relying only on frontend validation.
- Keep the initial schema small and understandable.
- Add complexity only when a real requirement needs it.

---

## 14. Final Schema Summary

```text
Department
-----------
id PK
name UNIQUE
createdAt
updatedAt

        1
        │
        │
        N

User
----
id PK (UUID)
employeeId UNIQUE
name
email UNIQUE
password
role
departmentId FK
isActive
createdAt
updatedAt

        1
        │
        │
        N

Attendance
----------
id PK (UUID)
employeeId FK → User.id
date
checkIn
checkOut
status
createdAt
updatedAt

UNIQUE(employeeId, date)
```

---

## 15. Prisma Mapping

The database is represented in Prisma using:

```text
Department
User
Attendance

UserRole
AttendanceStatus
```

Prisma relations:

```text
Department.users
User.department
User.attendance
Attendance.employee
```

The Prisma schema is the application-level representation of this database design.
