"use client";

import { createContext, useContext } from "react";
import { Series, User} from "@prisma/client"
import { BookInfo } from "@/lib/book/book-actions";
interface UserProfileContextProps {
    serieslist: (Series & { books: BookInfo[] })[]
    user: User
    stats: {
        booksCount: number
        chaptersCount: number
        wordsCount: number
        likesCount: number
        commentsCount: number
    },
}

const UserProfileContext = createContext<UserProfileContextProps | null>(null);
export function UserProfileContextProvider({
  children,
  user,
  serieslist,
  stats,  
}: UserProfileContextProps & {
  children: React.ReactNode;
}) {
  return (
    <UserProfileContext.Provider value={{ serieslist, user, stats }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfileContext() {
  const context = useContext(UserProfileContext);
  if (!context) throw new Error("useSeries must be used within SeriesProvider");
  return context;
}