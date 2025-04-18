"use server"
import prisma from "@/db"
import {auth} from "@/lib/auth/auth"
import { Prisma } from '@prisma/client'
import { headers } from "next/headers"
import { Book, Chapter } from "@prisma/client"

type ChaptersForm = {
    id?: string,
    title: string,
    isPublic: boolean,
    content: string,
    bookId: string,
    wordCount: number,
}

type ChapterIndex = {
    id: string,
    title: string,
    isPublic: boolean,
    wordCount: number,
}


export type ActionResult<T = void> = {
    status: number
    message?: string
    data?: T
}

export async function fetchChaptersIndex(bookId: string): Promise<ActionResult<Book & { chapters: ChapterIndex[] }>> {
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
        const chaptersIndex = await prisma.book.findUnique({
            where: { id: bookId },
            include: {
                chapters: {
                    select: {
                        id: true,
                        title: true,
                        isPublic: true,
                        wordCount: true,
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        })
        if (!chaptersIndex) {
            return {
                status: 404,
                message: "Book not found",
            }
        }
        if (chaptersIndex.authorId !== session.user.id) {
            return {
                status: 403,
                message: "Unauthorized access",
            }
        }
        return {
            status: 200,
            data: chaptersIndex,
        }
    } catch (err) {
        return {
            status: 500,
            message: "Error fetching chapters",
        }
    }
}

export async function fetchChapter(chapterId: string): Promise<ActionResult<Chapter>> {
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
        const chaptersIndex = await prisma.chapter.findUnique({
            where: { id: chapterId },
        })
        if (!chaptersIndex) {
            return {
                status: 404,
                message: "Book not found",
            }
        }
        if (chaptersIndex.authorId !== session.user.id) {
            return {
                status: 403,
                message: "Unauthorized access",
            }
        }
        return {
            status: 200,
            data: chaptersIndex,
        }
    } catch (err) {
        return {
            status: 500,
            message: "Error fetching chapters",
        }
    }
}