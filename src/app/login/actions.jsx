"use server";

import { signIn } from "@/auth";

export async function login(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard",
  });
}