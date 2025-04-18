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
    handleSubmit: (newValue: string, callback:()=>void) => void;
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
                    seriesActions?.handleSubmit(inputValue, () => setInputValue(series.name));
                  }}
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
          { !series.books || series.books.length === 0 ? (
            <div className="flex items-center justify-center w-full h-full p-4 text-sm text-muted-foreground">
              No book found
            </div>
          ) : editable ? (
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
  const {setSeries, isLoading, setLoading} = useDashboardContext();

  const finishEditing = () => {
    setLoading(false);
    setEditingIndex(null);
  }

  const handleSubmit = (id: string, newValue: string, callback:()=>void) => {
    const name = newValue.trim().replace(/\s+/g, " ");
    if (id == '-1') return;
    const index = serieslist.findIndex((series) => series.id === id);
    if (name === "" || serieslist[index].name === name) {
      finishEditing();
      callback();

      return;
    }
    console.log("handleSubmit", id, name, serieslist[index].name)
      setLoading(true);
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
            callback();
            return error.message || "Something went wrong";
          },
          finally: () => {
            finishEditing();
          }
        }
      );

  };

  const handleDelete = (id: string) => {
    //TODO: server action 
    if (id == '-1') return;
    const index = serieslist.findIndex((series) => series.id === id);
    setLoading(true);
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
          const ungroupedBooks = serieslist[index]?.books || [];
          const updatedSeries = [...serieslist];
          const ungroupedIndex = updatedSeries.findIndex((series) => series.id === '-1');
          updatedSeries[ungroupedIndex].books.push(...ungroupedBooks);
          updatedSeries.splice(index, 1);
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
      { !serieslist || serieslist.length === 0 ? (
        <div className="flex items-center justify-center w-full h-full p-4 text-sm text-muted-foreground">
          No results found
        </div>
      ) : (
        serieslist.map((series, index) => (
          <SeriesListItem
            series={series}
            key={series.id}
            editable={true}
            isLoading={isLoading}
            isEditing={editingIndex === index}
            seriesActions={{
              finishEditing: () => setEditingIndex(null),
              handleSubmit: (newValue, callback) => handleSubmit(series.id, newValue,callback),
              startEditing: () => setEditingIndex(index),
              deleteSeries: () => handleDelete(series.id),
            }}
          />
        )))
      }
    </div>
  )
}

export { SeriesListDashboard, SeriesListPublic }