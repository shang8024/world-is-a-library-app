import { CreateBookForm } from '@/components/book/BookForm'
import React from 'react'

const CreateBookPage = () => {
  return (
    <div className="flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <CreateBookForm/>
      </div>
    </div>
  )
}



export default CreateBookPage