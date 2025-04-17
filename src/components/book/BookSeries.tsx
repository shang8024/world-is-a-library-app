import * as React from "react"
import { Series, Book } from "@prisma/client"
import { ChevronDownIcon, ChevronUpIcon, Pencil, Check, CircleX } from "lucide-react"
import {toast} from 'sonner'
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { updateSeries, deleteSeries } from "@/lib/book/series-actions"
import { BookListDashboard, BookListPublic } from "@/components/book/BookList"
import { useDashboardContext } from "@/hooks/useDashboardContext"

interface SeriesListItemProps {
  series: Series & { books: Book[] };
  editable?: boolean;
  isLoading?: boolean;
  isEditing?: boolean;
  seriesActions?: {
    finishEditing: () => void;
    handleSubmit: (newValue: string) => void;
    startEditing: () => void;
    deleteSeries: () => void;
  }
}


interface SeriesListProps {
  serieslist: (Series & { books: Book[] })[];
}

const SeriesListItem = ({ series, editable, isLoading, isEditing, seriesActions }: SeriesListItemProps) => {
    const [inputValue, setInputValue] = useState<string>(series.name)
    const [isOpen, setIsOpen] = React.useState(true)

    return (
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full space-y-2"
      >
        <div className="flex items-center justify-between m-0 w-full">
          {editable && series.id !== '-1' ? (
            <div className="flex items-center justify-between w-full space-x-2">
              {isEditing ? (
              <Input
                type="text"
                name="seriesName"
                value={inputValue}
                autoFocus
                disabled={isLoading}
                onChange={(e) => setInputValue(e.target.value)}
                className="px-1 border-0"
              />
              ): (<span className="px-1">{series.name}</span>)}
              <div className="flex space-x-1">
                {isEditing ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setInputValue(inputValue.trim().replace(/\s+/g, " "));
                    seriesActions?.handleSubmit(inputValue)}
                  }
                  disabled={isLoading}
                  className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 p-2"
                >
                  <Check className="h-4 w-4" />
                </Button>
                ) : (
                  <Button variant="ghost" onClick={() => seriesActions?.startEditing()} disabled={isLoading} className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 p-2">
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => seriesActions?.deleteSeries()}
                  disabled={isLoading}
                  className="hover:bg-red-200 dark:hover:bg-red-400/50 p-2 text-red-400"
                >
                  <CircleX className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (<span>{series.name}</span>)
          }
          <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 p-2">
            {isOpen ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
        </div>
        <Separator className="w-full bg-border h-px" />
        <CollapsibleContent className="space-y-2">
          {editable ? (
            <BookListDashboard books={series.books}/>
          ) : (
            <BookListPublic books ={series.books}/>
          )}
        </CollapsibleContent>
      </Collapsible>
    )
}

const SeriesListPublic = ({ serieslist }: SeriesListProps) => {
  return (
    <div className="grid w-full  gap-4">
      {serieslist.map((series, index) => (
        <SeriesListItem series={series} key={index}/>
      ))}
    </div>
  )
}

const SeriesListDashboard = ({ serieslist }: SeriesListProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {setSeries} = useDashboardContext();

  const finishEditing = () => {
    setIsLoading(false);
    setEditingIndex(null);
  }

  const handleSubmit = (index: number, newValue: string) => {
    const name = newValue.trim().replace(/\s+/g, " ");
    const id = serieslist[index].id;
    if (id == '-1') return;
    if (name !== "" && serieslist[index].name !== name) {
      setIsLoading(true);
      toast.promise(
        (async () => {
            const result = await updateSeries({
                id: id,
                name: name,
            });
            if (result.status !== 200) {
                throw new Error(result.message)
            }
        })(),
        {
          loading: "Loading...",
          success: () => {
            const updatedSeries = [...serieslist];
            updatedSeries[index] = {
              ...updatedSeries[index],
              name: name,
            };
            setSeries(updatedSeries);
            return `Book information edited successfully`;
          },
          error: (error) => {
            return error.message || "Something went wrong";
          },
          finally: () => {
            
            finishEditing();
          }
        }
      );
    }
  };

  const handleDelete = (index: number) => {
    //TODO: server action 
    const id = serieslist[index].id;
    if (id == '-1') return;
    setIsLoading(true);
    toast.promise(
      (async () => {
          const result = await deleteSeries(id);
          if (result.status !== 200) {
              throw new Error(result.message)
          }
      })(),
      {
        loading: "Loading...",
        success: () => {
          // add all books in that series to ungrouped
          const ungroupedBooks = serieslist[index].books
          const updatedSeries = [...serieslist];
          updatedSeries.splice(index, 1);
          updatedSeries[-1].books.push(...ungroupedBooks)
          setSeries(updatedSeries);
          return `Series deleted successfully`;
        },
        error: (error) => {
          return error.message || "Something went wrong";
        },
        finally: () => {
          finishEditing();
        }
      }
    );
  }

  return (
    <div className="grid w-full  gap-4">
      {serieslist.map((series, index) => (
        <SeriesListItem
          series={series}
          key={index}
          editable={true}
          isLoading={isLoading}
          isEditing={editingIndex === index}
          seriesActions={{
            finishEditing: () => setEditingIndex(null),
            handleSubmit: (newValue) => handleSubmit(index, newValue),
            startEditing: () => setEditingIndex(index),
            deleteSeries: () => handleDelete(index),
          }}
        />
      ))}
    </div>
  )
}

export { SeriesListDashboard, SeriesListPublic }