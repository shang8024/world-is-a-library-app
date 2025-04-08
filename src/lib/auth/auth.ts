import { resend } from "@/utils/email/resend";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/db";
import { username } from "better-auth/plugins"

const sender_email = process.env.SENDER_EMAIL as string;
export const auth = betterAuth({
  appName: "better_auth_nextjs",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
    maxPasswordLength: 20,
    
    requireEmailVerification: true, //It does not allow user to login without email verification [!code highlight]
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: sender_email, 
        to: user.email, // email of the user to want to end
        subject: "Password reset", // Main subject of the email
        html: `Click the link to reset your password: ${url}`, // Content of the email
            //TODO: add a react template for the email
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true, // Automatically sends a verification email at signup
    autoSignInAfterVerification: true, // Automatically signIn the user after verification
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: sender_email, 
        to: user.email, // email of the user to want to end
        subject: "Email Verification", // Main subject of the email
        html: `Click the link to verify your email: ${url}`, // Content of the email
        //TODO: add a react template for the email
      });
    },
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
  ],
});