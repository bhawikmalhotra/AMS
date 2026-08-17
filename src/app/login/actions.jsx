"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function login(formData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    throw error;
  }
}