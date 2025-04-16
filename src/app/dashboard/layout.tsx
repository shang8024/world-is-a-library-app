"use client"
import React from "react";
import { ReactNode, useEffect, useState } from "react";
import { DashboardContextProvider } from "@/hooks/useDashboardContext";
import { authClient } from "@/lib/auth/auth-client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";


const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

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

  const [series, setSeries] = useState([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      setIsFetching(true);
      fetch(`/api/author/${session.user.username}/series`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load series");
          return res.json();
        })
        .then((data) => setSeries(data))
        .catch((err) => setFetchError(err.message))
        .finally(() => setIsFetching(false));
    }
  }, [session?.user?.id, session?.user?.username]);
  

  return (
    <div className="flex min-h-svh items-center justify-center p-6 md:p-10">
    {
      isPending || isFetching ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-2xl">Loading...</p>
        </div>
      ) : sessionError || fetchError ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-2xl text-red-500">{sessionError?.message || fetchError}</p>
        </div>
      ) : !session ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-4 text-lg">Please sign in to access your dashboard.</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/login")}>
            Sign In
          </Button>
        </div>
      ) : (
        <DashboardContextProvider 
          series={series || []} 
          user={session.user as User}
        >
            {children}
        </DashboardContextProvider>
     )
    }
    </div>
);
}
