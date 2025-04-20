"use client";
import Loading from "@/components/Loading";
import { useBookContext } from "@/hooks/useBookContext";
import {redirect} from "next/navigation";

export default function BookPage() {
    const { book, chapters } = useBookContext();
    if (chapters && chapters.length === 0) {
        return (
            <div className="flex h-full w-full items-center justify-center p-6 md:p-10">
                <h1 className="text-2xl font-bold">No chapters found</h1>
            </div>
        )
    }
    if (chapters && chapters.length > 0) {
        // refirect to the first chapter
        const firstChapter = chapters[0];
        const firstChapterUrl = `/books/${book.id}/chapters/${firstChapter.id}`;
        redirect(firstChapterUrl);
    }
    return (
        <Loading/>
    );
}