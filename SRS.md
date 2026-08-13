# Employee Attendance Management System
## Software Requirements Specification (SRS)

**Project Type:** Internship Learning Project  
**Version:** 1.0  
**Status:** Initial Specification  
**Frontend:** Next.js 16, React, JavaScript  
**UI:** shadcn/ui + Tailwind CSS  
**ORM:** Prisma  
**Database:** PostgreSQL 18  
**Authentication:** Auth.js / NextAuth  

---

## 1. Introduction

### 1.1 Purpose

The Employee Attendance Management System is a web-based application for managing employee attendance within an organization.

The system will allow employees to record and view their own attendance, while managers will have additional access to monitor attendance for employees within their department.

The project is intentionally designed as a learning project. The implementation should remain simple, readable, and beginner-friendly while following reasonable software development practices.

### 1.2 Project Goals

The main goals are:

- Learn how to plan a software project before coding.
- Learn database design from real requirements.
- Practice relational database concepts with PostgreSQL.
- Learn Prisma ORM and database relationships.
- Practice authentication and role-based access control.
- Understand authorization at both page and data levels.
- Build dashboards using Next.js and React.
- Practice basic attendance-related business logic.
- Display attendance information using simple data visualizations.

### 1.3 Scope

The initial version of the system will include:

- User authentication.
- Role-based access control.
- Employee management.
- Department management.
- Attendance check-in and check-out.
- Personal attendance history.
- Manager-level department attendance monitoring.
- Attendance statistics and basic visualizations.
- Protected dashboards.

The initial version will not include payroll, leave management, biometric attendance, GPS tracking, notifications, or advanced HR functionality.

---

# 2. Users and Roles

The system will have two application roles.

## 2.1 Employee

An employee can:

- Log in to the system.
- Access their own dashboard.
- View their profile information.
- Check in for the current day.
- Check out for the current day.
- View their attendance history.
- View their own attendance statistics.

An employee must not be able to view another employee's attendance data.

## 2.2 Manager

A manager is also an employee but has additional permissions.

A manager can:

- Perform all normal employee actions.
- View employees belonging to their department.
- View attendance records of employees in their department.
- Filter attendance by date.
- View individual employee attendance within their department.
- View department attendance statistics.
- View attendance data visualizations.

A manager must not automatically have access to employees belonging to other departments.

---

# 3. Functional Requirements

## 3.1 Authentication

### FR-AUTH-01
The system shall allow registered users to log in using their credentials.

### FR-AUTH-02
The system shall create an authenticated session after successful login.

### FR-AUTH-03
The system shall allow authenticated users to log out.

### FR-AUTH-04
The system shall identify the authenticated user's role.

### FR-AUTH-05
Unauthenticated users shall not be able to access protected dashboards.

### FR-AUTH-06
The system shall not store user passwords in plain text.

---

## 3.2 Role-Based Access Control

### FR-RBAC-01
The system shall support at least two roles:

- Employee
- Manager

### FR-RBAC-02
The system shall display the appropriate dashboard according to the user's role.

### FR-RBAC-03
An employee shall only be able to access their own attendance information.

### FR-RBAC-04
A manager shall be able to access attendance information for employees within their department.

### FR-RBAC-05
Authorization shall be enforced on the server/data-access layer and not only by hiding UI elements.

---

# 4. Employee Requirements

## 4.1 Employee Profile

### FR-EMP-01
The system shall store an employee's basic information.

Required information may include:

- Employee ID
- Full name
- Email
- Role
- Department
- Account status

### FR-EMP-02
An employee shall be able to view their own profile information.

---

# 5. Department Requirements

### FR-DEPT-01
The system shall support multiple departments.

Example departments:

- IT
- HR
- Finance
- Marketing
- Sales

### FR-DEPT-02
Each employee shall belong to one department.

### FR-DEPT-03
A department may contain multiple employees.

### FR-DEPT-04
A manager shall belong to a department.

### FR-DEPT-05
A manager shall be able to view employees belonging to their own department.

---

# 6. Attendance Requirements

## 6.1 Check-In

### FR-ATT-01
An authenticated employee shall be able to check in for the current day.

### FR-ATT-02
The system shall automatically record the check-in time.

### FR-ATT-03
An employee shall not be able to create multiple check-in records for the same day.

### FR-ATT-04
The system shall determine the attendance status according to the configured attendance rule.

---

## 6.2 Check-Out

### FR-ATT-05
An employee who has checked in shall be able to check out.

### FR-ATT-06
The system shall automatically record the check-out time.

### FR-ATT-07
An employee shall not be able to check out before checking in.

### FR-ATT-08
An employee shall not be able to check out multiple times for the same attendance record.

---

## 6.3 Attendance Status

The initial system may support:

- PRESENT
- LATE
- ABSENT

