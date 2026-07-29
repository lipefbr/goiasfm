import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/videos - Lista todos os vídeos
export async function GET() {
  try {
    const videos = await db.video.findMany({
      orderBy: { date: 'desc' },
    })
    return NextResponse.json({ videos })
  } catch (error) {
    console.error('[GET /api/videos] error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar vídeos' },
      { status: 500 }
    )
  }
}
