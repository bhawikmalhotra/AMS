import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.isActive) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id, // UUID
          employeeId: user.employeeId, // EMP0001
          name: user.name,
          email: user.email,
          role: user.role,
          departmentId: user.departmentId,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.employeeId = user.employeeId;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.departmentId = user.departmentId;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.employeeId = token.employeeId;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.role = token.role;
      session.user.departmentId = token.departmentId;

      return session;
    },
  },
});