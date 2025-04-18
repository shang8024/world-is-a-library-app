"use server";

import { authClient } from "@/lib/auth/auth-client";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

export async function signUpWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  try {
    const result = await authClient.signUp.email({
      email,
      password,
      name: username,
    });

    return {
      success: true,
      data: result,
      message: "Sign-up successful!",
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      message: `Error: ${(error as Error).message}`,
    };
  }
}

export async function getValidatedSession() {
  const session = await auth.api.getSession({
      headers: await headers(),
  });
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}