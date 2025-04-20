"use client"
import React, { useState, useEffect } from "react"
import { useUserProfileContext } from "@/hooks/useUserProfileContext"
import { SeriesListPublic } from "@/components/book/BookSeries"
import Statistics from "@/components/user/Stats";
import { Book, Series } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function UserDashboardPage() {
  const { user, stats, serieslist } = useUserProfileContext()
  const [searchFilter, setSearchFilter] = useState<string>("")
  const [filteredSeries, setFilteredSeries] = useState(serieslist);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

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
  }, [serieslist, searchFilter]);
  
  return (
    <div className="flex flex-col w-full pt-6 md:p-10 gap-2 sm:px-6 p-4">
      <Statistics stats={stats} user={user} isPublic={true} />
      <section id="books" className="scroll-mt-[60px] w-full">
        <h2 className="text-lg font-semibold mt-2">Their Books & Sereis</h2>
        <div className="flex justify-center gap-4 mb-4 w-full">
          <Input
            type="text"
            placeholder="Search books and series..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full flex-1 p-2"
          />
        </div>
        <div>
          {/* TODO: add toggle group for view mode */}
          {/* TODO: add sort select box [by ...][asc/desc]*/} 
        </div>
        <div className="flex justify-start gap-1 flex-wrap w-full md:flex-nowrap">
        </div>
        <div className="w-full p-2">
          <SeriesListPublic serieslist={filteredSeries} mode={viewMode} />
        </div>
      </section>
    </div>
  )
}
