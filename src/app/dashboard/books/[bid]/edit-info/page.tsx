import { EditBookInfoFrom } from '@/components/books/BookForm'
import {useParams} from 'next/navigation'
import React from 'react'
import { Suspense } from 'react'

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

const EditBookInfoPage = () => {
 // get param bid from url
  const { bid } = useParams() as { bid: string }
  const res = await fetch(`${baseUrl}/api/books/${bid}`);

  return (
    <div className="flex min-h-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div>Loading...</div>}>
            <EditBookInfoFrom bid={bid}/>
        </Suspense>
      </div>
    </div>
  )
}



export default EditBookInfoPage