'use client'

import { LivePlayer } from './LivePlayer'
import { Calendar, Clock } from 'lucide-react'
import Image from 'next/image'

interface NewsItem {
  id: string
  title: string
  summary: string
  category: string
  imageUrl: string
  date: string | Date
  isLive: boolean
  isFeatured: boolean
  isSecondary: boolean
  isHighlight: boolean
  hoursAgo: number
  slug: string
}

interface HeroProps {
  liveStreamUrl: string
  secondary: NewsItem[]
  highlights: NewsItem[]
}

function formatDate(date: string | Date) {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function Hero({ liveStreamUrl, secondary, highlights }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-[#1a0008] via-[#2a0010] to-[#0a0004]">
      {/* Textura de fundo */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(200,16,46,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(200,16,46,0.2) 0%, transparent 50%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Coluna esquerda: Player AO VIVO (maior) */}
          <div className="md:col-span-8 lg:col-span-7">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
              <LivePlayer src={liveStreamUrl} className="w-full h-full" />

              {/* Badge AO VIVO - sobreposto */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#C8102E] px-3 py-1.5 rounded text-white text-xs font-bold tracking-wider shadow-lg pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                AO VIVO
              </div>

              {/* Badge TV GOIÁS - sobreposto */}
              <div className="absolute top-4 right-4 z-20 bg-black/70 backdrop-blur px-3 py-1.5 rounded shadow-lg pointer-events-none flex items-center gap-2">
                <Image
                  src="/tvgoias-logo.png"
                  alt="TV Goiás"
                  width={50}
                  height={20}
                  className="h-5 w-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* Coluna do meio: 2 cards menores empilhados (desktop) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-4">
            {secondary.slice(0, 2).map((n) => (
              <a
                key={n.id}
                href={`/noticia/${n.slug}`}
                className="flex-1 flex flex-col bg-[#1F1F1F] hover:bg-[#2A2A2A] rounded-lg overflow-hidden text-left transition-colors group min-h-[180px]"
              >
                <div className="relative w-full h-32 shrink-0">
                  <img
                    src={
                      n.imageUrl ||
                      'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&q=80'
                    }
                    alt={n.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const img = e.currentTarget
                      if (!img.dataset.fallback) {
                        img.dataset.fallback = '1'
                        img.src =
                          'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&q=80'
                      }
                    }}
                  />
                  <span className="absolute top-2 left-2 bg-[#C8102E] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider">
                    {n.category.toUpperCase()}
                  </span>
                </div>
                <div className="p-3 flex flex-col justify-between flex-1">
                  <h3 className="text-white text-sm font-bold leading-snug line-clamp-3 group-hover:text-[#C8102E] transition-colors">
                    {n.title}
                  </h3>
                  <span className="text-gray-400 text-xs mt-2">
                    {formatDate(n.date)}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* 2 Cards menores em grid 2 colunas - tablet/mobile */}
          <div className="lg:hidden md:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {secondary.slice(0, 2).map((n) => (
              <a
                key={n.id}
                href={`/noticia/${n.slug}`}
                className="flex-1 flex flex-col bg-[#1F1F1F] hover:bg-[#2A2A2A] rounded-lg overflow-hidden text-left transition-colors group min-h-[180px]"
              >
                <div className="relative w-full h-32 shrink-0">
                  <img
                    src={
                      n.imageUrl ||
                      'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&q=80'
                    }
                    alt={n.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const img = e.currentTarget
                      if (!img.dataset.fallback) {
                        img.dataset.fallback = '1'
                        img.src =
                          'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&q=80'
                      }
                    }}
                  />
                  <span className="absolute top-2 left-2 bg-[#C8102E] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider">
                    {n.category.toUpperCase()}
                  </span>
                </div>
                <div className="p-3 flex flex-col justify-between flex-1">
                  <h3 className="text-white text-sm font-bold leading-snug line-clamp-3 group-hover:text-[#C8102E] transition-colors">
                    {n.title}
                  </h3>
                  <span className="text-gray-400 text-xs mt-2">
                    {formatDate(n.date)}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Sidebar DESTAQUES NOTÍCIAS */}
          <aside className="md:col-span-4 lg:col-span-2 bg-white rounded-lg p-4">
            <h3 className="text-black font-black text-base uppercase tracking-wide pb-2 border-b-2 border-gray-200 mb-3">
              Destaques Notícias
            </h3>
            <div className="flex flex-col gap-3">
              {highlights.slice(0, 4).map((n) => (
                <a
                  key={n.id}
                  href={`/noticia/${n.slug}`}
                  className="flex items-start gap-2 text-left group"
                >
                  <div className="w-14 h-14 shrink-0 rounded overflow-hidden bg-gray-100">
                    <img
                      src={
                        n.imageUrl ||
                        'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=200&q=80'
                      }
                      alt={n.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const img = e.currentTarget
                        if (!img.dataset.fallback) {
                          img.dataset.fallback = '1'
                          img.src =
                            'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=200&q=80'
                        }
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[#C8102E] text-[9px] font-bold uppercase tracking-wider">
                      {n.category}
                    </span>
                    <h4 className="text-black text-xs font-bold leading-snug line-clamp-2 group-hover:text-[#C8102E] transition-colors mt-0.5">
                      {n.title}
                    </h4>
                    {n.hoursAgo > 0 && (
                      <span className="text-gray-500 text-[10px]">
                        Há {n.hoursAgo} horas
                      </span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
