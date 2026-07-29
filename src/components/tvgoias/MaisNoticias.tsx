'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, ChevronDown, Loader2 } from 'lucide-react'
import { LipeHostBanner } from './LipeHostBanner'

interface NewsItem {
  id: string
  title: string
  summary: string
  category: string
  imageUrl: string
  date: string | Date
  hoursAgo: number
  slug: string
}

interface MaisNoticiasProps {
  news: NewsItem[]
}

function formatDate(date: string | Date) {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

const PAGE_SIZE = 6

export function MaisNoticias({ news }: MaisNoticiasProps) {
  const [visible, setVisible] = useState<NewsItem[]>(news)
  const [loadedIds, setLoadedIds] = useState<Set<string>>(
    new Set(news.map((n) => n.id))
  )
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    setVisible(news)
    setLoadedIds(new Set(news.map((n) => n.id)))
    setHasMore(true)
  }, [news])

  async function loadMore() {
    setLoading(true)
    try {
      const res = await fetch('/api/news')
      const data = await res.json()
      const all: NewsItem[] = data.news || []
      const next = all.filter((n) => !loadedIds.has(n.id)).slice(0, PAGE_SIZE)
      if (next.length === 0) {
        setHasMore(false)
      } else {
        setVisible((prev) => [...prev, ...next])
        setLoadedIds((prev) => {
          const newSet = new Set(prev)
          next.forEach((n) => newSet.add(n.id))
          return newSet
        })
        if (next.length < PAGE_SIZE) setHasMore(false)
      }
    } catch (e) {
      console.error('Erro ao carregar mais notícias:', e)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  if (!visible || visible.length === 0) return null

  return (
    <section id="mais-noticias-section" className="bg-white py-10 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-[#C8102E] font-black text-2xl uppercase tracking-tight mb-6 flex items-center gap-3">
          <span className="w-1.5 h-7 bg-[#C8102E]" />
          Mais Notícias
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.flatMap((n, idx) => {
            // A cada 6 notícias, insere um banner card do Lipe.Host
            const items = [
              <a
                key={n.id}
                href={`/noticia/${n.slug}`}
                className="bg-white rounded-lg overflow-hidden text-left group border border-gray-100 hover:border-[#C8102E]/30 hover:shadow-lg transition-all block"
              >
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={n.imageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&q=80'}
                    alt={n.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      const img = e.currentTarget
                      if (!img.dataset.fallback) {
                        img.dataset.fallback = '1'
                        img.src = 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&q=80'
                      }
                    }}
                  />
                  <span className="absolute top-2 left-2 bg-[#C8102E] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider">
                    {n.category.toUpperCase()}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-black font-bold text-base leading-snug line-clamp-2 group-hover:text-[#C8102E] transition-colors mb-2">
                    {n.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {n.summary}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(n.date)}
                    </span>
                    {n.hoursAgo > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />Há {n.hoursAgo}h
                      </span>
                    )}
                  </div>
                </div>
              </a>,
            ]

            // A cada 6 notícias (após 6ª, 12ª, 18ª...) insere um banner card
            // Só insere se houver mais notícias após esta
            if ((idx + 1) % 6 === 0 && idx < visible.length - 1) {
              items.push(
                <LipeHostBanner
                  key={`banner-${idx}`}
                  variant="card"
                />
              )
            }

            return items
          })}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-8 py-3 rounded-full bg-[#C8102E] hover:bg-[#a50d26] text-white font-bold text-sm flex items-center gap-2 transition-colors disabled:opacity-60 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Ver Mais
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
