
"use client";
import ErrorPage from "@/components/Error";
import { useBookContext } from "@/hooks/useBookContext";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import Loading from "@/components/Loading";
import Link from "next/link";
import { Chapter } from "@prisma/client";

export default function ChapterPage(){
  const { setCurChapter, prevChapter, nextChapter } = useBookContext();
  const { bid, cid } = useParams<{ bid: string; cid: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setIsLoading(true);
    try {
        const fetchChapter = async () => {
            const response = await fetch(`/api/chapters/${cid}`);
            const data = await response.json();
            if (!response.ok || !data) {
                setError(data?.error || "Failed to load chapter data");
            } else {
                setChapter(data);
                setCurChapter(cid);
            }
            setIsLoading(false);
        };
        fetchChapter();
    } catch{
        setError("Failed to load chapter data");
    }
  }, [cid, setCurChapter]);
  if (isLoading) return <Loading />;
  if (error || !chapter) return <ErrorPage message={error} />;
  return (
    <div className="flex flex-col h-full w-full items-center justify-center p-6 md:p-10">
      <h1 className="text-2xl font-bold">{chapter.title}</h1>
      <div className="mt-4 text-gray-700 whitespace-pre-line text-left w-full break-words">{chapter.content}</div>
      <div className="flex-grow" />
      <div className="flex flex-row justify-between mt-4 pt-4 w-full border-t-2">
        {prevChapter ? (
          <Link href={`/books/${bid}/chapters/${prevChapter}`} className="hover:underline">
            Previous
          </Link>
        ) : <div />} {/* Placeholder to maintain spacing when prevChapter is absent */}  
        <div className="flex-grow" />
        {nextChapter ? (
          <Link href={`/books/${bid}/chapters/${nextChapter}`} className="hover:underline">
            Next
          </Link>
        ) : <div />} {/* Placeholder to maintain spacing when nextChapter is absent */}
      </div>
    </div>
  );

}