"use server";

import { authClient } from "@/lib/auth/auth-client";

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
