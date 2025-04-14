import * as React from "react"
import { ChevronsUp, ChevronsDown } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"



type Book = {
  id: string,
  title: string,
  isdraft: boolean,
}

interface BookCardProps {
    book: Book,
    onClick: () => void,
    children: React.ReactNode,
}

interface BookListProps {
    name: string;
}
type SeriesProps  = {name:string, books: BookListProps[]};
interface SeriesListProps {
    serieslist: SeriesProps[];
}

const BookList = ({ books }: BookListProps) => {
  return (
    <div className="grid w-full max-w-xl gap-4">
      {books.map((book, index) => (
        <Button key={index} variant="outline" className="w-full" onClick={() => console.log(book)}>
          {book.name}
        </Button>
      ))}
    </div>
  )
}

const SeriesList = ({serieslist}: SeriesListProps) => {
    console.log("serieslist", serieslist)
  return (
    <div className="grid w-full max-w-xl gap-4">
      <Accordion type="multiple" collapsible="true" className="w-full">
      {serieslist.map((series, index) => (
        <AccordionItem key={index} value={series.name}>
          <AccordionTrigger>{series.name}</AccordionTrigger>
          <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
         </AccordionContent>
        </AccordionItem>
      ))}</Accordion>
    </div>
  )
}

export { SeriesList }