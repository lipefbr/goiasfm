import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/requireAuth'

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

// PUT /api/news/[slug] - Atualiza uma notícia (requer login)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { response } = await requireAuth()
  if (response) return response

  try {
    const { slug } = await params
    const body = await req.json()

    const existing = await db.news.findUnique({ where: { slug } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Notícia não encontrada' },
        { status: 404 }
      )
    }

    const {
      title,
      summary,
      content,
      category,
      imageUrl,
      isLive,
      isFeatured,
      isSecondary,
      isHighlight,
      hoursAgo,
    } = body

    const updated = await db.news.update({
      where: { slug },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(summary !== undefined ? { summary } : {}),
        ...(content !== undefined ? { content } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(imageUrl !== undefined ? { imageUrl } : {}),
        ...(isLive !== undefined ? { isLive } : {}),
        ...(isFeatured !== undefined ? { isFeatured } : {}),
        ...(isSecondary !== undefined ? { isSecondary } : {}),
        ...(isHighlight !== undefined ? { isHighlight } : {}),
        ...(hoursAgo !== undefined ? { hoursAgo } : {}),
      },
    })

    return NextResponse.json({ news: updated })
  } catch (error) {
    console.error('[PUT /api/news/[slug]] error:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar notícia' },
      { status: 500 }
    )
  }
}

// DELETE /api/news/[slug] - Remove uma notícia (requer login)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { response } = await requireAuth()
  if (response) return response

  try {
    const { slug } = await params
    const existing = await db.news.findUnique({ where: { slug } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Notícia não encontrada' },
        { status: 404 }
      )
    }

    await db.news.delete({ where: { slug } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/news/[slug]] error:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar notícia' },
      { status: 500 }
    )
  }
}
