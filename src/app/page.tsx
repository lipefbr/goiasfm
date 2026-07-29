'use client'

import { useEffect, useState, useCallback } from 'react'
import { Header } from '@/components/tvgoias/Header'
import { Hero } from '@/components/tvgoias/Hero'
import { BlackBar } from '@/components/tvgoias/BlackBar'
import { VideosSection } from '@/components/tvgoias/VideosSection'
import { CategoriesSidebar } from '@/components/tvgoias/CategoriesSidebar'
import { Footer } from '@/components/tvgoias/Footer'
import { SearchResults } from '@/components/tvgoias/SearchResults'
import { CategoryList } from '@/components/tvgoias/CategoryList'
import { MaisNoticias } from '@/components/tvgoias/MaisNoticias'

interface NewsItem {
  id: string
  title: string
  summary: string
  content: string
  category: string
  imageUrl: string
  date: string
  isLive: boolean
  isFeatured: boolean
  isSecondary: boolean
  isHighlight: boolean
  hoursAgo: number
  slug: string
}

interface VideoItem {
  id: string
  title: string
  duration: string
  imageUrl: string
  youtubeId: string | null
  date: string
}

interface CategoryItem {
  id: string
  name: string
  icon: string
  order: number
}

interface Settings {
  live_stream_url?: string
  [k: string]: string | undefined
}

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [newsRes, videosRes, catRes, settingsRes] = await Promise.all([
        fetch('/api/news'),
        fetch('/api/videos'),
        fetch('/api/categories'),
        fetch('/api/settings'),
      ])
      const [newsData, videosData, catData, settingsData] = await Promise.all([
        newsRes.json(),
        videosRes.json(),
        catRes.json(),
        settingsRes.json(),
      ])
      setNews(newsData.news || [])
      setVideos(videosData.videos || [])
      setCategories(catData.categories || [])
      setSettings(settingsData.settings || {})
    } catch (e) {
      console.error('Erro ao carregar dados:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Sync URL (?busca=term, ?categoria=name)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const busca = params.get('busca')
    const categoria = params.get('categoria')
    if (busca) setSearchQuery(busca)
    if (categoria) setSelectedCategory(categoria)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams()
    if (searchQuery) params.set('busca', searchQuery)
    if (selectedCategory) params.set('categoria', selectedCategory)
    const qs = params.toString()
    const newUrl = qs ? `?${qs}` : window.location.pathname
    window.history.replaceState({}, '', newUrl)
  }, [searchQuery, selectedCategory])

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q)
    setSelectedCategory(null)
  }, [])

  const handleNavigate = useCallback((section: string) => {
    if (section === 'home') {
      setSelectedCategory(null)
      setSearchQuery(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (section === 'noticias') {
      setSelectedCategory(null)
      document.getElementById('mais-noticias-section')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    if (section === 'videos') {
      document.getElementById('videos-section')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    if (section === 'contato' || section === 'quem-somos' || section === 'radio') {
      document.getElementById('mais-noticias-section')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
  }, [])

  const handleSelectCategory = useCallback((category: string) => {
    setSelectedCategory(category)
    setSearchQuery(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Notícias para a seção "Mais Notícias": todas as notícias
  const maisNoticias = news

  // Notícias para o Hero (cards laterais + sidebar de destaques)
  const secondary = news.filter((n) => n.isSecondary).slice(0, 2)
  const highlights = news.filter((n) => n.isHighlight).slice(0, 4)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header onSearch={handleSearch} onNavigate={handleNavigate} />

      <main className="flex-1">
        {selectedCategory ? (
          <CategoryList
            category={selectedCategory}
            onBack={() => setSelectedCategory(null)}
            onOpenNews={(slug) => {
              window.location.href = `/noticia/${slug}`
            }}
          />
        ) : (
          <>
            {/* Hero: player ao vivo + cards laterais + destaques */}
            <Hero
              liveStreamUrl={
                settings.live_stream_url ||
                'https://wz5.dnip.com.br/tvgoias/tvgoias.sdp/playlist.m3u8'
              }
              secondary={secondary}
              highlights={highlights}
            />

            <BlackBar />

            <section
              id="videos-section"
              className="bg-gray-50 py-8 scroll-mt-24"
            >
              <div className="mx-auto max-w-7xl px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-9">
                    <VideosSection videos={videos} />
                  </div>
                  <div className="lg:col-span-3">
                    <div className="sticky top-28">
                      <CategoriesSidebar
                        categories={categories}
                        onSelect={handleSelectCategory}
                        selected={selectedCategory || undefined}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Seção Mais Notícias */}
            <MaisNoticias news={maisNoticias} />
          </>
        )}
      </main>

      <Footer />

      {/* Modais */}
      {searchQuery && (
        <SearchResults
          query={searchQuery}
          onClose={() => setSearchQuery(null)}
          onOpenNews={(slug) => {
            window.location.href = `/noticia/${slug}`
          }}
        />
      )}

      {loading && (
        <div className="fixed inset-0 bg-white/60 z-[200] flex items-center justify-center pointer-events-none">
          <div className="inline-block w-10 h-10 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
