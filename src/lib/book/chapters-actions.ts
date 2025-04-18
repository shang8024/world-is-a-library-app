"use server"
import prisma from "@/db"
import { getValidatedSession } from "@/lib/auth/auth-actions"
import { Book, Chapter } from "@prisma/client"
import { validateBookId } from "@/lib/book/book-actions"

type ChaptersForm = {
    id: string,
    title: string,
    isPublic: boolean,
    content: string,
    wordCount: number,
}

type ChapterIndex = {
    id: string,
    title: string,
    isPublic: boolean,
    wordCount: number,
    createdAt: Date,
    updatedAt: Date,
}

export type ActionResult<T = void> = {
    status: number
    message?: string
    data?: T
}

const validateChapterId = async (chapterId: string, authorId: string) => {
    if (!chapterId) throw new Error("ACCESS_DENIED")
    const chapter = await prisma.chapter.findFirst({
        where: {
            id: chapterId,
            authorId: authorId,
        },
    })
    if (!chapter || chapter.authorId !== authorId) {
        throw new Error("ACCESS_DENIED")
    }
    return chapter
}


export async function fetchChaptersIndex(bookId: string): Promise<ActionResult<{book:Book, chapters: ChapterIndex[] }>> {
    try {
        const session = await getValidatedSession()
        const chaptersIndex = await prisma.book.findFirst({
            where: { id: bookId },
            include: {
                chapters: {
                    select: {
                        id: true,
                        title: true,
                        isPublic: true,
                        wordCount: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                    orderBy: {
                        sortOrder: "asc",
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
            data: {
                book: chaptersIndex as Book,
                chapters: chaptersIndex.chapters as ChapterIndex[],
            },
        }
    } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHORIZED") {
            return { status: 401, message: "Session expired, Please login again" };
        }
        console.error("Error fetching chapters", err)
        return {
            status: 500,
            message: "Error fetching chapters",
        }
    }
}

export async function fetchChapter(chapterId: string): Promise<ActionResult<Chapter>> {
    try {
        const session = await getValidatedSession()
        const chapter = await validateChapterId(chapterId, session.user.id)
        return {
            status: 200,
            data: chapter,
        }
    } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHORIZED") {
            return { status: 401, message: "Session expired, Please login again" };
        }
        if (err instanceof Error && err.message === "ACCESS_DENIED") {
            return { status: 403, message: "Unauthorized action" };
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
        await validateBookId(bookId, session.user.id)
        const chapter = await prisma.chapter.create({
            data: {
                title: "New Chapter",
                isPublic: false,
                content: "",
                wordCount: 0,
                bookId: bookId,
                authorId: session.user.id,
                sortOrder: ((await prisma.chapter.count({ where: { bookId: bookId } })) + 1) * 1000,
            },
        })
        return {
            status: 200,
            data: chapter,
        }
    } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHORIZED") {
            return { status: 401, message: "Session expired, Please login again" };
        }
        if (err instanceof Error && err.message === "ACCESS_DENIED") {
            return { status: 403, message: "Unauthorized action" };
        }
        return {
            status: 500,
            message: "Error creating chapters",
        }
    }
}

export async function updateChapter(data: ChaptersForm): Promise<ActionResult<Chapter>> {
    try {
        const session = await getValidatedSession()
        await validateChapterId(data.id, session.user.id)
        const res = await prisma.chapter.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                isPublic: data.isPublic,
                content: data.content,
                wordCount: data.wordCount,
            },
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
        return {
            status: 500,
            message: "Error updating chapters",
        }
    }
}

export async function deleteChapter(chapterId: string): Promise<ActionResult> {
    try {
        const session = await getValidatedSession()
        await validateChapterId(chapterId, session.user.id)
        await prisma.chapter.delete({
            where: {
                id: chapterId,
            },
        })
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
        return {
            status: 500,
            message: "Error deleting chapters",
        }
    }
}