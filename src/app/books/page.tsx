
import React, { Suspense } from "react";
import Search from "@/components/Search";
import { BookListPublic } from "@/components/book/BookList";
import Loading from "@/components/Loading";
import {bookSearchParams, fetchBooksPages, fetchBooks} from "@/lib/book/book-actions"
import ErrorPage from "@/components/Error";
import PaginationComponent from "@/components/PanigationComponent";
async function BookListResult(params: bookSearchParams) {
    try {
      const res = await fetchBooks(params);
      if (res.status !== 200 || !res.data) {
        return <ErrorPage message={res?.message || "Error fetching books"} />;
      }
      if (res.data.length === 0) {
        return <div className="text-center">No books found</div>;
      }
      return (
        <Suspense fallback={<Loading />}>
          <BookListPublic books={res.data} mode='list' />
        </Suspense>
      )

    } catch {
        return <ErrorPage />;
    }
}

export default async function BooksPage(props: {
    searchParams?: Promise<{
        query?: string;
        sortBy?: string;
        sortDest?: string;
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const sortBy = (searchParams?.sortBy as 'createdAt' | 'updatedAt' | 'title' | 'wordCount') || 'updatedAt';
    const sortDest = (searchParams?.sortDest as 'asc' | 'desc') || 'desc';
    const currentPage = Number(searchParams?.page) || 1;
    const res = await fetchBooksPages(query);
    if (res.status !== 200 || res.data === undefined) {
        return <ErrorPage message={res?.message || "Error fetching books"} />;
    }


    return (
        <div className="w-full justify-center flex flex-col items-center p-4 md:p-20">
            <Search placeholder="Search invoices..." />
            <Suspense key={query + currentPage} fallback={<Loading />}>
          <BookListResult query={query} currentPage={currentPage} sortBy={sortBy} sortDest={sortDest} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <PaginationComponent totalPages={res.data}/>
        </div>
      </div>
    );
}