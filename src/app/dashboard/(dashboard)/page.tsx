"use client"
import React, { useEffect, useState,useTransition } from "react";
import { SeriesListDashboard } from "@/components/book/BookSeries";
import { useDashboardContext } from "@/hooks/useDashboardContext";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSeries } from "@/lib/book/series-actions";
import { Book, Series } from "@prisma/client";
import Statistics from "@/components/user/Stats";

export default function DashboardPage() {
  const {user, isLoading, setLoading } = useDashboardContext()
  const currentHour = new Date().getHours();
  const isEvening = currentHour >= 18 && currentHour < 24;
  const greeting = isEvening ? "Good Evening" : "Good Morning";
  const {serieslist, stats, setSeries} = useDashboardContext()
  const [searchFilter, setSearchFilter] = useState<string>("")
  const [filteredSeries, setFilteredSeries] = useState(serieslist);
  const [newSeries, setNewSeries] = useState<string>("")
  const [isPending, startTransition] = useTransition();

  const filterList = (serieslist: (Series & { books: Book[] })[], filter: string) => {
    const filterlowercase = filter.toLowerCase()
    // filter out the books and series that do not match the filter
    return serieslist.filter((series) => {
      const seriesName = series.name.toLowerCase()
      const books = series.books.filter((book) => book.title.toLowerCase().includes(filterlowercase))
      return seriesName.includes(filterlowercase) || books.length > 0
    }).map((series) => {
      if (series.name.toLowerCase().includes(filterlowercase)) return series
      const books = series.books.filter((book) => book.title.toLowerCase().includes(filterlowercase))
      return {
        ...series,
        books: books,
      }
    })
  }

  useEffect(() => {
    setFilteredSeries(filterList(serieslist, searchFilter));
  }
  , [serieslist, searchFilter]);

  const handleCreateSeries = async () => {
    if (!newSeries || newSeries.trim() === "") {
      toast.error("Series name cannot be empty");
      return;
    }
    // if such name exists, show error
    const existingSeries = serieslist.find((series) => series.name === newSeries);
    if (existingSeries) {
      toast.error("Series with this name already exists");
      return;
    }
    setLoading(true);
    startTransition(async () => {
      toast.promise(
        (async () => {
          const result = await createSeries({
            name: newSeries,
          });
          if (result.status !== 200 || !result.data) throw new Error(result.message)
          return result.data
        })(),
        {
          loading: "Loading...",
          success: (data) => {
            // add the new series to the serieslist
            const newSeries = {books:[], ...data} as Series & { books: Book[] };
            const updatedSeries = [ newSeries,...serieslist];
            setSeries(updatedSeries);
            return `Series created successfully`;
          },
          error: (error) => {

            return error.message || "Something went wrong";
          },
          finally: () => {
            setLoading(false);
            setNewSeries("");
          }
        }
      );
    });
  }

  return (
    <div className="flex flex-col w-full pt-6 md:p-10 gap-2 sm:px-6 p-4">
      <h1 className="text-2xl font-bold ">{greeting}, {user.name}</h1>
      <Statistics stats={stats} user={user} />
      <section id="books" className="scroll-mt-[60px] w-full">
        <h2 className="text-lg font-semibold mt-2">Your Books & Sereis</h2>
        <div className="flex justify-center gap-4 mb-4 w-full">
        <Input
          type="text"
          placeholder="Search books and series..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          disabled={isPending || isLoading}
          className="w-full flex-1 p-2"
        />
        </div>
        <div className="flex justify-start gap-1 flex-wrap w-full md:flex-nowrap">
          <div className="flex w-full md:w-fit">
          <Input
            type="text"
            placeholder="Create series..."
            value={newSeries}
            onChange={(e) => setNewSeries(e.target.value)}
            disabled={isPending || isLoading}
            className="w-full flex-1 p-2 md:min-w-[50%] md:max-w-[60%] lg:max-w-[90%] rounded-r-none"
          />
          <Button variant="outline" 
            className="md:text-lg rounded-l-none cursor-pointer" 
            onClick={handleCreateSeries}
            disabled={isPending || isLoading}
          >
            Create Series
          </Button>
          </div>
          <Button variant="outline" className="md:text-lg" disabled={isPending || isLoading}>
            <Link href="/dashboard/create-book">Create Book</Link>
          </Button>
        </div>
        <div className="w-full p-2">
          <SeriesListDashboard serieslist={filteredSeries} mode="card"/>
        </div>
      </section>
    </div>
);


}