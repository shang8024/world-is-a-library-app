import prisma from '@/db';
import {User, Series } from '@prisma/client';
import {fetchSerieswithBooks} from '@/lib/book/series-actions';
import { BookInfo } from '@/lib/book/book-actions';

export type ActionResult<T = void> = {
  status: number
  message?: string
  data?: T
}

export interface UserProfile {
  stats: {
    booksCount: number
    chaptersCount: number
    wordsCount: number
    likesCount: number
    commentsCount: number
  }
  user: User
  serieslist: (Series & { books: BookInfo[] })[]
}

export async function fetchUser(uid: string): Promise<ActionResult<User>> {
  try {
    const user = await prisma.user.findFirst({
      where: { username: uid },
    });
    if (!user) {
      return { status: 404, message: `User not found` };
    }
    return { status: 200, data: user };
  } catch {
    return { status: 500, message: "Error fetching user" };
  }
}

  
export async function fetchUserProfile(uid: string) : Promise<ActionResult<UserProfile>> {
    try {
    const user = await prisma.user.findFirst({
      where: { username: uid },
    });
    if (!user) {
      return { status: 404, message: `User not found` };
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
    const serieslistres = await fetchSerieswithBooks({isPublicOnly: false, uid: user.id})
    if (serieslistres.status !== 200 || !serieslistres.data) {
      return { status: serieslistres.status, message: serieslistres.message };
    }
    const serieslist = serieslistres.data;
    return {
      status: 200,
      data: {
        stats,
        user,
        serieslist,
      },
    };
  } catch {
    return {
      status: 500,
      message: "Error fetching user profile",
    }
  }
}