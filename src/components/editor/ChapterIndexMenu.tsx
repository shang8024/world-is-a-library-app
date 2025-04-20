"use client"
import { ChapterIndex, useEditorContext } from '@/hooks/useEditorContext'
import React, { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, PlusIcon, CircleX } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createChapter, deleteChapter } from '@/lib/book/chapters-actions'
import clsx from "clsx"

interface ChapterIndexItemProps {
  chapter: ChapterIndex;
  chapterActions?: {
    deleteChapter: () => void;
  }
}


const ChapterIndexItem = ({chapter, chapterActions}: ChapterIndexItemProps) => {
  const {isLoading, curChapter, book} = useEditorContext()
  const router = useRouter()
  return (
    <div className='flex'>
      <div 
        className={clsx(
          "flex flex-1 flex-col gap-1 p-2 cursor-pointer",
          curChapter === chapter.id
            ? "bg-gray-200 dark:bg-gray-700"
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        )}
        onClick={() => {
          if (isLoading || curChapter===chapter.id) return
          router.push(`/dashboard/book-editor/${book.id}/chapters/${chapter.id}`)
        }
      }
      >
        <h1 className="text-lg font-bold break-all line-clamp-2">{chapter.title}
          {!chapter.isPublic && <span className="text-sm text-gray-500"> (Draft)</span>}
        </h1>
        <p className="text-sm text-gray-500">
          {chapter.wordCount} words
        </p>
        <p className="text-sm text-gray-500">
          {chapter.updatedAt.toLocaleDateString()} {chapter.updatedAt.toLocaleTimeString()}
        </p>
      </div>
      <div className='flex flex-row '>
          <Button
            variant="ghost"
            onClick={() => {
              if (confirm("Are you sure you want to delete this chapter? This action cannot be undone. Deleting a published chapter will also remove its existing reviews.")) {
                chapterActions?.deleteChapter()}}
            }
            disabled={isLoading}
            className="hover:bg-red-200 dark:hover:bg-red-400/50 p-2 text-red-400"
          >
            <CircleX className="h-4 w-4" />
          </Button>
      </div>
    </div>
  )
}

export function ChapterIndexMenu() {
  const {book, chapters, setChapters, isLoading, setLoading, curChapter} = useEditorContext()
  const [searchFilter, setSearchFilter] = React.useState<string>("")
  const [filteredChapters, setFilteredChapters] = React.useState(chapters)
  const router = useRouter()

  useEffect(() => {
    const filtered = chapters.filter((chapter) => {
      return chapter.title.toLowerCase().includes(searchFilter.toLowerCase())
    })
    setFilteredChapters(filtered)
  }
  , [searchFilter, chapters])

  const handleCreateChapter = async () => {
    setLoading(true)
    toast.promise(
      (async () => {
          const result = await createChapter(book.id);
          if (result.status !== 200 || !result.data) {
              throw new Error(result.message)
          }
          const newChapter = result.data as ChapterIndex
          return newChapter
      })(),
      {
        loading: "Loading...",
        success: (data) => {
          // add the new chapter to the list of chapters
          setChapters([...chapters, data]);
          return `New chapter created successfully`;
        },
        error: (error) => {
          return error.message || "Something went wrong";
        },
        finally: () => {
          setLoading(false);
        }
      }
    );
  }
  const handleDelete = (id: string) => {
    //TODO: server action 
    const index = chapters.findIndex((chapter) => chapter.id === id);
    setLoading(true);
    toast.promise(
      (async () => {
          const result = await deleteChapter(id);
          if (result.status !== 200) throw new Error(result.message)
      })(),
      {
        loading: "Loading...",
        success: () => {
          const updatedChapters = [...chapters];
          updatedChapters.splice(index, 1);
          setChapters(updatedChapters);
          return `Series deleted successfully`;
        },
        error: (error) => {
          return error.message || "Something went wrong";
        },
        finally: () => {
          setLoading(false);
          if (curChapter === id) {
            router.push(`/dashboard/book-editor/${book.id}/chapters`)
          }
        }
      }
    );
  }
  return (
    <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="group/toggle size-8 flex align-items-center border-none bg-muted hover:bg-background cursor-pointer dark:bg-gray-800 dark:hover:bg-background"
                        disabled={isLoading}
                        onClick={() => router.push("/dashboard")}
                    >
                        <ArrowLeftIcon/>
                        <span className="sr-only">Back</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className='px-2 py-1'>
                        <p>Back</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="group/toggle size-8 flex align-items-center border-none bg-muted hover:bg-background cursor-pointer dark:bg-gray-800 dark:hover:bg-background"
                        onClick={handleCreateChapter}
                        disabled={isLoading}
                    >
                        <PlusIcon/>
                        <span className="sr-only">Back</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className='px-2 py-1'>
                        <p>Add Chapter</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
        <h1 className="text-2xl font-bold text-center break-all line-clamp-3">{book?.title}</h1>
        <Input
          type="text"
          placeholder="Search books and series..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          disabled={isLoading}
          className="w-full flex-1 p-2 bg-background"
        />
        <div className="flex items-center justify-between">
        </div>
    <h1 className="text-lg font-bold">Chapter Index</h1>
    {!chapters || chapters.length === 0 ? (
        <p className="text-sm text-gray-500">
                This is the chapter index. You can add, edit, or delete chapters here.
            </p>
    ) : (
      <div className="flex flex-col">
        {filteredChapters.map((chapter) => (
          <div key={chapter.id} className="border-b border-gray-300 ">
            <ChapterIndexItem 
              chapter={chapter}
              chapterActions={{
                deleteChapter: () => handleDelete(chapter.id),
              }}
            />
          </div>
        ))}
      </div>
    )}
    </div>
  )
}