### FR-ATT-09
The system shall determine the attendance status instead of allowing employees to freely select it.

### FR-ATT-10
The initial late rule shall be configurable in the application logic.

For example, a check-in after 10:00 AM may be considered late.

### FR-ATT-11
The system shall maintain one attendance record per employee per date.

---

# 7. Employee Dashboard Requirements

### FR-DASH-EMP-01
The employee dashboard shall display the employee's basic information.

### FR-DASH-EMP-02
The dashboard shall display the current day's attendance status.

### FR-DASH-EMP-03
The dashboard shall provide a check-in action when the employee has not checked in.

### FR-DASH-EMP-04
The dashboard shall provide a check-out action after the employee has checked in and has not checked out.

### FR-DASH-EMP-05
The dashboard shall display the employee's attendance history.

### FR-DASH-EMP-06
The dashboard shall display basic personal attendance statistics.

Example:

- Total present days
- Total late days
- Total absent days

### FR-DASH-EMP-07
The employee dashboard shall not expose attendance records belonging to other employees.

---

# 8. Manager Dashboard Requirements

### FR-DASH-MGR-01
The manager dashboard shall display department-level attendance information.

### FR-DASH-MGR-02
The manager shall be able to view employees in their department.

### FR-DASH-MGR-03
The manager shall be able to view attendance records for employees in their department.

### FR-DASH-MGR-04
The manager shall be able to filter attendance records by date.

### FR-DASH-MGR-05
The manager shall be able to view attendance information for an individual employee within their department.

### FR-DASH-MGR-06
The manager dashboard shall display attendance statistics.

Possible statistics include:

- Total employees
- Present employees
- Late employees
- Absent employees
- Attendance percentage

### FR-DASH-MGR-07
The manager dashboard shall provide basic data visualizations.

Possible visualizations include:

- Daily attendance trend
- Present/Late/Absent distribution
- Employee attendance comparison

### FR-DASH-MGR-08
A manager shall not be able to access attendance information for employees outside their department unless an explicit future requirement grants that permission.

---

# 9. Attendance History

### FR-HIST-01
Employees shall be able to view their own historical attendance records.

### FR-HIST-02
Managers shall be able to view historical attendance records for employees in their department.

### FR-HIST-03
Attendance history shall contain, where applicable:

- Date
- Check-in time
- Check-out time
- Status

### FR-HIST-04
Attendance records shall be displayed in a clear and understandable format.

---

# 10. Data Visualization

The system shall provide simple visualizations for managers.

### FR-VIZ-01
Managers shall be able to view department attendance trends.

### FR-VIZ-02
Managers shall be able to view attendance distribution by status.

### FR-VIZ-03
Visualizations shall use data retrieved from the database.

### FR-VIZ-04
Employees shall only see visualizations based on their own attendance data, if personal visualization is implemented.

The visualization system should remain simple in the first version.

---

# 11. Authorization Rules

The following rules are mandatory.

| Action | Employee | Manager |
|---|---|---|
| Login | Yes | Yes |
| Logout | Yes | Yes |
| View own profile | Yes | Yes |
| Check in | Yes | Yes |
| Check out | Yes | Yes |
| View own attendance | Yes | Yes |
| View department employees | No | Yes |
| View department attendance | No | Yes |
| View department statistics | No | Yes |
| View department charts | No | Yes |
| View another department's attendance | No | No |

A manager's access shall be restricted to their own department.

---

# 12. Business Rules

### BR-01
Every attendance record belongs to exactly one employee.

### BR-02
An employee can have at most one attendance record for a given date.

### BR-03
Check-out requires a valid check-in.

### BR-04
An employee cannot check in more than once on the same day.

### BR-05
An employee cannot check out more than once for the same attendance record.

### BR-06
Attendance timestamps shall be generated by the system rather than entered manually by the employee.

### BR-07
An employee can only access their own attendance data.

### BR-08
A manager can only access attendance data belonging to employees in the manager's department.

### BR-09
A user's role determines which application features they can access.

### BR-10
Database relationships shall enforce valid references between employees, departments, and attendance records.

---

# 13. Data Requirements

The initial system is expected to contain the following core entities:

1. Employee/User
2. Department
3. Attendance

The exact database structure, fields, primary keys, foreign keys, relationships, indexes, and constraints shall be finalized during the database design phase.

The database design shall be derived from this SRS rather than created independently.

---

# 14. Non-Functional Requirements

## 14.1 Security

- Protected pages shall require authentication.
- Server-side authorization shall be used for protected data.
- Passwords shall not be stored as plain text.
- Users shall only access data permitted by their role.
- Managers shall be restricted to their department.

## 14.2 Usability

- The interface should be simple and beginner-friendly.
- Attendance actions should be easy to understand.
- Dashboard information should be clearly organized.
- Error messages should be understandable.

