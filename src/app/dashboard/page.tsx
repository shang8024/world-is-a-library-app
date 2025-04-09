import { auth } from "@/lib/auth/auth"
import { headers } from "next/headers"
import { Suspense } from "react";

export default async function DashboardPage() {
  try{
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
      return <p className="text-red-600">You are not authenticated</p>;
    }
    const user = session?.user;
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
          <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
            <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
            <p className="text-gray-700">Welcome, {user?.name}!</p>
            <p className="text-gray-700">Email: {user?.email}</p>
            <p className="text-gray-700">Joined: {user?.createdAt.toLocaleString()}</p>
          </div>
        </div>
    );
  }
  catch(error) {
    const unknownError =
      error instanceof Error ? error.message : "Unknown error";
    return <p className="text-red-600">Error: {unknownError}</p>;
  }
}