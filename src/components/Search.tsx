'use client';
import React from 'react';
import { SearchIcon } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from 'use-debounce';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
 
export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.set('sortBy', value);
    replace(`${pathname}?${params.toString()}`);
  }
  const handleSortDest = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.set('sortDest', value);
    replace(`${pathname}?${params.toString()}`);
  }
  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
        params.set('query', term);
    } else {
        params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);
 
  return (
    <div className="m-4 flex w-[90%] flex-col items-center justify-center gap-2 md:mb-8">
      <div className="relative flex flex-1 flex-shrink-0 w-full">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <Input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder={placeholder}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get('query')?.toString()}
        />
        <SearchIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
      <div className="flex items-center justify-start gap-4 w-full">
        Sort by:
        <div className="flex items-center gap-2">
          <Select onValueChange={handleSort} defaultValue={searchParams.get('sortBy')?.toString() || 'updatedAt'}>
            <SelectTrigger className="w-[180px]">
              <SelectValue  placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="createdAt" >Created At</SelectItem>
                <SelectItem value="updatedAt" >Updated At</SelectItem>
                <SelectItem value="wordCount" >Word Count</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select onValueChange={handleSortDest} defaultValue={searchParams.get('sortDest')?.toString() || 'desc'}>
            <SelectTrigger >
              <SelectValue  placeholder="dest" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="asc">asc</SelectItem>
                <SelectItem value="desc" >desc</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}