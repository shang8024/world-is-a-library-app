"use client"
import { EditBookInfoForm } from '@/components/book/BookForm'
import Loading from '@/components/Loading'
import { useDashboardContext } from '@/hooks/useDashboardContext'
import {useParams} from 'next/navigation'
import React from 'react'
import { Suspense } from 'react'

const EditBookInfoPage = () => {
 // get param bid from url
  const { bid } = useParams() as { bid: string }
  const { serieslist} = useDashboardContext()
  const book = serieslist?.flatMap((series) => series.books).find((book) => book.id === bid)
  if (!book) {
    return (
      <div className="flex min-h-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold">Book not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-full  p-6 md:p-10">
      <Suspense fallback={<Loading />}>
        <EditBookInfoForm book={{ ...book, seriesId: book.seriesId ?? null }} />
      </Suspense>
    </div>
  )
}



export default EditBookInfoPage