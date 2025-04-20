import * as React from "react"
import { Book } from "@prisma/client"
import {toast} from 'sonner'
import { Button } from "@/components/ui/button"
import { useDashboardContext } from "@/hooks/useDashboardContext"
import { BookCard } from "@/components/book/BookCard"
import { useRouter } from "next/navigation"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { deleteBook } from "@/lib/book/book-actions"

interface BookListProps {
    editable?: boolean;
    onDelete?: (bookId: string) => void;
    isLoading?: boolean;
}

function BookCardListItem({ book, editable, isLoading, onDelete}:  {book: Book } & BookListProps) {
  const router = useRouter()
  return (
    <div className="p-2 flex-col inline-flex w-[300px] gap-2 sm:w-[240px] sm:justify-center sm:items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className=" w-[240px] h-[320px] sm:w-[120px] sm:h-[160px]">
              <BookCard 
                book={book}
                onClick={() => 
                editable 
                  ? router.push(`/dashboard/book-editor/${book.id}/chapters`)
                  : router.push(`/books/${book.id}`)
                }
              />
            </div>
          </TooltipTrigger>
          {editable && <TooltipContent >
            <p className="p-1 px-2 text-xs">Open Book Editor</p>
          </TooltipContent>}
        </Tooltip>
      </TooltipProvider>
      <div className="relative right-6 flex flex-row items-center justify-center full gap-3 w-full sm:right-0">
        <p className="text-left text-xl font-semibold break-words flex-1 p-2 break-all text-primary dark:text-primary-background">
          {book.title}
        </p>
        {editable && (
        <div className="flex flex-col gap-1 w-[76px] sm:w-[60px]">
          <Button
            variant="ghost"
            disabled={isLoading}
            className="hover:bg-blue-200 dark:hover:bg-blue-400/50 p-2 bg-blue-400 text-white hover:text-white w-full sm:text-xs"
            onClick={() => router.push(`/dashboard/books/${book.id}/edit-info`)}
          >
            EDIT
          </Button>
          <Button
            variant="ghost"
            disabled={isLoading}
            className="hover:bg-red-200 dark:hover:bg-red-400/50 p-2 bg-red-400 text-white hover:text-white sm:text-xs"
            onClick={() => onDelete?.(book.id)}
          >
            DELETE
          </Button>
        </div>
        )}
      </div>
    </div>
  )
}

function CarouselDisplay({books, editable, onDelete, isLoading}: {books: Book[] } & BookListProps) {
  return (
    <Carousel className="justify-center items-center w-[320px] h-full">
      <div className="w-full overflow-hidden">
      <CarouselContent className="ml-4 w-[320px] ">
        {books.map((book, index) => (
          <CarouselItem key={index} className="min-w-0 shrink-0 grow-0 basis-full pl-4">
            <BookCardFlexItem 
              book={book} 
              editable={editable} 
              isLoading={isLoading}
              onDelete={onDelete}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      </div>
      <CarouselPrevious className="absolute size-8 rounded-md top-1/2 -left-2 -translate-y-1/2"/>
      <CarouselNext className="absolute size-8 rounded-md top-1/2 -right-2 -translate-y-1/2" />
    </Carousel>
  )
}
 
function BookListDashboard({ books, mode }: {books: Book[], mode: 'card' | 'list'}) {
  const {serieslist, setSeries, isLoading, setLoading} = useDashboardContext()

  const handleDelete = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return
    setLoading(true)
    toast.promise(
      (async () => {
          const result = await deleteBook(bookId);
          if (result.status !== 200) {
              throw new Error(result.message)
          }
      })(),
      {
        loading: "Loading...",
        success: () => {
          // remove the book from the serieslist
          const updatedSeries = serieslist.map((series) => {
            return {
              ...series,
              books: series.books.filter((book) => book.id !== bookId),
            };
          });
          setSeries(updatedSeries);
          return `Book deleted successfully`;
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

  return (
    <div className="justify-center items-center flex flex-col w-full h-full">
        <div className="block sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden">
            <CarouselDisplay
              books={books} 
              editable={true}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
        </div>
        <div className="hidden sm:flex flex-wrap gap-4 justify-start w-full">
          {books.map((book) => (
            <BookCardFlexItem 
                book={book} 
                editable={true}
                onDelete={handleDelete}
                isLoading={isLoading}
                key={book.id}
              />
          ))}
        </div>
    </div>
  )
}


const BookListPublic = ({books, mode}: {books: Book[], mode: 'card' | 'list' }) => {
  return (
    <div className="justify-center items-center flex flex-col w-full h-full">
      <div 
        className={`w-full ${
          mode === 'card'
            ? 'flex flex-wrap justify-center sm:justify-start gap-4'
            : 'flex flex-col gap-4'
        }`}
      >
        {books.map((book) => (
          <BookCardFlexItem 
            book={book}
            key ={book.id}
          />
        ))}
    </div>
  </div>
  )
}

export { BookListDashboard, BookListPublic}