import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const departments = [
  { name: "IT" },
  { name: "HR" },
  { name: "Finance" },
  { name: "Marketing" },
];

const managerData = [
  { employeeId: "EMP0001", name: "Rahul Sharma", email: "rahul.manager@company.com" },
  { employeeId: "EMP0007", name: "Priya Verma", email: "priya.manager@company.com" },
  { employeeId: "EMP0013", name: "Amit Singh", email: "amit.manager@company.com" },
  { employeeId: "EMP0019", name: "Neha Kapoor", email: "neha.manager@company.com" },
];

const employeeNames = [
  ["Arjun Mehta", "Karan Gupta", "Riya Jain", "Mohit Kumar", "Simran Kaur"],
  ["Ananya Singh", "Rohit Verma", "Pooja Sharma", "Vikas Yadav", "Nisha Gupta"],
  ["Aditya Rao", "Sneha Kapoor", "Varun Mehta", "Kriti Sharma", "Manish Jain"],
  ["Sahil Kumar", "Tanya Singh", "Akash Verma", "Ishita Rao", "Dev Gupta"],
];

async function main() {
  console.log("🌱 Starting database seed...");

  const passwordHash = await bcrypt.hash("Password@123", 10);

  // 1. Create departments
  const createdDepartments = [];

  for (const department of departments) {
    const result = await prisma.department.upsert({
      where: {
        name: department.name,
      },
      update: {},
      create: department,
    });

    createdDepartments.push(result);
  }

  console.log("✅ Departments created");

  // 2. Create managers and employees
  const users = [];

  for (let i = 0; i < createdDepartments.length; i++) {
    const department = createdDepartments[i];

    const manager = await prisma.user.upsert({
      where: {
        email: managerData[i].email,
      },
      update: {
        departmentId: department.id,
        role: "MANAGER",
        isActive: true,
      },
      create: {
        name: managerData[i].name,
        email: managerData[i].email,
        password: passwordHash,
        role: "MANAGER",
        departmentId: department.id,
      },
    });

    users.push(manager);

    for (const name of employeeNames[i]) {
      const email = `${name.toLowerCase().replaceAll(" ", ".")}@company.com`;

      const employee = await prisma.user.upsert({
        where: {
          email,
        },
        update: {
          departmentId: department.id,
          role: "EMPLOYEE",
          isActive: true,
        },
        create: {
          name,
          email,
          password: passwordHash,
          role: "EMPLOYEE",
          departmentId: department.id,
        },
      });

      users.push(employee);
    }
  }

  console.log(`✅ ${users.length} users created`);

  // 3. Create attendance data
  const employees = users.filter((user) => user.role === "EMPLOYEE");

  const today = new Date();

  for (const employee of employees) {
    for (let daysAgo = 1; daysAgo <= 30; daysAgo++) {
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);

      // Skip some days to create realistic missing-attendance data.
      if ((employee.id.charCodeAt(0) + daysAgo) % 11 === 0) {
        continue;
      }

      const attendanceDate = new Date(date);
      attendanceDate.setHours(0, 0, 0, 0);

      const isLate =
        (employee.id.charCodeAt(1) + daysAgo) % 7 === 0;

      const checkIn = new Date(attendanceDate);

      if (isLate) {
        checkIn.setHours(10, 15, 0, 0);
      } else {
        checkIn.setHours(9, 30, 0, 0);
      }

      // Some records intentionally have no checkout.
      const noCheckout =
        (employee.id.charCodeAt(2) + daysAgo) % 17 === 0;

      const checkOut = noCheckout
        ? null
        : new Date(attendanceDate);

      if (checkOut) {
        checkOut.setHours(18, 0, 0, 0);
      }

      await prisma.attendance.upsert({
        where: {
          employeeId_date: {
            employeeId: employee.id,
            date: attendanceDate,
          },
        },
        update: {
          checkIn,
          checkOut,
          status: isLate ? "LATE" : "PRESENT",
        },
        create: {
          employeeId: employee.id,
          date: attendanceDate,
          checkIn,
          checkOut,
          status: isLate ? "LATE" : "PRESENT",
        },
      });
    }
  }

  console.log("✅ Attendance data created");
  console.log("🌱 Seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });