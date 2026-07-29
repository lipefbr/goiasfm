'use client'

import { Calendar, Clock } from 'lucide-react'

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

export function MaisNoticias({ news, onOpenNews }: MaisNoticiasProps) {
  if (!news || news.length === 0) return null

  return (
    <section id="mais-noticias-section" className="bg-white py-10 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-[#C8102E] font-black text-2xl uppercase tracking-tight mb-6 flex items-center gap-3">
          <span className="w-1.5 h-7 bg-[#C8102E]" />
          Mais Notícias
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((n) => (
            <button
              key={n.id}
              onClick={() => onOpenNews(n.slug)}
              className="bg-white rounded-lg overflow-hidden text-left group border border-gray-100 hover:border-[#C8102E]/30 hover:shadow-lg transition-all"
            >
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                <img
                  src={n.imageUrl}
                  alt={n.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
