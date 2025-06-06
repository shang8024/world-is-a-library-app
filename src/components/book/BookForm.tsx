/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React from 'react'
import { useTransition } from 'react'
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
import { createBook, updateBook } from '@/lib/book/book-actions'
import { useDashboardContext } from '@/hooks/useDashboardContext'
import { Book } from '@prisma/client'
import Image from 'next/image'
type BookForm = {
    id?: string,
    title: string,
    isPublic: boolean,
    description: string,
    seriesId: string | null,
    image?: string,
}

function BookForm({book, action}: {book?: Book, action: (values: BookForm, callback: () => void) => void}) {
    const {serieslist,isLoading, setLoading} = useDashboardContext()
    const [url, setUrl] = React.useState<string>(book?.coverImage || "/file.svg")
    const [file, setFile] = React.useState<File | null>(null)
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
        action({...values, seriesId: values.series, image: url}, () => setLoading(false))
    }

    const uploadImage = async () => {
        if (!file) {
            toast.error("Please select an image")
            return
        }
        const formData = new FormData();
        formData.append("file", file);
    
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
    
          if (!res.ok) {
            toast.error("Failed to upload file")
          }
    
          const data = await res.json();
          setUrl(data.url);
          toast.success("File uploaded successfully")
        } catch (err) {
          toast.error("Failed to upload file")
          console.error(err);
        }
    }

    return (
        <Form {...form}>
            <form className='space-y-4 w-full h-fit' onSubmit={form.handleSubmit(onSubmit)}>
                <div className='flex flex-wrap space-y-4 gap-8'>
                    <div className='w-full md:flex-1 space-y-4'>
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
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
                                    disabled={isLoading}
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
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
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
                                    disabled={isLoading}
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

                    </div>
                    <div className=' flex flex-col items-center gap-2 md:flex-1 mb-4 w-full'>
                        <div className="relative w-[200px] h-[250px]">
                            <Image
                                src={url}
                                alt="Book Cover"
                                fill
                                className="object-cover rounded-md"
                            />
                        </div>
                        <div>
                            <Input 
                                type="file"
                                accept="image/*" 
                                id="file-upload"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                            <Button
                                variant="outline" 
                                className='w-full' 
                                onClick={(e) => {
                                    e.preventDefault()
                                    uploadImage()
                                }}
                                disabled={isLoading}
                            >
                                Upload
                            </Button>
                        </div>
                    </div>
                </div>
                <div className='flex justify-end items-center space-x-2 w-[50%]'>
                    <Button disabled={isLoading} type="submit" className='p-2 bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-[3px] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none' >save cahnges</Button>
                </div>
            </form>
        </Form>
    )
}

//TODO: make this a modal

function CreateBookForm() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter()
    const handleAction = async (values : BookForm, callback: () => void) => {
        startTransition(async () => {
            toast.promise(
                (async () => {
                    const result = await createBook({
                        title: values.title,
                        description: values.description,
                        isPublic: values.isPublic,
                        seriesId: (values.seriesId === "-1" ? null : values.seriesId),
                        image: values.image,
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
        <div className='w-full justify-center flex min-h-full p-6 md:p-10'>
                <BookForm
                    action={handleAction}
                />
        </div>
 );
}

function EditBookInfoForm({book} : {book: Book}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter()
    const handleAction = async (values: BookForm, callback: () => void) => {
      const seriesId = (values.seriesId === "-1" ? null : values.seriesId)
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
                      seriesId: seriesId,
                      image: values.image,
                  });
                  if (result.status !== 200) {
                      throw new Error(result.message)
                  }
                  return result
              })(),
              {
                loading: "Loading...",
                success: () => {
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
        <div className='flex min-h-full items-center justify-center p-6 md:p-10 w-full'>
                <BookForm
                    book={book}
                    action={handleAction}
                />
        </div>
    )
}

export { CreateBookForm, EditBookInfoForm };