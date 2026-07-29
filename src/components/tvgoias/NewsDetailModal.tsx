'use client'

import { useEffect, useState } from 'react'
import { X, Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react'

interface RelatedNews {
  id: string
  title: string
  imageUrl: string
  category: string
  date: string | Date
  slug: string
}

interface NewsDetail {
  id: string
  title: string
  summary: string
  content: string
  category: string
  imageUrl: string
  date: string | Date
  isLive: boolean
  hoursAgo: number
  slug: string
}

interface NewsDetailModalProps {
  slug: string | null
  onClose: () => void
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

export function NewsDetailModal({
  slug,
  onClose,
  onOpenNews,
}: NewsDetailModalProps) {
  const [data, setData] = useState<{
    news: NewsDetail
    related: RelatedNews[]
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData(null)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch(`/api/news/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('Notícia não encontrada')
        return r.json()
      })
      .then((d) => {
        if (!cancelled) setData(d)
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  // Fechar com ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (slug) {
      window.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [slug, onClose])

  if (!slug) return null

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 flex items-start justify-center overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-3xl my-8 mx-4 rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-bold text-black hover:text-[#C8102E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-black"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading && (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 mt-4">Carregando notícia...</p>
          </div>
        )}

        {error && (
          <div className="p-12 text-center">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {data && !loading && !error && (
          <article>
            {/* Imagem destacada */}
            <div className="relative aspect-video w-full bg-gray-200">
              <img
                src={data.news.imageUrl}
                alt={data.news.title}
                className="w-full h-full object-cover"
              />
              {data.news.isLive && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#C8102E] px-3 py-1.5 rounded text-white text-xs font-bold tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  AO VIVO
                </div>
              )}
              <span className="absolute top-4 right-4 bg-[#C8102E] px-3 py-1.5 rounded text-white text-xs font-bold tracking-wider">
                {data.news.category.toUpperCase()}
              </span>
            </div>

            <div className="p-6">
              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(data.news.date)}
                </span>
                {data.news.hoursAgo > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Há {data.news.hoursAgo} horas
                  </span>
                )}
                <button className="ml-auto flex items-center gap-1 text-[#C8102E] hover:underline">
                  <Share2 className="w-3.5 h-3.5" />
                  Compartilhar
                </button>
              </div>

              {/* Título e resumo */}
              <h1 className="text-3xl md:text-4xl font-black text-black leading-tight mb-3">
                {data.news.title}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-6 pb-6 border-b border-gray-200">
                {data.news.summary}
              </p>

              {/* Conteúdo */}
              <div className="prose prose-lg max-w-none">
                {data.news.content.split('\n').map((p, i) => (
                  <p key={i} className="text-gray-800 leading-relaxed mb-4">
                    {p}
                  </p>
                ))}
              </div>

              {/* Relacionadas */}
              {data.related.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-[#C8102E] font-black text-lg uppercase mb-4">
                    Relacionadas
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {data.related.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => onOpenNews(r.slug)}
                        className="text-left group"
                      >
                        <div className="aspect-video overflow-hidden rounded mb-2">
                          <img
                            src={r.imageUrl}
                            alt={r.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <span className="text-[#C8102E] text-[10px] font-bold uppercase tracking-wider">
                          {r.category}
                        </span>
                        <h4 className="text-black text-sm font-bold leading-snug line-clamp-2 group-hover:text-[#C8102E] transition-colors mt-0.5">
                          {r.title}
                        </h4>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        )}
      </div>
    </div>
  )
}
