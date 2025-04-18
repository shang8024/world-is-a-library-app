"use server"
import prisma from "@/db"
import { getValidatedSession } from "@/lib/auth/auth-actions"
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
        const session = await getValidatedSession()
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
        if (err instanceof Error && err.message === "UNAUTHORIZED") {
            return { status: 401, message: "Session expired, Please login again" };
        }
        return {
            status: 500,
            message: "Error fetching chapters",
        }
    }
}

export async function fetchChapter(chapterId: string): Promise<ActionResult<Chapter>> {
    try {
        const session = await getValidatedSession()
        const chapter = await prisma.chapter.findUnique({
            where: { id: chapterId },
        })
        if (!chapter) {
            return {
                status: 404,
                message: "Book not found",
            }
        }
        if (chapter.authorId !== session.user.id) {
            return {
                status: 403,
                message: "Unauthorized access",
            }
        }
        return {
            status: 200,
            data: chapter,
        }
    } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHORIZED") {
            return { status: 401, message: "Session expired, Please login again" };
        }
        return {
            status: 500,
            message: "Error fetching chapter",
        }
    }
}

export async function createChapter(bookId: string): Promise<ActionResult<Chapter>> {
    try {
        const session = await getValidatedSession()
        const chapter = await prisma.chapter.create({
            data: {
                title: "New Chapter",
                isPublic: false,
                content: "",
                wordCount: 0,
                bookId: bookId,
                authorId: session.user.id,
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
        if (err instanceof Error && err.message === "UNAUTHORIZED") {
            return { status: 401, message: "Session expired, Please login again" };
        }
        return {
            status: 500,
            message: "Error fetching chapters",
        }
    }
}