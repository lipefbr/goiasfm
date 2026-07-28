'use client'

import { useEffect, useState, useCallback } from 'react'
import { Header } from '@/components/tvgoias/Header'
import { Hero } from '@/components/tvgoias/Hero'
import { BlackBar } from '@/components/tvgoias/BlackBar'
import { VideosSection } from '@/components/tvgoias/VideosSection'
import { CategoriesSidebar } from '@/components/tvgoias/CategoriesSidebar'
import { Footer } from '@/components/tvgoias/Footer'
import { NewsDetailModal } from '@/components/tvgoias/NewsDetailModal'
import { SearchResults } from '@/components/tvgoias/SearchResults'
import { AdminForm } from '@/components/tvgoias/AdminForm'
import { CategoryList } from '@/components/tvgoias/CategoryList'
import { Plus, Home as HomeIcon } from 'lucide-react'

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

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedNewsSlug, setSelectedNewsSlug] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [adminOpen, setAdminOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Carregar dados iniciais
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [newsRes, videosRes, catRes] = await Promise.all([
        fetch('/api/news'),
        fetch('/api/videos'),
        fetch('/api/categories'),
      ])
      const [newsData, videosData, catData] = await Promise.all([
        newsRes.json(),
        videosRes.json(),
        catRes.json(),
      ])
      setNews(newsData.news || [])
      setVideos(videosData.videos || [])
      setCategories(catData.categories || [])
    } catch (e) {
      console.error('Erro ao carregar dados:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Sync com URL (?noticia=slug, ?busca=term, ?categoria=name, ?admin=1)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const noticia = params.get('noticia')
    const busca = params.get('busca')
    const categoria = params.get('categoria')
    const admin = params.get('admin')
    if (noticia) setSelectedNewsSlug(noticia)
    if (busca) setSearchQuery(busca)
    if (categoria) setSelectedCategory(categoria)
    if (admin === '1') setAdminOpen(true)
  }, [])

  // Manter URL atualizada
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams()
    if (selectedNewsSlug) params.set('noticia', selectedNewsSlug)
    if (searchQuery) params.set('busca', searchQuery)
    if (selectedCategory) params.set('categoria', selectedCategory)
    if (adminOpen) params.set('admin', '1')
    const qs = params.toString()
    const newUrl = qs ? `?${qs}` : window.location.pathname
    window.history.replaceState({}, '', newUrl)
  }, [selectedNewsSlug, searchQuery, selectedCategory, adminOpen])

  const handleOpenNews = useCallback((slug: string) => {
    setSelectedNewsSlug(slug)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

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
      document.getElementById('videos-section')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    if (section === 'videos') {
      document.getElementById('videos-section')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    if (section === 'contato') {
      document.getElementById('contato-section')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    if (section === 'quem-somos') {
      document.getElementById('quem-somos-section')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    if (section === 'radio') {
      document.getElementById('radio-section')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
  }, [])

  const handleSelectCategory = useCallback((category: string) => {
    setSelectedCategory(category)
    setSearchQuery(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const featured = news.find((n) => n.isFeatured) || news[0] || null
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
            onOpenNews={handleOpenNews}
          />
        ) : (
          <>
            <Hero
              featured={featured}
              secondary={secondary}
              highlights={highlights}
              onOpenNews={handleOpenNews}
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

            {/* Seções auxiliares - apenas placeholders mínimos para navegação */}
            <section id="quem-somos-section" className="py-12 bg-white scroll-mt-24">
              <div className="mx-auto max-w-7xl px-4 text-center">
                <h2 className="text-[#C8102E] font-black text-3xl uppercase mb-4">
                  Quem Somos
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  A TV Goiás é o portal de notícias líder no estado, com cobertura
                  completa de política, economia, cidades, polícia, esporte e mais.
                  Levamos notícias do tamanho da verdade aos goianos todos os dias.
                </p>
              </div>
            </section>

            <section id="radio-section" className="py-12 bg-gray-100 scroll-mt-24">
              <div className="mx-auto max-w-7xl px-4 text-center">
                <h2 className="text-[#C8102E] font-black text-3xl uppercase mb-4">
                  Rádio TV Goiás
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Sintonize na nossa rádio para acompanhar as notícias ao vivo,
                  música e muito mais. 24 horas no ar para você.
                </p>
              </div>
            </section>

            <section id="contato-section" className="py-12 bg-white scroll-mt-24">
              <div className="mx-auto max-w-7xl px-4 text-center">
                <h2 className="text-[#C8102E] font-black text-3xl uppercase mb-4">
                  Contato
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                  Entre em contato: (61) 9 8343-7443 (WhatsApp) ou
                  @tvgoiasoficial (Instagram)
                </p>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />

      {/* Botão flutuante: voltar ao topo + cadastrar matéria */}
      {selectedCategory && (
        <button
          onClick={() => setSelectedCategory(null)}
          className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center text-white shadow-lg transition-colors"
          aria-label="Voltar ao topo"
        >
          <HomeIcon className="w-5 h-5" />
        </button>
      )}
      <button
        onClick={() => setAdminOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-5 py-3 rounded-full bg-[#C8102E] hover:bg-[#a50d26] flex items-center gap-2 text-white font-bold text-sm shadow-xl transition-colors"
        aria-label="Cadastrar nova matéria"
      >
        <Plus className="w-5 h-5" />
        Nova Matéria
      </button>

      {/* Modais */}
      {selectedNewsSlug && (
        <NewsDetailModal
          slug={selectedNewsSlug}
          onClose={() => setSelectedNewsSlug(null)}
          onOpenNews={handleOpenNews}
        />
      )}

      {searchQuery && (
        <SearchResults
          query={searchQuery}
          onClose={() => setSearchQuery(null)}
          onOpenNews={handleOpenNews}
        />
      )}

      {adminOpen && (
        <AdminForm
          onClose={() => setAdminOpen(false)}
          onCreated={() => loadData()}
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
