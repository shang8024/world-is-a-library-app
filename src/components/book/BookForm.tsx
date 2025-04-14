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
import { Textarea } from '@/components/ui/textarea'
import * as Switch from "@radix-ui/react-switch";
import CardWrapper from '../CardWrapper'
import { createBook } from '@/lib/book/book-actions'
interface Book {
    id?: string,
    title: string,
    description?: string,
    isdraft: boolean,
}

function BookForm({book, action} : {book?: Book, action: (values: z.infer<typeof BookSchema>, callback: () => void) => void}) {
    const [loading, setLoading] = useState(false)
    const form = useForm<z.infer<typeof BookSchema>>({
        resolver: zodResolver(BookSchema),
        defaultValues: {
            title: book?.title || "",
            isdraft: book?.isdraft || false,
            description: book?.description || "",
        }
    })
    const onSubmit = async (values: z.infer<typeof BookSchema>) => {
      console.log(values)
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
                                <FormMessage>
                                    {field.value.length}/1000
                                </FormMessage>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isdraft"
                        render={({ field }) => (
                            <FormItem className='flex items-center space-x-2'>
                                <FormControl>
                                  <Switch.Root
                                    className="relative h-[1.15rem] w-8 cursor-default rounded-full outline-none focus-visible:ring-[3px]  data-[state=checked]:bg-primary data-[state=unchecked]:bg-input  disabled:cursor-not-allowed disabled:opacity-50"
                                    id="airplane-mode"
                                    disabled={loading}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    ref={field.ref}
                                  >
                                    <Switch.Thumb 
                                      className="block size-4 translate-x-0.5 rounded-full bg-background dark:data-[state=checked]:bg-primary-foreground transition-transform duration-100 focus-visible:border-ring focus-visible:ring-ring/50 will-change-transform data-[state=checked]:translate-x-[calc(100%-2px)]"
                                    />
                                  </Switch.Root>
                                </FormControl>
                                <FormLabel className='text-sm'>Make it public</FormLabel>
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
    const router = useRouter()
    const handleAction = async (values : z.infer<typeof BookSchema>, callback: () => void) => {
        startTransition(async () => {
            toast.promise(
                (async () => {
                    const result = await createBook({
                        title: values.title,
                        description: values.description,
                        isdraft: values.isdraft,
                    });
                    if (result.status !== 200) {
                        throw new Error(result.message)
                    }
                })(),
                {
                  loading: "Loading...",
                  success: () => {
                    setTimeout(() => {
                        router.push("/dashboard");
                    }, 1000);
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
      startTransition(async () => {
          toast.promise(
              (async () => {
                  const result = await createBook({
                      title: values.title,
                      description: values.description,
                      isdraft: values.isdraft,
                  });
                  if (result.status !== 200) {
                      throw new Error(result.message)
                  }
              })(),
              {
                loading: "Loading...",
                success: () => {
                  setTimeout(() => {
                      router.push("/dashboard");
                  }, 1000);
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