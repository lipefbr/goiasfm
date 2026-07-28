import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/search?q=termo - Busca notícias
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.trim()

    if (!q) {
      return NextResponse.json({ news: [] })
    }

    const news = await db.news.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { summary: { contains: q } },
          { content: { contains: q } },
          { category: { contains: q } },
        ],
      },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json({ news, total: news.length })
  } catch (error) {
    console.error('[GET /api/search] error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar' },
      { status: 500 }
    )
  }
}
