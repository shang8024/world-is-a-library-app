"use client"
import React from "react";
import { User } from "@prisma/client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client"

interface StatisticsProps {
  stats: {
    booksCount: number;
    chaptersCount: number;
    wordsCount: number;
    likesCount: number;
    commentsCount: number;
  };
  user: User;
  isPublic?: boolean;
}
  
const Statistics = ({ stats, user, isPublic }: StatisticsProps) => {
  const { data: session } = authClient.useSession()
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full p-4 px-6 bg-gray-50 dark:bg-gray-800 rounded-md h-fit">
      <div className="flex w-full flex-col justify-between sm:h-48">
        <div className="flex items-center space-x-4 flex-1">
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
        {!session || session?.user?.id !== user.id ? null :
        isPublic ? <Link
        href={`/dashboard`}
        className="text-sm text-indigo-300 hover:underline hover:text-indigo-500"
      >
        &gt; To your dashboard
      </Link>
        :<Link
          href={`/users/${user.username}`}
          className="text-sm text-indigo-300 hover:underline hover:text-indigo-500"
        >
          &gt; To your profile view
        </Link>
    }
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

export default Statistics;