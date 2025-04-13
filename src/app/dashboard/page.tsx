"use client"
import React from "react";
import { authClient } from "@/lib/auth/auth-client"
import { useRouter } from "next/navigation"
import SignOut from "@/components/auth/SignOut";
import ChapterEditor from "@/components/editor/ChapterEditor";
import { SeriesList } from "@/components/BookSection";
const list = [
  { name: "Series 1", books: [{name: "Book 1"}, {name: "Book 2"}] },
  { name: "Series 2", books: [{name: "Book 3"}, {name: "Book 4"}] },
]

export default function DashboardPage() {
  const router = useRouter()
  const { 
    data: session, 
    isPending, //loading state
    error, //error object
    refetch //refetch the session
  } = authClient.useSession()
  if (!isPending && !session) {
    router.push("/login")
  }
  return (
    <div className="flex min-h-svh items-center justify-center p-6 md:p-10">
    {
      isPending ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-2xl">Loading...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-2xl text-red-500">{error.message}</p>
        </div>
      ) : session ? (
        <div className="flex flex-col items-center justify-center h-screen w-[390px]">
          <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
          <p className="mt-4 text-lg">Hello, {session.user.name}</p>
          <SeriesList serieslist={list} />
          <ChapterEditor  />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-4 text-lg">Please sign in to access your dashboard.</p>
        </div>
      )
}</div>
);


}