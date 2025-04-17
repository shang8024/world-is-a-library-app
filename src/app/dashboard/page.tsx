"use client"
import React from "react";
import ChapterEditor from "@/components/editor/ChapterEditor";
import { SeriesListDashboard } from "@/components/book/BookSeries";
import { useDashboardContext } from "@/hooks/useDashboardContext";
import { User } from "@prisma/client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
interface StatisticsProps {
  stats: {
    booksCount: number;
    chaptersCount: number;
    wordsCount: number;
    likesCount: number;
    commentsCount: number;
  };
  user: User;
}


const Statistics = ({ stats, user }: StatisticsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
      <div className="flex items-center justify-between w-full p-4 ">
      </div>
      <div className="flex flex-col justify-center w-full ">
        <h3 className="text-xl font-bold text-center">Statistics</h3>
        <div className="mt-4 space-y-2">
          <p>Books: {stats.booksCount}</p>
          <p>Chapters: {stats.chaptersCount}</p>
          <p>Words: {stats.wordsCount}</p>
          <p>Likes: {stats.likesCount}</p>
        <p>Comments: {stats.commentsCount}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const {user} = useDashboardContext()
  // if evening, show a different message
  const currentHour = new Date().getHours();
  const isEvening = currentHour >= 18 && currentHour < 24;
  const greeting = isEvening ? "Good Evening" : "Good Morning";
  const {serieslist, stats} = useDashboardContext()

  return (
    <div className="flex flex-col justify-center h-screen w-full p-6 md:p-10 gap-2">
      <h1 className="text-2xl font-bold ">{greeting}, {user.name}</h1>
      <Statistics stats={stats} user={user} />
      <div>
        <h2 className="text-lg font-semibold mt-2">Your Books & Sereis</h2>
        <div className="w-full p-2">
          <SeriesListDashboard serieslist={serieslist}/>
        </div>
      </div>
      <ChapterEditor  />
    </div>
);


}