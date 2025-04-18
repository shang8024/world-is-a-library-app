"use server"
import prisma from "@/db"
import { Prisma } from '@prisma/client'
import { Series,Book } from "@prisma/client"
import { getValidatedSession } from "@/lib/auth/auth-actions"

type SeriesForm = {
    id?: string,
    name: string,
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

export async function fetchSerieswithBooks(): Promise<ActionResult<(Series & { books: Book[] })[]>> {
    try {
        const session = await getValidatedSession()
        const seriesWithBooks = await prisma.series.findMany({
            where: { authorId: session.user.id },
                orderBy: { createdAt: 'desc' },
                include: {
                  books: { orderBy: { createdAt: 'asc' } },
                },
            })
        
        const ungroupedBooks = await prisma.book.findMany({
            where: {
              authorId: session.user.id,
              seriesId: null,
            },
        })
        const defaultSeires = {
            id: '-1',
            name: 'Ungrouped Books',
            createdAt: new Date(),
            updatedAt: new Date(),
            authorId: session.user.id,
            books: ungroupedBooks || [],
        } as Series & { books: Book[] }
        const seriesWithBooksArray: (Series & { books: Book[] })[] = [...seriesWithBooks];
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