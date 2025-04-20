"use server"
import prisma from "@/db"
import { Prisma } from '@prisma/client'
import { Series } from "@prisma/client"
import { getValidatedSession } from "@/lib/auth/auth-actions"
import { auth } from "@/lib/auth/auth"
import { headers } from "next/headers"
import {BookInfo} from "@/lib/book/book-actions"

type SeriesForm = {
    id?: string,
    name: string,
}

interface fetchData {
    uid?: string // a dashboard fetch is not user specific
    isPublicOnly: boolean // a dashboard fetch is not user specific
}

export type ActionResult<T = void> = {
    status: number
    message?: string
    data?: T
  }

const validateSeriesId = async (seriesId: string | undefined, authorId: string) => {
    if (!seriesId) throw new Error("ACCESS_DENIED")
    const series = await prisma.series.findFirst({
        where: {
            id: seriesId,
            authorId: authorId,
        },
    })
    if (!series || series.authorId !== authorId) {
        throw new Error("ACCESS_DENIED")
    }
}

export async function fetchSerieswithBooks(data: fetchData): Promise<ActionResult<(Series & { books: BookInfo[] })[]>> {
    try {
        const session = await auth.api.getSession({
              headers: await headers(),
          });
        const uid = data?.uid || session?.user.id || null
        if (!uid) {
            return { status: 401, message: "Session expired, Please login again" };
        }
        const bookFilter = data.isPublicOnly || uid !== session?.user.id ? { isPublic: true } : {}
        const seriesWithBooks = await prisma.series.findMany({
            where: { authorId: uid },
                orderBy: { createdAt: 'desc' },
                include: {
                  books: { 
                    where: bookFilter,
                    orderBy: { createdAt: 'asc' }, 
                    include: {
                        author: {
                            select: {
                                name: true,
                                username: true,
                            },
                        },
                    },
                  },
                },
            })
        
        const ungroupedBooks = await prisma.book.findMany({
            where: {
              authorId: uid,
              seriesId: null,
              ...bookFilter,
            },
            orderBy: { createdAt: 'asc' },
            include: {
                author: {
                    select: {
                        name: true,
                        username: true,
                    },
                },
            },
        })
        const defaultSeires = {
            id: '-1',
            name: 'Ungrouped Books',
            createdAt: new Date(),
            updatedAt: new Date(),
            authorId: uid,
            books: ungroupedBooks || [],
        } as Series & { books: BookInfo[] };
        const seriesWithBooksArray: (Series & { books: BookInfo[] })[] = [...seriesWithBooks];
        seriesWithBooksArray.push(defaultSeires);
        return {
            status: 200,
            data: seriesWithBooksArray,
        }
    } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHORIZED") {
            return { status: 401, message: "Session expired, Please login again" };
        }
        return {
            status: 500,
            message: "Error fetching series",
        }
    }
}

export async function createSeries(data: SeriesForm): Promise<ActionResult<Series>> {
    try {
        const session = await getValidatedSession()
        // TODO: create a series in the database, if such name and author not unique, throw error
        const series = await prisma.series.create({
            data: {
                authorId: session.user.id,
                name: data.name,
            },
        })
        return {
            status: 200,
            data: series,
        }
    } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHORIZED") {
            return { status: 401, message: "Session expired, Please login again" };
        }
        if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === 'P2002') {
            return { status: 409, message: 'A series with this name already exists for this author' }
        }
        return {
            status: 500,
            message: "Error creating book",
        }
    }
}

export async function updateSeries(data: SeriesForm): Promise<ActionResult<Series>> {
    try {
        const session = await getValidatedSession()
        await validateSeriesId(data.id, session.user.id)
        const updated = await prisma.series.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
            },
        })
        return {
            status: 200,
            data: updated,
        }
    } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHORIZED") {
            return { status: 401, message: "Session expired, Please login again" };
        }
        // TODO: check if such book exist with the author, if not
        // user logged in a different account, expire the session and require login again
        if (err instanceof Error && err.message === "ACCESS_DENIED") {
            return { status: 403, message: "Unauthorized action" };
        }
        if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === 'P2002') {
            return { status: 409, message: 'A series with this name already exists for this author' }
        }
        return {
            status: 500,
            message: "Error editing book information",
        }
    }
}

export async function deleteSeries(id: string): Promise<ActionResult> {
    try {
        const session = await getValidatedSession()
        await validateSeriesId(id, session.user.id)
        await prisma.series.delete({
            where: {
                id: id,
            },
        });
        return {
            status: 200,
            message: "Series deleted successfully",
        };
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
            return { status: 404, message: 'Series not found' };
        }
        return {
            status: 500,
            message: "Error deleting series",
        };
    }
}