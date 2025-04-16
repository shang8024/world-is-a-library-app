"use client"
import React from "react";
import ChapterEditor from "@/components/editor/ChapterEditor";
import { SeriesListDashboard } from "@/components/book/BookSeries";
import { useDashboardContext } from "@/hooks/useDashboardContext";

export default function DashboardPage() {
  const {user} = useDashboardContext()
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
      <p className="mt-4 text-lg">Hello, {user.name}</p>
      <SeriesListDashboard/>
      <ChapterEditor  />
    </div>
);


}