"use server"
import prisma from "@/db"
import { getValidatedSession } from "@/lib/auth/auth-actions"
import { Chapter } from "@prisma/client"
import { validateBookId } from "@/lib/book/book-actions"
import {BookInfo} from "@/lib/book/book-actions"

type ChaptersForm = {
    id: string,
    title: string,
    isPublic: boolean,
    content: string,
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


export async function fetchChaptersIndex({ bookId, isPublic }: { bookId: string; isPublic?: boolean }): Promise<ActionResult<{ book: BookInfo; chapters: ChapterIndex[] }>> {
    try {
        const session = await getValidatedSession()
        const chaptersIndex = await prisma.book.findFirst({
            where: { id: bookId },
            include: {
                author: {
                    select: {
                        username: true,
                        name: true,
                    },
                },
                chapters: {
                    where: {
                        isPublic: isPublic,
                    },
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
                _count: {
                    select: {
                        chapters: {
                            where: {
                                isPublic: isPublic,
                            },
                        }
                    },
                },
            },
        })
        if (!chaptersIndex || isPublic && !chaptersIndex.isPublic && chaptersIndex.authorId !== session.user.id) {
            return {
                status: 404,
                message: "Book not found",
            }
        }
        if (!isPublic && chaptersIndex.authorId !== session.user.id) {
            return {
                status: 403,
                message: "Unauthorized access",
            }
        }
        return {
            status: 200,
            data: {
                book: chaptersIndex as BookInfo,
                chapters: chaptersIndex.chapters as ChapterIndex[],
            },
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
        const oldchapter = await validateChapterId(data.id, session.user.id)
        const newWordCount = data.content.length
        const wordCountDelta = newWordCount - oldchapter.wordCount
        const [updatedChapter] = await prisma.$transaction([
            prisma.chapter.update({
              where: { id: data.id },
              data: {
                title: data.title,
                isPublic: data.isPublic,
                content: data.content,
                wordCount: newWordCount,
              },
            }),
            prisma.book.update({
              where: { id: oldchapter.bookId },
              data: {
                wordCount: {
                  increment: wordCountDelta,
                },
              },
            }),
          ]);
        return {
            status: 200,
            data: updatedChapter,
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
        const chapter = await validateChapterId(chapterId, session.user.id)
        await prisma.$transaction([
            prisma.chapter.delete({
              where: { id: chapterId },
            }),
            prisma.book.update({
              where: { id: chapter.bookId },
              data: {
                wordCount: {
                  increment: -chapter.wordCount, // Decrement the book's word count
                },
              },
            }),
          ]);
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