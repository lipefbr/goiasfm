import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/news/[slug] - Detalhe de uma notícia
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const news = await db.news.findUnique({ where: { slug } })

    if (!news) {
      return NextResponse.json(
        { error: 'Notícia não encontrada' },
        { status: 404 }
      )
    }

    const related = await db.news.findMany({
      where: {
        category: news.category,
        slug: { not: slug },
      },
      take: 3,
      orderBy: { date: 'desc' },
    })

    return NextResponse.json({ news, related })
  } catch (error) {
    console.error('[GET /api/news/[slug]] error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar notícia' },
      { status: 500 }
    )
  }
}
