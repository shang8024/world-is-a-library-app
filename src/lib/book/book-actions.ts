"use server"
import prisma from "@/db"
import {auth} from "@/lib/auth/auth"
import { Prisma } from '@prisma/client'
import { headers } from "next/headers"
import { Book } from "@prisma/client"

type BookForm = {
    id?: string,
    title: string,
    isPublic: boolean,
    description: string,
    seriesId: string | null,
}

export type ActionResult<T = void> = {
    status: number
    message?: string
    data?: T
  }

export async function createBook(data: BookForm): Promise<ActionResult<Book>> {
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
        // TODO (optional): create a book, if this is the first book created, crate a default series
        // if find default series, create a book in that series
        let seriesId = data.seriesId || null
        if (seriesId) {
            const series = await prisma.series.findFirst({
                where: {
                    id: seriesId,
                    authorId: session.user.id,
                },
            })
            if (!series || series.authorId !== session.user.id) {
                seriesId = null
            }
        }
        // TODO: create a book in the database, if such name and author not unique, throw error
        const book = await prisma.book.create({
            data: {
                title: data.title,
                description: data.description || "",
                isPublic: data.isPublic,
                authorId: session.user.id,
                seriesId: seriesId,
            },
        })
        return {
            status: 200,
            data: book,
        }
    } catch (err) {
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

export async function updateBook(data: BookForm): Promise<ActionResult<Book>> {
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

        const book = await prisma.book.findFirst({
            where: {
                id: data.id,
                authorId: session.user.id,
            },
        })
        if (!book || book.authorId !== session.user.id) {
            return {
                message: "Unauthorized action", 
                status: 403,
            }
        }
        let seriesId = data.seriesId || null
        if (seriesId) {
            const series = await prisma.series.findFirst({
                where: {
                    id: seriesId,
                    authorId: session.user.id,
                },
            })
            if (!series || series.authorId !== session.user.id) {
                seriesId = null
            }
        }
        const res = await prisma.book.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                description: data.description || "",
                isPublic: data.isPublic,
                seriesId: data.seriesId || null,
            },
        })
        return {
            status: 200,
            data: res,
        }
    } catch (err) {
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
        const session = await auth.api.getSession({
            headers: await headers()
        });
        if (!session) {
            return {
                status: 401,
                message: "Session expired, Please login again",
            };
        }
        const book = await prisma.book.findFirst({
            where: {
                id: bid,
                authorId: session.user.id,
            },
        })
        if (!book) {
            return {
                status: 403,
                message: "Unauthorized action",
            }
        }
        await prisma.book.delete({
            where: {
                id: bid,
            },
        });
        return {
            status: 200,
        }
    } catch (err) {
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
