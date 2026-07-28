import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/news - Lista todas as notícias com filtros opcionais
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const secondary = searchParams.get('secondary')
    const highlight = searchParams.get('highlight')
    const live = searchParams.get('live')
    const limit = searchParams.get('limit')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}

    if (category) where.category = category
    if (featured === 'true') where.isFeatured = true
    if (secondary === 'true') where.isSecondary = true
    if (highlight === 'true') where.isHighlight = true
    if (live === 'true') where.isLive = true
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { summary: { contains: search } },
        { content: { contains: search } },
      ]
    }

    const news = await db.news.findMany({
      where,
      orderBy: { date: 'desc' },
      ...(limit ? { take: parseInt(limit) } : {}),
    })

    return NextResponse.json({ news })
  } catch (error) {
    console.error('[GET /api/news] error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar notícias' },
      { status: 500 }
    )
  }
}

// POST /api/news - Cadastra nova notícia
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      title,
      summary,
      content,
      category,
      imageUrl,
      isLive = false,
      isFeatured = false,
      isSecondary = false,
      isHighlight = false,
      hoursAgo = 0,
    } = body

    if (!title || !summary || !category || !imageUrl) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: title, summary, category, imageUrl' },
        { status: 400 }
      )
    }

    const slugBase = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    const slug = `${slugBase}-${Date.now().toString(36)}`

    const news = await db.news.create({
      data: {
        title,
        summary,
        content: content || summary,
        category,
        imageUrl,
        isLive,
        isFeatured,
        isSecondary,
        isHighlight,
        hoursAgo,
        slug,
        date: new Date(),
      },
    })

    return NextResponse.json({ news }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/news] error:', error)
    return NextResponse.json(
      { error: 'Erro ao cadastrar notícia' },
      { status: 500 }
    )
  }
}
