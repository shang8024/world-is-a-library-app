"use server"
import prisma from "@/db"
import {auth} from "@/lib/auth/auth"
import { Prisma } from '@prisma/client'
import { headers } from "next/headers"
// impoet Book from prisma/book
import { Series,Book } from "@prisma/client"

type SeriesForm = {
    id?: string,
    name: string,
}

export type ActionResult<T = void> = {
    status: number
    message?: string
    data?: T
  }

export async function fetchSerieswithBooks(): Promise<ActionResult<(Series & { books: Book[] })[]>> {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (!session) {
            return {
                status: 401,
                message: "Session expired, Please login again",
            }
        }
              
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
        return {
            status: 500,
            message: "Error fetching series",
        }
    }
}

export async function createSeries(data: SeriesForm): Promise<ActionResult<Series>> {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (!session) {
            return {
                status: 401,
                message: "Session expired, Please login again",
            }
        }
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
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (!session) {
            return {
                status: 401,
                message: "Session expired, Please login again",
            }
        }
        const series = await prisma.series.findFirst({
            where: {
                id: data.id,
                authorId: session.user.id,
            },
        })
        if (!series) {
            return {
                status: 403,
                message: "UNauthorized action",
            }
        }
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
        // TODO: check if such book exist with the author, if not
        // user logged in a different account, expire the session and require login again
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
        const session = await auth.api.getSession({
            headers: await headers()
        });
        if (!session) {
            return {
                status: 401,
                message: "Session expired, Please login again",
            };
        }
        const series = await prisma.series.findFirst({
            where: {
                id: id,
                authorId: session.user.id,
            },
        });
        if (!series) {
            return {
                status: 403,
                message: "Unauthorized action",
            };
        }
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