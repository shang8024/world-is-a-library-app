import { resend } from "@/utils/email/resend";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/db";
import { username } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js";

const sender_email = process.env.SENDER_EMAIL as string;
export const auth = betterAuth({
  appName: "better_auth_nextjs",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: ["http://localhost:3000", "https://www.world-is-a-library.com", "https://world-is-a-library-app.vercel.app"], // Add your trusted origins here
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
    maxPasswordLength: 20,
    requireEmailVerification: process.env.RESEND_API_KEY !== undefined, // Require email verification for sign up
    sendResetPassword: process.env.RESEND_API_KEY ? async ({ user, url }) => {
      await resend?.emails.send({
        from: sender_email, 
        to: user.email, // email of the user to want to end
        subject: "Password reset", // Main subject of the email
        html: `Click the link to reset your password: ${url}`, // Content of the email
            //TODO: add a react template for the email
      });
    }: undefined, // Send reset password email
  },
  emailVerification: {
    sendOnSignUp: process.env.RESEND_API_KEY !== undefined, // Send verification email on sign up
    autoSignInAfterVerification: true, // Automatically signIn the user after verification
    sendVerificationEmail: process.env.RESEND_API_KEY ? async ({ user, url }) => {
      await resend?.emails.send({
        from: sender_email, 
        to: user.email, // email of the user to want to end
        subject: "Email Verification", // Main subject of the email
        html: `Click the link to verify your email: ${url}`, // Content of the email
        //TODO: add a react template for the email
      });
    }: undefined, // Send verification email
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 minutes
    },
  },
  plugins: [
    username(),
    nextCookies(),
  ],
});