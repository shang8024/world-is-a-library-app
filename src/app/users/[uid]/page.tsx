"use client"
import React, { useState, useEffect } from "react"
import { useUserProfileContext } from "@/hooks/useUserProfileContext"
import { SeriesListPublic } from "@/components/book/BookSeries"
import Statistics from "@/components/user/Stats";
import { Series } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { BookInfo } from "@/lib/book/book-actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { List, LayoutGrid } from "lucide-react";

export default function UserDashboardPage() {
  const { user, stats, serieslist } = useUserProfileContext()
  const [searchFilter, setSearchFilter] = useState<string>("")
  const [filteredSeries, setFilteredSeries] = useState(serieslist);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [sortBy, setSortBy] = useState<'title' | 'createdAt' | 'updatedAt' | 'wordCount'>('createdAt');
  const [sortDest, setSortDest] = useState<'asc' | 'desc'>('asc');

  const filterList = (serieslist: (Series & { books: BookInfo[] })[], filter: string) => {
    const filterlowercase = filter.toLowerCase();
      // filter out the books and series that do not match the filter
    const filtered = serieslist.filter((series) => {
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
    // sort the filtered list by the selected sortBy and sortDest
    const sorted = filtered.map((series) => {
      const sortedBooks = series.books.sort((a, b) => {
        if (sortBy === 'title') {
          return sortDest === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        } else if (sortBy === 'createdAt') {
          return sortDest === 'asc' ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy === 'updatedAt') {
          return sortDest === 'asc' ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime() : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        } else if (sortBy === 'wordCount') {
          return sortDest === 'asc' ? a.wordCount - b.wordCount : b.wordCount - a.wordCount;
        }
        return 0; // Default return value to ensure a number is always returned
      });
      return {
        ...series,
        books: sortedBooks,
      }
    });
    return sorted;
  }
  useEffect(() => {
      setFilteredSeries(filterList(serieslist, searchFilter));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serieslist, searchFilter, sortBy, sortDest])
  
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
        <div className="flex items-center gap-4">
          <div>
          Sort by:
          <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'title' | 'createdAt' | 'updatedAt' | 'wordCount')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue  placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="title" onClick={() => setSortBy('title')}>Title</SelectItem>
                <SelectItem value="createdAt" onClick={() => setSortBy('createdAt')}>Created At</SelectItem>
                <SelectItem value="updatedAt" onClick={() => setSortBy('updatedAt')}>Updated At</SelectItem>
                <SelectItem value="wordCount" onClick={() => setSortBy('wordCount')}>Word Count</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={sortDest} onValueChange={(value) => setSortDest(value as 'asc' | 'desc')}>
            <SelectTrigger >
              <SelectValue  placeholder="dest" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="asc" onClick={() => setSortDest('asc')}>asc</SelectItem>
                <SelectItem value="desc" onClick={() => setSortDest('desc')}>desc</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          </div>
          </div>
          <div>
            View mode:
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => setViewMode(value as 'card' | 'list')} className="flex gap-2">
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="card" aria-label="Card view">
                <LayoutGrid className="w-4 h-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
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
