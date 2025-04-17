"use client"
import React, { useState } from "react";
import ChapterEditor from "@/components/editor/ChapterEditor";
import { SeriesListDashboard } from "@/components/book/BookSeries";
import { useDashboardContext } from "@/hooks/useDashboardContext";
import { User } from "@prisma/client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full p-4 px-6 bg-gray-50 dark:bg-gray-800 rounded-md">
      <div className="flex justify-start w-full">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 relative flex size-24 shrink-0 overflow-hidden rounded-full">
            <AvatarImage src={user.image || ""} alt="User profile" />
            <AvatarFallback className="w-full bg-muted flex size-full items-center justify-center rounded-full text-3xl">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-500">UId:{" "}
            <Link href={`/users/${user.username}`} className="text-sm text-gray-500 hover:underline">{user.username}</Link></p>
            <p className="text-sm text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>  
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
  const [searchFilter, setSearchFilter] = useState<string>("")
  const [filteredSeries, setFilteredSeries] = useState(serieslist);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(event.target.value);
    const filter = event.target.value.toLowerCase();
    const filtered = serieslist.filter((series) =>
      series.name.toLowerCase().includes(filter) || series.books.some((book) =>
        book.title.toLowerCase().includes(filter)
      )
    );
    setFilteredSeries(filtered);
  };

  return (
    <div className="flex flex-col w-full pt-6 md:p-10 gap-2 sm:px-6 p-4">
      <h1 className="text-2xl font-bold ">{greeting}, {user.name}</h1>
      <Statistics stats={stats} user={user} />
      <section id="books" className="scroll-mt-[60px]">
        <h2 className="text-lg font-semibold mt-2">Your Books & Sereis</h2>
        <div className="flex justify-center gap-4 mb-4 w-full">
        <Input
          type="text"
          placeholder="Search books and series..."
          value={searchFilter}
          onChange={handleSearchChange}
          className="w-full flex-1 p-2 min-w-[50%] max-w-[90%]"
        />
        </div>
        <div className="flex justify-start gap-4">
          <Button variant="outline" className="text-lg">
            <Link href="/dashboard/create-book">Create Book</Link>
          </Button>
          <Button variant="outline" className="text-lg">
            <Link href="/dashboard/create-book">Create Series</Link>
          </Button>
        </div>
        <div className="w-full p-2">
          <SeriesListDashboard serieslist={filteredSeries} />
        </div>
      </section>
    </div>
);


}