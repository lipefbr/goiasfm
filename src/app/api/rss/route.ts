import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/requireAuth'
import { XMLParser } from 'fast-xml-parser'

// POST /api/rss - Importa notícias de um feed RSS
// Body: { url: string, category?: string, limit?: number }
export async function POST(req: NextRequest) {
  const { response } = await requireAuth()
  if (response) return response

  try {
    const body = await req.json()
    const { url, category, limit = 10 } = body

    if (!url) {
      return NextResponse.json(
        { error: 'URL do feed RSS é obrigatória' },
        { status: 400 }
      )
    }

    // Busca o feed RSS
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TVGoiasRSS/1.0)',
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
      },
      // Timeout de 15s
      signal: AbortSignal.timeout(15000),
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `Falha ao buscar feed: HTTP ${res.status}` },
        { status: 502 }
      )
    }

    const xml = await res.text()
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    })
    const parsed = parser.parse(xml)

    // Normaliza estrutura do RSS (pode ser rss.channel.item ou feed.entry)
    let items: Array<Record<string, unknown>> = []
    if (parsed.rss?.channel?.item) {
      items = Array.isArray(parsed.rss.channel.item)
        ? parsed.rss.channel.item
        : [parsed.rss.channel.item]
    } else if (parsed.feed?.entry) {
      items = Array.isArray(parsed.feed.entry)
        ? parsed.feed.entry
        : [parsed.feed.entry]
    } else {
      return NextResponse.json(
        { error: 'Formato RSS não reconhecido' },
        { status: 400 }
      )
    }

    const imported: Array<{ title: string; slug: string }> = []
    const skipped: string[] = []
    let processed = 0

    for (const item of items.slice(0, limit)) {
      processed++
      const title = String(item.title || '').trim()
      const link = String(item.link || '')
      const description = String(item.description || item.summary || '').trim()
      const pubDate = item.pubDate || item.published || item['dc:date']

      if (!title) {
        skipped.push(`Item ${processed}: sem título`)
        continue
      }

      // Gera slug único
      const slugBase = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 60)
      const slug = `${slugBase}-${Date.now().toString(36)}-${processed}`

      // Verifica se já existe notícia com mesmo título
      const existing = await db.news.findFirst({
        where: { title: { contains: title.substring(0, 50) } },
        select: { id: true },
      })
      if (existing) {
        skipped.push(`"${title.substring(0, 40)}..." (já existe)`)
        continue
      }

      // Tenta extrair imagem do item (enclosure ou media:content)
      let imageUrl = ''
      const enclosure = item.enclosure
      if (enclosure && enclosure['@_url']) {
        imageUrl = enclosure['@_url']
      } else if (item['media:content']?.['@_url']) {
        imageUrl = item['media:content']['@_url']
      } else if (item['media:thumbnail']?.['@_url']) {
        imageUrl = item['media:thumbnail']['@_url']
      } else {
        // Tenta extrair URL de imagem do HTML da descrição
        const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i)
        if (imgMatch) {
          imageUrl = imgMatch[1]
        }
      }

      // Fallback de imagem por categoria
      if (!imageUrl) {
        const DEFAULT_IMAGES: Record<string, string> = {
          Política: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&q=80',
          Economia: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80',
          Cidades: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
          Polícia: 'https://images.unsplash.com/photo-1589992957537-3d2c4c1f5b87?w=600&q=80',
          Educação: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
          Esporte: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
          Saúde: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&q=80',
          Entretenimento: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80',
          Tecnologia: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
          'Brasil e Mundo': 'https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=600&q=80',
        }
        imageUrl =
          DEFAULT_IMAGES[category || ''] ||
          'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&q=80'
      }

      // Limpa descrição HTML
      const cleanSummary = description
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 200)

      // Data
      let date = new Date()
      if (pubDate) {
        const parsed = new Date(pubDate as string)
        if (!isNaN(parsed.getTime())) date = parsed
      }

      // Distribui as primeiras notícias nos slots do hero:
      // - 2 primeiras → isSecondary (cards laterais do hero)
      // - 4 próximas → isHighlight (sidebar de destaques)
      // Antes de marcar, limpa flags existentes para evitar duplicação
      const importIndex = imported.length
      const shouldBeSecondary = importIndex < 2
      const shouldBeHighlight = importIndex >= 2 && importIndex < 6

      // Se vai marcar como Secondary, desmarca as outras que já são
      if (shouldBeSecondary) {
        const currentSecondary = await db.news.count({
          where: { isSecondary: true },
        })
        if (currentSecondary >= 2) {
          // Já tem 2 secondary — não marca mais (não sobrescreve)
        }
      }
      if (shouldBeHighlight) {
        const currentHighlights = await db.news.count({
          where: { isHighlight: true },
        })
        if (currentHighlights >= 4) {
          // Já tem 4 highlights — não marca mais
        }
      }

      await db.news.create({
        data: {
          title: title.substring(0, 200),
          summary: cleanSummary || 'Importado via RSS',
          content: cleanSummary
            ? `${cleanSummary}\n\nFonte: ${link}`
            : `Notícia importada via RSS.\n\nFonte: ${link}`,
          category: category || 'Brasil e Mundo',
          imageUrl,
          date,
          isLive: false,
          isFeatured: false,
          isSecondary: shouldBeSecondary,
          isHighlight: shouldBeHighlight,
          hoursAgo: Math.floor((Date.now() - date.getTime()) / 3600000),
          slug,
        },
      })

      imported.push({ title: title.substring(0, 60), slug })
    }

    return NextResponse.json({
      success: true,
      message: `${imported.length} notícia(s) importada(s) de ${processed} item(s) processados`,
      imported: imported.length,
      skipped,
      processed,
    })
  } catch (error) {
    console.error('[POST /api/rss] error:', error)
    return NextResponse.json(
      {
        error: 'Erro ao importar RSS',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
