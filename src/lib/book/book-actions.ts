"use server"
import prisma from "@/db"
import { Prisma } from '@prisma/client'
import { Book } from "@prisma/client"
import { getValidatedSession } from "@/lib/auth/auth-actions"

type BookForm = {
    id?: string,
    title: string,
    isPublic: boolean,
    description: string,
    seriesId: string | null,
    image?: string,
}

export type BookInfo = Book & {
    author?: {
        username: string | null
        name: string | null
    }
    _count?: {
        chapters: number
    },
    series?: {
        id: string
        name: string
    }
}

export type ActionResult<T = void> = {
    status: number
    message?: string
    data?: T
}

export interface bookSearchParams {
    query: string;
    sortBy: 'createdAt' | 'updatedAt' | 'title' | 'wordCount';
    sortDest: 'asc' | 'desc';
    currentPage: number;
}

export async function fetchBooksPages(query:string): Promise<ActionResult<number>> {
    try {
        const pageSize = 10
        const books = await prisma.book.count({
            where: {
              isPublic: true,
              OR: [
                {
                  title: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
                {
                  author: {
                    name: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                },
                {
                  series: {
                    name: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                },
              ],
            },
          });
        const totalPages = Math.ceil(books / pageSize)
        return {
            status: 200,
            data: totalPages as number || 0,
        }
    } catch {
        return {
            status: 500,
            message: "Internal server error",
        }
    }
}

export async function fetchBooks(params: bookSearchParams): Promise<ActionResult<BookInfo[]>> {
    try {
        const { query, sortBy, sortDest, currentPage } = params
        const pageSize = 10
        const skip = (currentPage - 1) * pageSize
        const books = await prisma.book.findMany({
            where: {
              isPublic: true,
              OR: [
                {
                  title: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
                {
                  author: {
                    name: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                },
                {
                  series: {
                    name: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                },
              ],
            },
            orderBy: {
              [sortBy]: sortDest,
            },
            skip,
            take: pageSize,
            include: {
              author: {
                select: {
                  username: true,
                  name: true,
                },
              },
              series: {
                select: {
                  id: true,
                  name: true,
                },
              },
              _count: {
                select: {
                  chapters: true,
                },
              },
            },
          });
        return {
            status: 200,
            data: books as BookInfo[],
        }
    } catch {
        return {
            status: 500,
            message: "Internal server error",
        }
    }
}

const validateSeriesId = async (seriesId: string | null, authorId: string) => {
    if (!seriesId) return null
    const series = await prisma.series.findFirst({
        where: {
            id: seriesId,
            authorId: authorId,
        },
    })
    if (!series || series.authorId !== authorId) {
        return null
    }
    return seriesId
}

export const validateBookId = async (bookId: string | undefined, authorId: string) => {
    if (!bookId) throw new Error("ACCESS_DENIED")
    const book = await prisma.book.findFirst({
        where: {
            id: bookId,
            authorId: authorId,
        },
    })
    if (!book || book.authorId !== authorId) {
        throw new Error("ACCESS_DENIED")
    }
    return book
}

export async function createBook(data: BookForm): Promise<ActionResult<BookInfo>> {
    try {
        const session = await getValidatedSession()
        const seriesId = await validateSeriesId(data.seriesId, session.user.id)
        // TODO: create a book in the database, if such name and author not unique, throw error
        const book = await prisma.book.create({
            data: {
                title: data.title,
                description: data.description || "",
                isPublic: data.isPublic,
                authorId: session.user.id,
                seriesId: seriesId,
                coverImage: data.image || null,
            },
            include: {
                author: {
                    select: {
                        username: true,
                        name: true,
                    },
                },
            }
        })
        return {
            status: 200,
            data: { ...book, wordCount: 0 },
        }
    } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHORIZED") {
            return { status: 401, message: "Session expired, Please login again" };
        }
        if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === 'P2002') {
            return { status: 409, message: 'A book with this name already exists for this author' }
        }
        return {
            status: 500,
            message: "Error creating book",
        }
    }
}

export async function updateBook(data: BookForm): Promise<ActionResult<BookInfo>> {
    try {
        const session = await getValidatedSession();
        await validateBookId(data.id, session.user.id)
        const seriesId = await validateSeriesId(data.seriesId, session.user.id)
        const res = await prisma.book.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                description: data.description || "",
                isPublic: data.isPublic,
                seriesId: seriesId,
                coverImage: data.image || null,
            },
            include: {
                author: {
                    select: {
                        username: true,
                        name: true,
                    },
                },
            }
        })
        return {
            status: 200,
            data: res,
        }
    } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHORIZED") {
            return { status: 401, message: "Session expired, Please login again" };
        }
        if (err instanceof Error && err.message === "ACCESS_DENIED") {
            return { status: 403, message: "Unauthorized action" };
        }
        if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === 'P2002') {
            return { status: 409, message: 'A book with this name already exists for this author' }
        }
        return {
            status: 500,
            message: "Error editing book information",
        }
    }
}

export async function deleteBook(bid: string): Promise<ActionResult> {
    try {
        const session = await getValidatedSession()
        await validateBookId(bid, session.user.id)
        await prisma.book.delete({
            where: {
                id: bid,
            },
        });
        return {
            status: 200,
        }
    } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHORIZED") {
            return { status: 401, message: "Session expired, Please login again" };
        }
        if (err instanceof Error && err.message === "ACCESS_DENIED") {
            return { status: 403, message: "Unauthorized action" };
        }
        if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === 'P2025') {
            return { status: 404, message: 'Book not found' }
        }
        return {
            status: 500,
            message: "Error deleting book",
        }
    }
}
