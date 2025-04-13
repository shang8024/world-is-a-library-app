"use client"
import React from 'react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookSchema } from '@/utils/zod/book-schema'
import {toast} from 'sonner'
import "@/app/globals.css"
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Label } from "@/components/ui/label"
import CardWrapper from '../CardWrapper'
interface Book {
    id?: string,
    title: string,
    isdraft: boolean,
}

function BookForm({book, action} : {book?: Book, action: (values: z.infer<typeof BookSchema>, callback: () => void) => void}) {
    const [loading, setLoading] = useState(false)
    const form = useForm<z.infer<typeof BookSchema>>({
        resolver: zodResolver(BookSchema),
        defaultValues: {
            title: book?.title || "",
        }
    })
    const onSubmit = async (values: z.infer<typeof BookSchema>) => {
        setLoading(true)
        action(values, () => setLoading(false))
    }

    return (
        <Form {...form}>
            <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={loading}
                                        type="text"
                                        placeholder='Enter book title'
                                        {...field}
                                        className='p-2'
                                    />
                                </FormControl>
                                <FormMessage>{field.value.length}/255
                                </FormMessage>
                            </FormItem>
                        )}
                    />
                        <Button disabled={loading} type="submit" className='p-2 bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-[3px] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none' >create book</Button>
                </form>
        </Form>
    )
}

//TODO: make this a modal

function CreateBookForm() {
    const [isPending, startTransition] = useTransition();
    const handleAction = async (values : z.infer<typeof BookSchema>, callback: () => void) => {
        startTransition(async () => {
            try {
                // TODO: server action to create book
                console.log("Creating book", values)
                callback()
                toast.success("Book created successfully")
            } catch {
                toast.error("Something went wrong")
            }
        });
    };
    return (
        <CardWrapper
            cardTitle='Create Book'>
                <BookForm
                    action={handleAction}
                />
        </CardWrapper>
 );
}

function EditBookForm({book} : {book: Book}) {
    const [isPending, startTransition] = useTransition();
    const [message,setMessage] = useState<{status: string, content: string} | null>(null)
    const handleAction = async (values : z.infer<typeof BookSchema>, callback: () => void) => {
        startTransition(async () => {
            try {
                // TODO: server action to update book
                console.log("Updating book", values)
                callback()
                toast.success("Book info updated successfully")
            } catch {
                toast.error("Something went wrong")
            }
        });
    }
    return (
        <CardWrapper
            cardTitle='Edit Book'>
                <BookForm
                    book={book}
                    action={handleAction}
                />
        </CardWrapper>
    )
}

export default CreateBookForm