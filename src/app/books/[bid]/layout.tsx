import React, { ReactNode, Suspense } from "react";
import ErrorPage from "@/components/Error";
import { fetchChaptersIndex } from "@/lib/book/chapters-actions";
import Loading from "@/components/Loading";
import { BookContextProvider } from "@/hooks/useBookContext";
import BookInfo from "@/components/book/BookInfo";

export default async function BookInfoLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ bid: string }>
}) {
    const { bid } = await params;
    try {
        const res = await fetchChaptersIndex({ bookId: bid, isPublic: true });
        if (res.status !== 200 || !res.data) {
            return <ErrorPage message={res.message} />;
        }
        const { book, chapters } = res.data;
        return (
            <div className="flex flex-col h-fit w-full pt-10">
              <Suspense fallback={<Loading />}>
                <BookContextProvider book={book} chapters={chapters}>
                    <BookInfo />
                    {children}
                </BookContextProvider>
              </Suspense>
            </div>
        );
    } catch {
        return <ErrorPage />;
    }

}