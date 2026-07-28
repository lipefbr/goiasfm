'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
  featured: NewsItem | null
  secondary: NewsItem[]
  highlights: NewsItem[]
  onOpenNews: (slug: string) => void
}

// Player de YouTube ao vivo real (canal de notícias ao vivo)
const LIVE_YOUTUBE_ID = 'y60wDzZt1yg' // Stream ao vivo genérica — substituir por canal real
const LIVE_PLAYLIST = [
  { id: 'y60wDzZt1yg', title: 'AO VIVO: TV Goiás Notícias 24h' },
  { id: '9Auq9mYxFEE', title: 'Globo News Ao Vivo' },
  { id: 'gCNeDWCI0vo', title: 'Record News Ao Vivo' },
  { id: 'yx4msTcKK0Y', title: 'Band News Ao Vivo' },
]

function formatDate(date: string | Date) {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function Hero({ featured, secondary, highlights, onOpenNews }: HeroProps) {
  const [slide, setSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-rotação dos slides
  useEffect(() => {
    if (isPlaying) return // não rotaciona se usuário deu play
    const t = setInterval(() => {
      setSlide((s) => (s + 1) % LIVE_PLAYLIST.length)
    }, 8000)
    return () => clearInterval(t)
  }, [isPlaying])

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
          {/* Coluna esquerda: Player de vídeo ao vivo (maior) + 2 cards no tablet */}
          <div className="md:col-span-8 lg:col-span-7 flex flex-col gap-4">
            {/* Player principal AO VIVO */}
            <div
              ref={containerRef}
              className="relative aspect-video w-full overflow-hidden rounded-lg bg-black group"
            >
              {!isPlaying ? (
                <>
                  {/* Thumbnail/preview */}
                  <img
                    src={featured?.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80'}
                    alt={featured?.title || 'AO VIVO'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                  {/* Badge AO VIVO */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#C8102E] px-3 py-1.5 rounded text-white text-xs font-bold tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    AO VIVO
                  </div>

                  {/* Badge DESTAQUE */}
                  <div className="absolute top-4 right-4 bg-[#C8102E] px-3 py-1.5 rounded text-white text-xs font-bold tracking-wider">
                    DESTAQUE
                  </div>

                  {/* Botão play central */}
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center"
                    aria-label="Reproduzir vídeo ao vivo"
                  >
                    <div className="w-20 h-20 rounded-full bg-[#C8102E]/90 hover:bg-[#C8102E] flex items-center justify-center transition-all hover:scale-110 shadow-2xl">
                      <div className="w-0 h-0 border-l-[24px] border-l-white border-y-[16px] border-y-transparent ml-1.5" />
                    </div>
                  </button>

                  {/* Conteúdo inferior */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <button
                      onClick={() => featured && onOpenNews(featured.slug)}
                      className="text-left w-full"
                    >
                      <h2 className="text-white text-2xl md:text-3xl font-black leading-tight mb-2 drop-shadow-lg">
                        {featured?.title || 'Goiás tem crescimento de 12% no setor de serviços'}
                      </h2>
                      <p className="text-gray-200 text-sm md:text-base max-w-2xl">
                        {featured?.summary ||
                          'Resultados positivos foram impulsionados pelo comércio e serviços prestados às famílias, aponta pesquisa.'}
                      </p>
                    </button>
                  </div>

                  {/* Controles de carrossel */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <button
                      onClick={() => setSlide((s) => (s - 1 + LIVE_PLAYLIST.length) % LIVE_PLAYLIST.length)}
                      className="w-8 h-8 rounded-full bg-black/60 hover:bg-[#C8102E] flex items-center justify-center text-white transition-colors"
                      aria-label="Slide anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSlide((s) => (s + 1) % LIVE_PLAYLIST.length)}
                      className="w-8 h-8 rounded-full bg-black/60 hover:bg-[#C8102E] flex items-center justify-center text-white transition-colors"
                      aria-label="Próximo slide"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bolinhas indicadoras */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                    {LIVE_PLAYLIST.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSlide(i)}
                        className={`h-1.5 rounded-full transition-all ${
                          i === slide ? 'w-6 bg-[#C8102E]' : 'w-1.5 bg-white/50'
                        }`}
                        aria-label={`Ir para slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${LIVE_PLAYLIST[slide].id}?autoplay=1&mute=1&playsinline=1`}
                  title="TV Goiás Ao Vivo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>
          </div>

          {/* Coluna do meio: 2 cards menores empilhados verticalmente (apenas desktop) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-4">
            {secondary.slice(0, 2).map((n) => (
              <button
                key={n.id}
                onClick={() => onOpenNews(n.slug)}
                className="flex-1 flex flex-col bg-[#1F1F1F] hover:bg-[#2A2A2A] rounded-lg overflow-hidden text-left transition-colors group min-h-[180px]"
              >
                <div className="relative w-full h-32 shrink-0">
                  <img
                    src={n.imageUrl}
                    alt={n.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-[#C8102E] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider">
                    {n.category.toUpperCase()}
                  </span>
                </div>
                <div className="p-3 flex flex-col justify-between flex-1">
                  <h3 className="text-white text-sm font-bold leading-snug line-clamp-3 group-hover:text-[#C8102E] transition-colors">
                    {n.title}
                  </h3>
                  <span className="text-gray-400 text-xs mt-2">{formatDate(n.date)}</span>
                </div>
              </button>
            ))}
          </div>

          {/* 2 Cards menores em grid 2 colunas - visível em mobile/tablet (não desktop) */}
          <div className="lg:hidden md:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {secondary.slice(0, 2).map((n) => (
              <button
                key={n.id}
                onClick={() => onOpenNews(n.slug)}
                className="flex-1 flex flex-col bg-[#1F1F1F] hover:bg-[#2A2A2A] rounded-lg overflow-hidden text-left transition-colors group min-h-[180px]"
              >
                <div className="relative w-full h-32 shrink-0">
                  <img
                    src={n.imageUrl}
                    alt={n.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-[#C8102E] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider">
                    {n.category.toUpperCase()}
                  </span>
                </div>
                <div className="p-3 flex flex-col justify-between flex-1">
                  <h3 className="text-white text-sm font-bold leading-snug line-clamp-3 group-hover:text-[#C8102E] transition-colors">
                    {n.title}
                  </h3>
                  <span className="text-gray-400 text-xs mt-2">{formatDate(n.date)}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Sidebar DESTAQUES NOTÍCIAS */}
          <aside className="md:col-span-4 lg:col-span-2 bg-white rounded-lg p-4">
            <h3 className="text-black font-black text-base uppercase tracking-wide pb-2 border-b-2 border-gray-200 mb-3">
              Destaques Notícias
            </h3>
            <div className="flex flex-col gap-3">
              {highlights.slice(0, 4).map((n) => (
                <button
                  key={n.id}
                  onClick={() => onOpenNews(n.slug)}
                  className="flex items-start gap-2 text-left group"
                >
                  <div className="w-14 h-14 shrink-0 rounded overflow-hidden bg-gray-100">
                    <img
                      src={n.imageUrl}
                      alt={n.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[#C8102E] text-[9px] font-bold uppercase tracking-wider">
                      {n.category}
                    </span>
                    <h4 className="text-black text-xs font-bold leading-snug line-clamp-2 group-hover:text-[#C8102E] transition-colors mt-0.5">
                      {n.title}
                    </h4>
                    <span className="text-gray-500 text-[10px]">Há {n.hoursAgo} horas</span>
                  </div>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
