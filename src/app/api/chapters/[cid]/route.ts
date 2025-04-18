import prisma from '@/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ cid: string } >}) {
    const {cid} = await params;
    // count sats, include books count, chapter count, word count, and series count

    const chapter = await prisma.chapter.findUnique({
        where: { id: cid },
    })
    if (!chapter || !chapter.isPublic) {
        return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }
    return NextResponse.json(chapter, { status: 200 })
}
