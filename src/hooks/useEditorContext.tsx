"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { Book } from "@prisma/client";
import { fetchChaptersIndex } from "@/lib/book/chapters-actions";
import Loading from "@/components/Loading";
import ErrorPage from "@/components/Error";

export type ChapterIndex = {
    id: string,
    title: string,
    isPublic: boolean,
    wordCount: number,
    createdAt: Date,
    updatedAt: Date,
}

export interface BookContextType {
    book: Book;
    chapters: ChapterIndex[];
    setChapters: (chapters: ChapterIndex[]) => void;
    setBook: (book: Book) => void;
    isLoading: boolean;
    setLoading: (isLoading: boolean) => void;
    curChapter: string | null;
    setCurChapter: (chapterId: string) => void;
}

export const EditorContext = createContext<BookContextType | null>(null);

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error("EditorContext not found");
  return context;
};

export const EditorContextProvider = ({ children, bookId}: { children: React.ReactNode, bookId: string}) => {
    const [isLoading, setLoading] = useState(false);
    const [book, setBook] = useState<Book | null>(null);
    const [chapters, setChapters] = useState<ChapterIndex[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState(true);
    const [curChapter, setCurChapter] = useState<string | null>(null);
    useEffect(() => {
        setLoading(true)
        fetchChaptersIndex({bookId})
        .then((res) => {
            if (res.status !== 200 || !res.data) throw new Error(res.message);
            return res.data;
        })
        .then((data) => {
            setChapters(data.chapters);
            setBook(data.book);
        })
        .catch((err) => {
            setError(err.message);
        })
        .finally(() => {
            setLoading(false);
            setIsFetching(false);
        });
    }, [bookId]);
    if (isFetching) {
        return  <Loading/>
    }
    if (error || !book) {
        return (
            <ErrorPage message={error || "Book not found"} />
        );
    }

    return (
        <EditorContext.Provider value={{ book, chapters, setChapters, setBook, isLoading, setLoading, curChapter, setCurChapter }}>
            {children}
        </EditorContext.Provider>
    );
}
