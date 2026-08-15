import { prisma } from "./prisma.js";

const departments = await prisma.department.findMany();

console.log(departments);

await prisma.$disconnect();