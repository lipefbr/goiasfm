'use client'

import { useEffect, useState } from 'react'
import { Calendar, Clock, ChevronLeft } from 'lucide-react'

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

interface CategoryListProps {
  category: string
  onBack: () => void
  onOpenNews: (slug: string) => void
}

function formatDate(date: string | Date) {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function CategoryList({ category, onBack, onOpenNews }: CategoryListProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    fetch(`/api/news?category=${encodeURIComponent(category)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setNews(d.news || [])
      })
      .catch(() => {
        if (!cancelled) setNews([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [category])

  return (
    <section className="bg-gray-50 py-8 min-h-[60vh]">
      <div className="mx-auto max-w-7xl px-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-bold text-black hover:text-[#C8102E] mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para a página inicial
        </button>

        <h2 className="text-[#C8102E] font-black text-3xl uppercase tracking-tight mb-2 flex items-center gap-3">
          <span className="w-1.5 h-9 bg-[#C8102E]" />
          {category}
        </h2>
        <p className="text-gray-500 mb-8 ml-6">
          {loading ? 'Carregando...' : `${news.length} notícia(s) encontrada(s)`}
        </p>

        {loading && (
          <div className="py-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && news.length === 0 && (
          <div className="py-12 text-center bg-white rounded-lg">
            <p className="text-gray-500">
              Nenhuma notícia encontrada nesta categoria.
            </p>
          </div>
        )}

        {!loading && news.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {news.map((n) => (
              <a
                key={n.id}
                href={`/noticia/${n.slug}`}
                className="bg-white rounded-lg overflow-hidden text-left group hover:shadow-lg transition-shadow block"
              >
                <div className="aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={n.imageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&q=80'}
                    alt={n.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      const img = e.currentTarget
                      if (!img.dataset.fallback) {
                        img.dataset.fallback = '1'
                        img.src = 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&q=80'
                      }
                    }}
                  />
                </div>
                <div className="p-4">
                  <span className="text-[#C8102E] text-[10px] font-bold uppercase tracking-wider">
                    {n.category}
                  </span>
                  <h3 className="text-black font-bold text-base leading-snug line-clamp-2 group-hover:text-[#C8102E] transition-colors mt-1 mb-2">
                    {n.title}
                  </h3>
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
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
