import prisma from '@/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ cid: string } >}) {
    const {cid} = await params;
    // count sats, include books count, chapter count, word count, and series count

    try {
        const chapter = await prisma.chapter.findUnique({
          where: { id: cid },
        });
    
        if (!chapter || !chapter.isPublic) {
          return NextResponse.json(
            { error: 'Chapter not found or is not public' },
            { status: 404 }
          );
        }
    
        return NextResponse.json(chapter, { status: 200 });
      } catch (error) {
        console.error('Error fetching chapter:', error);
        return NextResponse.json(
          { error: 'An unexpected error occurred' },
          { status: 500 }
        );
      }
}
