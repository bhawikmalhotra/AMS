# 📋 Employee Attendance Management System (AMS)

A modern, beginner-friendly **Employee Attendance Management Web Application** built with **Next.js 16 (App Router)**, **Prisma 7**, **PostgreSQL**, and **Auth.js**.

---

## ✨ Features by Role

### 👤 1. Employee Dashboard (`/dashboard/employee`)
- **Daily Check-In & Check-Out**: Record daily attendance with a single click.
- **Smart Punctuality**: Automatically marks status as `PRESENT` or `LATE` (if checked in after 9:00 AM).
- **Personal Statistics**: Total present days, late days, and attendance rate percentage.
- **Attendance History**: View past check-in/out records with shift durations (shows latest 5 by default with "Show More" expansion).

### 👔 2. Manager Dashboard (`/dashboard/manager`)
- **Department Scoping**: Managers can strictly access only employees within their assigned department.
- **Department Metrics**: Total team members, present count, late count, and department attendance rate.
- **Interactive Directory**: Search team members by name, email, or employee ID, and filter by attendance status (`Present`, `Late`, `Not Checked In`).

### 👑 3. Admin Dashboard (`/dashboard/admin`)
- **Company-Wide Overview**: View organization-wide attendance metrics and department counts.
- **User Directory Management**: Filter and view all registered system users.
- **Role Assignment**: Instantly update user roles (`EMPLOYEE`, `MANAGER`, `ADMIN`).
- **Department Transfer**: Reassign employees to different departments.
- **Account Control**: Activate or deactivate user accounts (prevents unauthorized logins while preserving historical attendance data).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + React
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL 18
- **ORM**: Prisma 7
- **Authentication**: Auth.js (NextAuth v5 beta) with bcrypt password hashing
- **Security**: Next.js Middleware Proxy (`src/proxy.js`) + Server-side `auth()` authorization

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/bhawikmalhotra/AMS.git
cd attendance-management
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/attendance_db"
AUTH_SECRET="your_nextauth_secret_key"
```

### 3. Setup Database & Prisma
```bash
# Push schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app!

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── api/auth/         # Auth.js API route
│   ├── dashboard/        # Dashboard layout & route pages
│   │   ├── admin/        # Admin page & Server Actions
│   │   ├── employee/     # Employee page & Server Actions
│   │   ├── manager/      # Manager page
│   │   └── components/   # Dashboard UI components
│   └── login/            # Login page
├── components/ui/        # Reusable shadcn UI components
├── lib/                  # Prisma client & utility helpers
└── proxy.js              # Next.js route protection proxy
```
