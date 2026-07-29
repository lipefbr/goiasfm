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

    if (!title || !summary || !category) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: title, summary, category' },
        { status: 400 }
      )
    }

    // Imagem padrão por categoria caso não informada
    const DEFAULT_IMAGES: Record<string, string> = {
      'Política': 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&q=80',
      'Economia': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80',
      'Cidades': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
      'Polícia': 'https://images.unsplash.com/photo-1589992966055-69b6f5c2f7be?w=600&q=80',
      'Educação': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
      'Esporte': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
      'Saúde': 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&q=80',
      'Entretenimento': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80',
      'Tecnologia': 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
      'Brasil e Mundo': 'https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=600&q=80',
    }
    const finalImageUrl =
      imageUrl || DEFAULT_IMAGES[category] || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&q=80'

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
        imageUrl: finalImageUrl,
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