## 14.3 Maintainability

- Code should remain simple and readable.
- Related logic should be organized logically.
- Database access should use Prisma.
- Business rules should not be unnecessarily duplicated.

## 14.4 Performance

- The system should efficiently retrieve attendance records.
- Database queries should retrieve only the data required by the current user.
- Appropriate database constraints and indexes may be introduced when required.

---

# 15. Technology Requirements

## Frontend / Application

- Next.js 16
- React
- JavaScript
- Tailwind CSS
- shadcn/ui for reusable UI components

## UI / Component Library

The application UI shall use **shadcn/ui** components where appropriate, with Tailwind CSS for styling and layout.

The project should prefer simple, reusable components rather than building every UI element from scratch.

Potential shadcn/ui components include:

- Button
- Input
- Label
- Card
- Table
- Dialog
- Dropdown Menu
- Select
- Badge
- Calendar
- Tabs
- Sheet
- Sidebar
- Alert / Toast

The exact components will be selected according to the requirements of each screen.

shadcn/ui is a UI/component solution only. It does not replace application logic, authentication, authorization, Prisma, or the PostgreSQL database.

## Backend / Data Access

- Next.js server-side functionality
- Prisma ORM

## Database

- PostgreSQL 18

## Authentication

- Auth.js / NextAuth

## Database Design

- dbdiagram.io

---

# 16. Out of Scope for Version 1

The following features are intentionally excluded:

- Payroll management
- Leave management
- Employee salary management
- Biometric attendance
- Face recognition
- GPS/location-based attendance
- Shift management
- Multiple office branches
- Email notifications
- SMS notifications
- Push notifications
- Advanced HR management
- Complex reporting/export systems
- Mobile application
- Advanced analytics
- Public registration

These features may be considered in future versions.

---

# 17. Future Enhancements

Possible future features include:

- Leave management
- Holiday calendar
- Multiple shifts
- Overtime calculation
- Attendance correction requests
- CSV/PDF reports
- Email notifications
- Multiple branches
- Organization-level admin
- Advanced analytics
- Audit logs

These features are not part of the initial implementation.

---

# 18. Initial Application Flow

```text
User
  |
  v
Login
  |
  v
Authentication
  |
  v
Role Identification
  |
  +----------------------+
  |                      |
Employee               Manager
  |                      |
  v                      v
Employee Dashboard    Manager Dashboard
  |                      |
  |                      +--> Department Employees
  |                      |
  |                      +--> Department Attendance
  |                      |
  |                      +--> Statistics
  |                      |
  |                      +--> Visualizations
  |
  +--> Own Attendance
  |
  +--> Check In / Check Out
  |
  +--> Attendance History
```

---

# 19. Database Design Phase

After approval of this SRS, the next phase is database design.

The database design process will be:

1. Identify entities from the requirements.
2. Identify attributes for each entity.
3. Identify primary keys.
4. Identify foreign keys.
5. Identify one-to-many and other relationships.
6. Identify required constraints.
7. Identify unique fields and business constraints.
8. Create the ER/database diagram using dbdiagram.io.
9. Review the diagram against this SRS.
10. Only after the design is approved, create the Prisma schema.

The database should not be designed by blindly copying application code. It should be derived from the requirements.

---

# 20. Requirement Traceability

| Requirement Area | Main Entity / Feature |
|---|---|
| Authentication | User/Authentication |
| Roles | User/Role |
| Departments | Department |
| Employee information | User/Employee |
| Check-in | Attendance |
| Check-out | Attendance |
| Attendance history | Attendance |
| Personal statistics | Attendance |
| Manager monitoring | User + Department + Attendance |
| Department statistics | Department + Attendance |
| Data visualization | Attendance queries |
| Authorization | User + Role + Department |

---

# 21. Version 1 Acceptance Criteria

The project will be considered functionally complete when:

- A user can log in and log out.
- The system can identify whether the user is an Employee or Manager.
- Employees can access their own dashboard.
- Managers can access the manager dashboard.
- Employees can check in.
- Employees can check out.
- The system prevents duplicate daily attendance.
- Employees can view their attendance history.
- Managers can view attendance for their department.
- Managers cannot access another department's attendance.
- Managers can view basic attendance statistics.
- Managers can view at least one attendance visualization.
- Authentication and authorization are enforced correctly.
- Database relationships and constraints support the defined business rules.

---

# 22. Development Principle

This project is primarily a learning exercise.

The implementation should prioritize:

1. Understanding over speed.
2. Simple code over unnecessary abstraction.
3. Correct database design over premature coding.
4. Understanding Prisma rather than blindly generating schemas.
5. Understanding authentication and authorization rather than only implementing a login screen.
6. Understanding why each architectural decision is made.

AI tools and documentation may be used during development, but generated code should be reviewed and understood before being incorporated into the project.
