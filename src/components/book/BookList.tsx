import * as React from "react"
import { Book } from "@prisma/client"
import {toast} from 'sonner'
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { BookCard } from "@/components/book/BookCard"

interface BookListProps {
  books: Book[];
  editable?: boolean;
}

const BookList = ({ books, editable }: BookListProps) => {
  console.log("books", books)
  return (
    <div className="flex flex-wrap gap-4 w-full">
      {books.map((book) => (
        <div key={book.id} className="w-[120px] h-[160px]">
        <BookCard book={book}/>
        </div>
      ))}
    </div>
  )
}

export { BookList }