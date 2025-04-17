"use client"
import React from 'react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookSchema } from '@/utils/zod/book-schema'
import {toast} from 'sonner'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea'
import * as Switch from "@radix-ui/react-switch";
import CardWrapper from '../CardWrapper'
import { createBook, updateBook } from '@/lib/book/book-actions'
import { useDashboardContext } from '@/hooks/useDashboardContext'
interface Book {
    id?: string,
    title: string,
    description?: string,
    isPublic: boolean,
    seriesId?: string,
}

function BookForm({book, action}: {book?: Book, action: (values: z.infer<typeof BookSchema>, callback: () => void) => void}) {
    const {serieslist} = useDashboardContext()
    const [loading, setLoading] = useState(false)
    const form = useForm<z.infer<typeof BookSchema>>({
        resolver: zodResolver(BookSchema),
        defaultValues: {
            title: book?.title || "",
            isPublic: book?.isPublic || false,
            description: book?.description || "",
            series: book?.seriesId || "-1",
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
                                <FormMessage className='text-sm'>
                                    {field.value.length}/255
                                </FormMessage>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    id="label-demo-message" 
                                    placeholder="Message"
                                    className="resize-none p-2"
                                    disabled={loading}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className='text-sm'>
                                    {field.value.length}/1000
                                </FormMessage>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="series"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Series</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className='w-full p-2'>
                                            <SelectValue placeholder="Select a verified email to display" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className='bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md'>
                                        {serieslist.map((series,index) => (
                                            <SelectItem key={index} value={series.id} className='p-2 w-full'>
                                                {series.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className='text-sm'>
                                    {field.value.length}/255
                                </FormMessage>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isPublic"
                        render={({ field }) => (
                            <FormItem className='flex items-center space-x-2'>
                                <FormControl>
                                  <Switch.Root
                                    className="relative h-[20px] w-9 cursor-default rounded-full outline-none focus-visible:ring-[3px]  data-[state=checked]:bg-primary data-[state=unchecked]:bg-input  disabled:cursor-not-allowed disabled:opacity-50"
                                    id="airplane-mode"
                                    disabled={loading}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    ref={field.ref}
                                  >
                                    <Switch.Thumb 
                                      className="block size-4 translate-x-0.5 rounded-full bg-background dark:data-[state=checked]:bg-primary-foreground transition-transform duration-100 focus-visible:border-ring focus-visible:ring-ring/50 will-change-transform data-[state=checked]:translate-x-[calc(100%+2px)]"
                                    />
                                  </Switch.Root>
                                </FormControl>
                                <FormLabel className='text-sm'>Make it public</FormLabel>
                            </FormItem>
                        )}
                    />
                    <div className='flex justify-end items-center space-x-2'>
                    <Button disabled={loading} type="submit" className='p-2 bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-[3px] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none' >save cahnges</Button>
                    </div>
                </form>
        </Form>
    )
}

//TODO: make this a modal

function CreateBookForm() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter()
    const handleAction = async (values : z.infer<typeof BookSchema>, callback: () => void) => {
        startTransition(async () => {
            toast.promise(
                (async () => {
                    const result = await createBook({
                        title: values.title,
                        description: values.description,
                        isPublic: values.isPublic,
                        seriesId: (values.series === "-1" ? null : values.series),
                    });
                    if (result.status !== 200) {
                        throw new Error(result.message)
                    }
                    return result
                })(),
                {
                  loading: "Loading...",
                  success: (data) => {
                    setTimeout(() => {
                        router.push("/dashboard?refresh=1");
                    }, 500);
                    return `Book created successfully`;
                  },
                  error: (error) => {
                    return error.message || "Something went wrong";
                  },
                  finally: () => {
                    callback();
                  }
                }
              );
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

function EditBookInfoForm({book} : {book: Book}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter()
    const handleAction = async (values : z.infer<typeof BookSchema>, callback: () => void) => {
      const seriesId = (values.series === "-1" ? null : values.series)
      if (book.description === values.description && book.isPublic === values.isPublic && book.seriesId === seriesId && book.title === values.title) {
        toast.error("No changes made")
        callback()
        setTimeout(() => {
            router.push("/dashboard");
        }, 500);
        return
      }
        
      startTransition(async () => {
          toast.promise(
              (async () => {
                  const result = await updateBook({
                      id: book.id,
                      title: values.title,
                      description: values.description,
                      isPublic: values.isPublic,
                      seriesId: (values.series === "-1" ? null: values.series),
                  });
                  if (result.status !== 200) {
                      throw new Error(result.message)
                  }
                  return result
              })(),
              {
                loading: "Loading...",
                success: (data) => {
                  setTimeout(() => {
                      router.push("/dashboard?refresh=1");
                  }, 500);
                  return `Book information edited successfully`;
                },
                error: (error) => {
                  return error.message || "Something went wrong";
                },
                finally: () => {
                  callback();
                }
              }
            );
      });
  };
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

export { CreateBookForm, EditBookInfoForm };