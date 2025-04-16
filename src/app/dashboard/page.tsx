"use client"
import React from "react";
import ChapterEditor from "@/components/editor/ChapterEditor";
import { SeriesList } from "@/components/BookSection";
import { useDashboardContext } from "@/hooks/useDashboardContext";

export default function DashboardPage() {
  const {user, series} = useDashboardContext()
  console.log(series)
  return (
    <div className="flex flex-col items-center justify-center h-screen w-[390px]">
      <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
      <p className="mt-4 text-lg">Hello, {user.name}</p>
      <SeriesList serieslist={series} editable={true} />
      <ChapterEditor  />
    </div>
);


}