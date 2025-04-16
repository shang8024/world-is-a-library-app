"use client";

import { createContext, useContext } from "react";
import {Book, Series, User} from "@prisma/client"

interface DashboardContextProps {
    series: (Series & { books: Book[] })[]
    user: User
}

const DashboardContext = createContext<DashboardContextProps | null>(null);
export function DashboardContextProvider({
  children,
  series, 
  user,
}: {
  children: React.ReactNode;
  series: (Series & { books: Book[] })[];
  user: User;
}) {
  return (
    <DashboardContext.Provider value={{ series, user }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useSeries must be used within SeriesProvider");
  return context;
}