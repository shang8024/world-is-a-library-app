import { z } from "zod";
export const SignupSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Minimum 2 characters are required" })
      .max(20, { message: "Maximum of 20 characters are allowed" }),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(20, { message: "Password must be at most 20 characters long" }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(25, { message: "Username must be at most 25 characters long" })
      .regex(/^[a-zA-Z0-9_.]+$/, { message: "Username can only contain letters, numbers, underscores, and dots" }),
  })