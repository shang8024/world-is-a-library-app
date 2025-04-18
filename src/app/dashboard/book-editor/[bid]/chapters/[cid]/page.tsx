"use client"
import { useEditorContext } from '@/hooks/useEditorContext'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { fetchChapter } from '@/lib/book/chapters-actions'
import { Chapter } from '@prisma/client'
import Loading from '@/components/Loading'
import ChapterEditor from '@/components/editor/ChapterEditor'
import { EditorState} from 'lexical'

export default function ChapterEditorPage() {
  const {cid} = useParams()
  const {setCurChapter} = useEditorContext()
  const [fetching, setFetching] = useState(false)
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

  const onContentChange = (editorState: EditorState) => {
    // handle editor state change
    console.log('Editor state changed:', editorState)
  }

  const onError = (error: Error) => {
    // handle error
    console.error('Editor error:', error)
  }


  if (fetching) return <Loading />
  if (error) return <div className="text-red-500">{error}</div>
  return (
    <div className="min-h-full w-full items-start justify-start p-6 md:p-10">
        <div className="w-full max-w-sm">
            <h1 className="text-2xl font-bold">Chapter Editor</h1>
            <p className="text-gray-500">Editing chapter: {chapter?.title}</p>
        </div>
      <ChapterEditor onChange={onContentChange} onError={onError} initialState={null}/>
    </div>
  )
}