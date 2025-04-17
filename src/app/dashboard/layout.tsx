"use client"
import React from "react";
import { ReactNode, useEffect, useState } from "react";
import { DashboardContextProvider } from "@/hooks/useDashboardContext";
import { authClient } from "@/lib/auth/auth-client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import Loading from "@/components/Loading";
import Link from "next/link";

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

  return (
    <div className="flex min-h-svh items-center justify-center">
    {
      isPending ? <Loading />
      : sessionError || !session ? (
        <div className="flex flex-col items-center justify-center h-screen">
          {sessionError && (
            <p className="text-2xl text-red-500">{sessionError?.message || "Some thing went wrong"}</p>
          )}
          <p className="mt-4 text-lg">Please sign in to access your dashboard.</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/login")}>
            Sign In
          </Button>
        </div>
      ) : (
        <DashboardContextProvider user={session.user as User}>
          <div className="flex min-h-screen h-fit w-full">
            <aside className="hidden w-56 bg-gray-100 border-r px-4 py-6 sm:flex flex-col space-y-4 dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-lg font-bold mb-2">Navigation</h2>
                <Link href="/dashboard" className="text-sm hover:underline">Dashboard</Link>
                <Link href="/dashboard/books" className="text-sm hover:underline">Manage Works</Link>
                <Link href="/dashboard/create-book" className="text-sm hover:underline">Create Book</Link>
              <h2 className="text-lg font-bold mb-2">Account</h2>
                <Link href="/dashboard/account" className="text-sm hover:underline">Account Settings</Link>
                <Link href="/dashboard/logout" className="text-sm hover:underline">Logout</Link>
            </aside>
            {children}
          </div>
            
        </DashboardContextProvider>
     )
    }
    </div>
);
}
