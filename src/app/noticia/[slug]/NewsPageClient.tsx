'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'
import { Header } from '@/components/tvgoias/Header'
import { Calendar, Clock, Share2, ArrowLeft } from 'lucide-react'

interface NewsData {
  id: string
  title: string
  summary: string
  content: string
  category: string
  imageUrl: string
  date: string
  hoursAgo: number
  slug: string
}

interface RelatedData {
  id: string
  title: string
  imageUrl: string
  category: string
  date: string
  slug: string
}

interface Props {
  news: NewsData
  related: RelatedData[]
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function NewsPageClient({ news, related }: Props) {
  const router = useRouter()

  const handleSearch = useCallback((q: string) => {
    router.push(`/?busca=${encodeURIComponent(q)}`)
  }, [router])

  const handleNavigate = useCallback((section: string) => {
    if (section === 'home') {
      router.push('/')
      return
    }
    router.push(`/#${section}`)
  }, [router])

  return (
    <>
      <Header onSearch={handleSearch} onNavigate={handleNavigate} />

      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-bold text-black hover:text-[#C8102E] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a página inicial
          </Link>

          <article className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="relative aspect-video w-full bg-gray-200">
              <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const img = e.currentTarget
                  if (!img.dataset.fallback) {
                    img.dataset.fallback = '1'
                    img.src = 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&q=80'
                  }
                }}
              />
              <span className="absolute top-4 left-4 bg-[#C8102E] text-white text-xs font-bold px-3 py-1.5 rounded tracking-wider">
                {news.category.toUpperCase()}
              </span>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(news.date)}
                </span>
                {news.hoursAgo > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Há {news.hoursAgo} horas
                  </span>
                )}
                <button
                  className="ml-auto flex items-center gap-1 text-[#C8102E] hover:underline"
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.share) {
                      navigator.share({ title: news.title, url: window.location.href })
                    }
                  }}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Compartilhar
                </button>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-black leading-tight mb-3">
                {news.title}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-6 pb-6 border-b border-gray-200">
                {news.summary}
              </p>

              <div className="prose prose-lg max-w-none">
                {news.content.split('\n').map((p, i) => (
                  <p key={i} className="text-gray-800 leading-relaxed mb-4">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </article>

          {related.length > 0 && (
            <div className="mt-8">
              <h2 className="text-[#C8102E] font-black text-xl uppercase mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#C8102E]" />
                Relacionadas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/noticia/${r.slug}`}
                    className="bg-white rounded-lg overflow-hidden group hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={r.imageUrl}
                        alt={r.title}
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
                    <div className="p-3">
                      <span className="text-[#C8102E] text-[10px] font-bold uppercase tracking-wider">
                        {r.category}
                      </span>
                      <h3 className="text-black text-sm font-bold leading-snug line-clamp-2 group-hover:text-[#C8102E] transition-colors mt-1">
                        {r.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
