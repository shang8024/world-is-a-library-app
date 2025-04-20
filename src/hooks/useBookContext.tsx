"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { BookInfo } from "@/lib/book/book-actions";
export type ChapterIndex = {
    id: string,
    title: string,
    isPublic: boolean,
    wordCount: number,
    createdAt: Date,
    updatedAt: Date,
}

export interface BookContextType {
    book: BookInfo;
    chapters: ChapterIndex[];
    curChapter: string | null;
    setCurChapter: (chapterId: string) => void;
    prevChapter: string | null;
    nextChapter: string | null;
}

export const BookContext = createContext<BookContextType | null>(null);

export const useBookContext = () => {
  const context = useContext(BookContext);
  if (!context) throw new Error("EditorContext not found");
  return context;
};

export const BookContextProvider = ({ children, book, chapters}: { children: React.ReactNode, book:BookInfo, chapters:ChapterIndex[]}) => {
    const [curChapter, setCurChapter] = useState<string | null>(null);
    const [nextChapter, setNextChapter] = useState<string | null>(null);
    const [prevChapter, setPrevChapter] = useState<string | null>(null);

    useEffect(() => {
        if (chapters.length > 0) {
            const curIndex = chapters.findIndex((chapter) => chapter.id === curChapter);
            setNextChapter(chapters[curIndex + 1]?.id || null);
            setPrevChapter(chapters[curIndex - 1]?.id || null);
        }
    }, [curChapter, book, chapters]);
    return (
        <BookContext.Provider value={{ book, chapters, curChapter, setCurChapter, nextChapter, prevChapter }}>
            {children}
        </BookContext.Provider>
    );
}