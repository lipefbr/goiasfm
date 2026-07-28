'use client'

import { useEffect, useState } from 'react'
import { Search, X, Clock } from 'lucide-react'

interface SearchNews {
  id: string
  title: string
  summary: string
  category: string
  imageUrl: string
  date: string | Date
  hoursAgo: number
  slug: string
}

interface SearchResultsProps {
  query: string
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

export function SearchResults({
  query,
  onClose,
  onOpenNews,
}: SearchResultsProps) {
  const [results, setResults] = useState<SearchNews[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!query) return
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then((d) => {
          if (!cancelled) {
            setResults(d.news || [])
            setTotal(d.total || 0)
          }
        })
        .catch(() => {
          if (!cancelled) {
            setResults([])
            setTotal(0)
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }, 250)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [query])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 flex items-start justify-center overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-3xl my-8 mx-4 rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-[#C8102E] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <Search className="w-5 h-5" />
            <div>
              <div className="font-bold text-lg">Resultados da busca</div>
              <div className="text-xs text-white/80">
                {loading ? 'Buscando...' : `${total} resultado(s) para "${query}"`}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/90 hover:text-white"
            aria-label="Fechar busca"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          {loading && (
            <div className="py-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500">
                Nenhuma notícia encontrada para &quot;{query}&quot;.
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="flex flex-col gap-3">
              {results.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    onOpenNews(n.slug)
                    onClose()
                  }}
                  className="flex items-stretch gap-4 p-3 rounded-lg hover:bg-gray-50 text-left transition-colors group border border-transparent hover:border-gray-200"
                >
                  <div className="w-28 h-20 shrink-0 rounded overflow-hidden bg-gray-100">
                    <img
                      src={n.imageUrl}
                      alt={n.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[#C8102E] text-[10px] font-bold uppercase tracking-wider">
                      {n.category}
                    </span>
                    <h3 className="text-black font-bold text-sm leading-snug line-clamp-2 group-hover:text-[#C8102E] transition-colors mt-0.5">
                      {n.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>{formatDate(n.date)}</span>
                      {n.hoursAgo > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />Há {n.hoursAgo} horas
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
