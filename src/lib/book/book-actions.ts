"use server"
import prisma from "@/db"
import {auth} from "@/lib/auth/auth"
import { Prisma } from '@prisma/client'
import { headers } from "next/headers"

type BookForm = {
    id?: string,
    title: string,
    isdraft: boolean,
    description: string,
}

export type ActionResult<T = void> = {
    status: number
    message?: string
    data?: T
  }

export async function createBook(data: BookForm): Promise<ActionResult> {
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

        // TODO: create a book in the database, if such name and author not unique, throw error
        const book = await prisma.book.create({
            data: {
                title: data.title,
                description: data.description || "",
                isdraft: data.isdraft,
                authorId: session.user.id,
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

export async function updateBook(data: BookForm): Promise<ActionResult> {
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
        const book = await prisma.book.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                description: data.description || "",
                isdraft: data.isdraft,
            },
        })
        return {
            status: 200,
            data: book,
        }
    } catch (err) {
        // TODO: check if such book exist with the author, if not
        // user logged in a different account, expire the session and require login again
        if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === 'P2025') {
            return { status: 404, message: 'Unauthorized action, please login again' }
        }
        return {
            status: 500,
            message: "Error editing book information",
        }
    }
}