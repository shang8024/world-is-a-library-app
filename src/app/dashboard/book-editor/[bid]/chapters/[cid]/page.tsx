"use client"
import { useEditorContext } from '@/hooks/useEditorContext'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { fetchChapter, updateChapter } from '@/lib/book/chapters-actions'
import { Chapter } from '@prisma/client'
import Loading from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChapterSchema } from '@/utils/zod/chapter-schema'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import * as Switch from '@radix-ui/react-switch'
import { useForm } from 'react-hook-form'

function ChapterForm({chapter}: {chapter: Chapter}) {
  const {isLoading, setLoading, chapters, setChapters} = useEditorContext()
  const [lastUpdate, setLastUpdate] = useState<Date>(chapter.updatedAt)
  const router = useRouter()
  const form = useForm<z.infer<typeof ChapterSchema>>({
    resolver: zodResolver(ChapterSchema),
      defaultValues: {
        title: chapter?.title || "",
        isPublic: chapter?.isPublic || false,
        content: chapter?.content || "",
      }
  })
  const onSubmit = async (values: z.infer<typeof ChapterSchema>) => {
    // check if anythong changed
    if (values.title === chapter.title && values.content === chapter.content && values.isPublic === chapter.isPublic) {
      toast.error('Nothing changed')
      return
    }
    setLoading(true)
    toast.promise(
      (async () => {
        const result = await updateChapter({
          id: chapter.id,
          title: values.title,
          content: values.content,
          isPublic: values.isPublic,
          wordCount: values.content.split.length,
        })
        if (result.status !== 200 || !result.data) throw new Error(result.message)
        return result.data
      })(),
      {
        loading: 'Saving...',
        success: (data) => {
          const index = chapters.findIndex((chapter) => chapter.id === data.id)
          const updatedChapters = [...chapters]
          updatedChapters[index] = data
          setChapters(updatedChapters)
          setLastUpdate(data.updatedAt)
          router.refresh()
          return `Changes saved successfully`
        },
        error: (err) => {
          return err.message || 'Something went wrong'
        },
        finally: () => {
          setLoading(false)
        }
      }
    )
  }
  return (
    <Form {...form}>
      <form className='w-full p-2 space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <div className="h-full w-full gap-2 flex flex-col">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem className='w-full'>
                    <FormControl>
                        <Textarea
                            id="label-demo-title" 
                            placeholder="Chapter Title"
                            className="min-w-full h-2 resize-none p-4 wrap-anywhere"
                            maxLength={255}
                            aria-setsize={255}
                            disabled={isLoading}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage className={field.value.length > 255 ? 'text-red-500 text-sm' : 'text-sm'}>
                        {field.value.length}/255
                    </FormMessage>
                </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
                <FormItem className='flex-1 w-full flex flex-col'>
                    <FormControl>
                      <Textarea 
                        id="label-demo-message" 
                        placeholder="Start writing your chapter here..."
                        className=" resize-none p-4 overflow-scroll flex-1"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className={field.value.length > 100000 ? 'text-red-500 text-sm h-[20px]' : 'text-sm h-[20px]'}>
                        {field.value.length}/100000
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
          <div className='flex justify-end items-center space-x-2'>
            <div className='flex flex-col' >
              <Button variant="outline" type='submit' className="text-green-500 hover:bg-green-200 dark:hover:bg-green-400/50 p-2" disabled={isLoading}>
                Save
              </Button>
              <p className='text-sm text-center text-gray-500'>Updated {lastUpdate.toLocaleDateString()} {lastUpdate.toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}




export default function ChapterEditorPage() {
  const {cid} = useParams()
  const {setCurChapter} = useEditorContext()
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chapter, setChapter] = useState<Chapter | null>(null)
  useEffect(() => {
    if (!cid) return
    setFetching(true)
    setError(null)
    setCurChapter(cid as string)
    fetchChapter(cid as string)
      .then((res) => {
        if (res.status !== 200 || !res.data) throw new Error(res.message)
        return res.data
      })
      .then((data) => {
        setChapter(data)
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong')
      })
      .finally(() => {
        setFetching(false)
      })
  }, [cid, setCurChapter])

  if (fetching) return <Loading />
  if (error) return <div className="text-red-500">{error}</div>
  return (
    <div className="min-h-full flex flex-col w-full items-start justify-start p-6 md:p-10">
        <div className="w-full flex justify-between items-center">
            <h1 className="text-2xl font-bold">Chapter Editor</h1>
        </div>
        <div className="w-full flex-1 flex flex-start min-h pb-10">
          <ChapterForm chapter={chapter as Chapter} />
        </div>
    </div>
  )
}