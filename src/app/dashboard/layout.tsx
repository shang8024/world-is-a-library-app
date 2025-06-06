"use client"
import React from "react";
import { ReactNode } from "react";
import { DashboardContextProvider } from "@/hooks/useDashboardContext";
import { authClient } from "@/lib/auth/auth-client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import Loading from "@/components/Loading";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { 
    data: session, 
    error: sessionError, //error state
    isPending //loading state
  } = authClient.useSession();
  console.log("session", session);

  return (
    <div className="flex min-h-[calc(100vh-56px)] w-screen items-start justify-start">
    {
      isPending ? <Loading />
      : sessionError || !session ? (
        <div className="w-full flex flex-col items-center justify-center h-screen">
          {sessionError && <p className="text-red-500">{sessionError.message}</p>}
          <p className="mt-4 text-lg text-center">Please sign in to access your dashboard.</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/login")}>
            Sign In
          </Button>
        </div>
      ) : (
        <DashboardContextProvider user={session.user as User}>
              {children}
        </DashboardContextProvider>
     )
    }
    </div>
);
}
