"use client";

import { createContext, useContext } from "react";
import {Book, Series, User} from "@prisma/client"
import { useState, useEffect } from "react";
import Loading from "@/components/Loading";
import { useSearchParams } from "next/navigation"
interface DashboardContextProps {
    serieslist: (Series & { books: Book[] })[]
    user: User
    setSeries: React.Dispatch<React.SetStateAction<(Series & { books: Book[] })[]>>
    stats: {
        booksCount: number
        chaptersCount: number
        wordsCount: number
        likesCount: number
        commentsCount: number
    }
}

const DashboardContext = createContext<DashboardContextProps | null>(null);
export function DashboardContextProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const searchParams = useSearchParams()
  const shouldRefresh = searchParams.get("refresh") === "1"
  const [serieslist, setSeries] = useState<(Series & { books: Book[] })[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    booksCount: 0,
    chaptersCount: 0,
    wordsCount: 0,
    likesCount: 0,
    commentsCount: 0,
  });
  
  useEffect(() => {
    if (user?.id) {
      fetch(`/api/author/${user.username}/series`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load series");
          return res.json();
        })
        .then((data) => setSeries(data))
        .catch((err) => setError(err.message))
        .finally(() => setIsLoading(false));
      }
      fetch(`/api/author/${user.username}/stats`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load stats");
          return res.json();
        })
        .then((data) => setStats(data))
        .catch((err) => setError(err.message))
        .finally(() => setIsLoading(false));
    }, [user?.id, user?.username, shouldRefresh]);
  return (
    <DashboardContext.Provider value={{ serieslist, user, setSeries, stats }}>
      {isLoading ? <Loading/>
      : error ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-2xl text-red-500">{error}</p>
        </div>
      ) : (
        children
      )}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useSeries must be used within SeriesProvider");
  return context;
}