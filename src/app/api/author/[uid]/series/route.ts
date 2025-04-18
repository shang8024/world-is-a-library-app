import prisma from '@/db'
import {Series, Book} from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { uid: string } }) {
    const {uid} = await params;
    const user = await prisma.user.findUnique({
        where: { username: uid },
        select: { id: true },
    })
      
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
      
    const seriesWithBooks = await prisma.series.findMany({
        where: { authorId: user.id },
        orderBy: { createdAt: 'desc' },
        include: {
          books: {
            where: { isPublic: true }, 
            orderBy: { createdAt: 'asc' } 
          },
        },
    })

  const ungroupedBooks = await prisma.book.findMany({
    where: {
      authorId: user.id,
      seriesId: null,
      isPublic: true,
    },
  })
  const defaultSeires = {
    id: '-1',
    name: 'Ungrouped Books',
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: user.id,
    books: ungroupedBooks,
  } as Series & { books: Book[] }
  const seriesWithBooksArray = [...seriesWithBooks];
  seriesWithBooksArray.push(defaultSeires);
  const series = seriesWithBooksArray;
  return NextResponse.json(series, { status: 200 })
}
