"use client"
import React from 'react'
import { Card, } from "@/components/ui/card"
import { Book } from "@prisma/client"
import Image from "next/image"
// import publicFile from "@/public/file.svg"
const placeholderImage = "/file.svg"
interface BookCardProps {
    book: Book,
    onClick?: () => void,
}

export function BookCard({book, onClick}: BookCardProps) {
    return (
      <Card className="w-full h-full rounded-md">
        <div className="w-full h-full aspect-w-4 aspect-h-5 relative">
          <Image
            src={book.coverImage || placeholderImage}
            alt={book.title}
            fill
            className="object-cover rounded-t-lg"
            style={{ aspectRatio: "400/500", objectFit: "cover" }}
          />
        </div>
      </Card>
    )
}