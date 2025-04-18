import prisma from '@/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ uid: string } >}) {
    const {uid} = await params;
    // count sats, include books count, chapter count, word count, and series count

    const user = await prisma.user.findUnique({
        where: { username: uid },
        select: { id: true },
    })
      
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const booksCount = await prisma.book.count({
        where: { authorId: user.id },
    })
    const chaptersCount = await prisma.chapter.count({
        where: { authorId: user.id },
    })
    const wordsCount = await prisma.chapter.aggregate({
        where: { authorId: user.id },
        _sum: {
            wordCount: true,
        },
    })
    const words = wordsCount._sum.wordCount || 0;
    const likesCount = await prisma.bookmark.count({
        where: { book: { authorId: user.id } },
    })
    const commentsCount = await prisma.review.count({
        where: { chapter: {authorId: user.id } },
    })
    const stats = {
        booksCount,
        chaptersCount,
        wordsCount: words,
        likesCount,
        commentsCount,
    }
    return NextResponse.json(stats, { status: 200 })
}
