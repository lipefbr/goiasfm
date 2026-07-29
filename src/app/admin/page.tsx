'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  CheckCircle,
  Video,
  Newspaper,
  ArrowLeft,
  LogOut,
  User,
  Database,
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

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

const CATEGORIES = [
  'Política',
  'Economia',
  'Cidades',
  'Polícia',
  'Educação',
  'Esporte',
  'Saúde',
  'Entretenimento',
  'Tecnologia',
  'Brasil e Mundo',
]

export default function AdminPage() {
  const router = useRouter()
  const [news, setNews] = useState<NewsItem[]>([])
  const [liveStreamUrl, setLiveStreamUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [savingStream, setSavingStream] = useState(false)
  const [tab, setTab] = useState<'news' | 'stream' | 'system'>('news')
  const [seeding, setSeeding] = useState(false)
  const [seedStatus, setSeedStatus] = useState<{ counts: Record<string, number>; isEmpty: boolean } | null>(null)
  const { data: session, status } = useSession()

  // Redireciona para login se não estiver autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin')
    }
  }, [status, router])

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [newsRes, settingsRes] = await Promise.all([
        fetch('/api/news'),
        fetch('/api/settings'),
      ])
      const [newsData, settingsData] = await Promise.all([
        newsRes.json(),
        settingsRes.json(),
      ])
      setNews(newsData.news || [])
      setLiveStreamUrl(settingsData.settings?.live_stream_url || '')
    } catch (e) {
      console.error('Erro ao carregar dados:', e)
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleDelete(slug: string, title: string) {
    if (!confirm(`Excluir a notícia "${title}"?`)) return
    try {
      const res = await fetch(`/api/news/${slug}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Falha ao deletar')
      toast.success('Notícia excluída')
      loadData()
    } catch (e) {
      console.error(e)
      toast.error('Erro ao excluir')
    }
  }

  async function handleSaveStream() {
    setSavingStream(true)
    try {
      const res = await fetch('/api/settings/live_stream_url', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: liveStreamUrl }),
      })
      if (!res.ok) throw new Error('Falha ao salvar')
      toast.success('Link do stream ao vivo atualizado!')
    } catch (e) {
      console.error(e)
      toast.error('Erro ao salvar link')
    } finally {
      setSavingStream(false)
    }
  }

  // Carrega status do banco quando muda para tab sistema
  async function loadSeedStatus() {
    try {
      const res = await fetch('/api/seed')
      if (res.ok) {
        const data = await res.json()
        setSeedStatus(data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  // Popula o banco com dados de demonstração
  async function handleSeed() {
    if (!confirm('Popular o banco com dados de demonstração?\n\nIsso vai criar:\n• 1 usuário admin (admin@tvgoias.com)\n• 25 notícias\n• 4 vídeos\n• 10 categorias\n• 2 configurações\n\nSó preenche o que estiver vazio (não sobrescreve dados existentes).')) {
      return
    }
    setSeeding(true)
    try {
      const res = await fetch('/api/seed', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Falha ao popular')
      toast.success(`Banco populado! ${data.results.news} notícias, ${data.results.videos} vídeos, ${data.results.categories} categorias.`)
      loadData()
      loadSeedStatus()
    } catch (e) {
      console.error(e)
      toast.error('Erro ao popular banco')
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header admin */}
      <header className="bg-black text-white sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/tvgoias-logo.png"
              alt="TV Goiás"
              width={100}
              height={46}
              priority
              className="h-10 w-auto object-contain"
            />
            <div>
              <h1 className="font-black text-lg leading-none">Admin</h1>
              <p className="text-xs text-gray-400 mt-0.5">Painel de Administração</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-300">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="font-bold text-white text-xs">{session?.user?.name || 'Admin'}</div>
                <div className="text-[10px] text-gray-500">{session?.user?.email}</div>
              </div>
            </div>
            <Link
              href="/"
              className="text-sm font-bold text-white hover:text-[#C8102E] flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Ver Site</span>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-sm font-bold text-white hover:text-[#C8102E] flex items-center gap-1 transition-colors"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setTab('news')}
            className={`px-5 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
              tab === 'news'
                ? 'border-[#C8102E] text-[#C8102E]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            Notícias ({news.length})
          </button>
          <button
            onClick={() => setTab('stream')}
            className={`px-5 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
              tab === 'stream'
                ? 'border-[#C8102E] text-[#C8102E]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <Video className="w-4 h-4" />
            Vídeo Ao Vivo
          </button>
          <button
            onClick={() => {
              setTab('system')
              loadSeedStatus()
            }}
            className={`px-5 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
              tab === 'system'
                ? 'border-[#C8102E] text-[#C8102E]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <Database className="w-4 h-4" />
            Sistema
          </button>
        </div>

        {/* Tab: Notícias */}
        {tab === 'news' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-black">Gerenciar Notícias</h2>
              <button
                onClick={() => {
                  setEditingSlug(null)
                  setShowForm(true)
                }}
                className="px-5 py-2.5 rounded-full bg-[#C8102E] hover:bg-[#a50d26] text-white font-bold text-sm flex items-center gap-2 transition-colors shadow"
              >
                <Plus className="w-4 h-4" />
                Nova Notícia
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center">
                <Loader2 className="w-8 h-8 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : news.length === 0 ? (
              <div className="py-12 text-center bg-white rounded-lg">
                <p className="text-gray-500">Nenhuma notícia cadastrada.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Notícia</th>
                      <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Categoria</th>
                      <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Data</th>
                      <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {news.map((n) => (
                      <tr key={n.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 shrink-0">
                              <img
                                src={n.imageUrl}
                                alt={n.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const img = e.currentTarget
                                  if (!img.dataset.fallback) {
                                    img.dataset.fallback = '1'
                                    img.src = 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=100&q=80'
                                  }
                                }}
                              />
                            </div>
                            <div className="min-w-0">
                              <a
                                href={`/noticia/${n.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-sm text-black hover:text-[#C8102E] line-clamp-1 transition-colors"
                              >
                                {n.title}
                              </a>
                              <p className="text-xs text-gray-500 line-clamp-1">{n.summary}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="inline-block bg-[#C8102E]/10 text-[#C8102E] text-xs font-bold px-2 py-1 rounded">
                            {n.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500">
                          {new Date(n.date).toLocaleDateString('pt-BR')}
                          {n.hoursAgo > 0 && <span className="ml-2">Há {n.hoursAgo}h</span>}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingSlug(n.slug)
                                setShowForm(true)
                              }}
                              className="p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-[#C8102E] transition-colors"
                              aria-label="Editar"
                              title="Editar"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(n.slug, n.title)}
                              className="p-2 rounded hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
                              aria-label="Excluir"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab: Stream ao vivo */}
        {tab === 'stream' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-black text-black mb-2">Vídeo Ao Vivo</h2>
            <p className="text-gray-600 text-sm mb-6">
              Configure o link do stream ao vivo que aparece no topo da página inicial.
              Suportado: HLS (.m3u8), HTTP FLV, RTMP (via player compatível).
            </p>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <label className="block text-sm font-bold text-black mb-2">
                URL do Stream Ao Vivo (HLS .m3u8)
              </label>
              <input
                type="url"
                value={liveStreamUrl}
                onChange={(e) => setLiveStreamUrl(e.target.value)}
                placeholder="http://exemplo.com/stream/playlist.m3u8"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#C8102E] font-mono text-sm"
              />

              <div className="mt-4 p-4 bg-gray-50 rounded text-xs text-gray-600 space-y-2">
                <p className="font-bold text-gray-700">Exemplos de streams:</p>
                <p><code className="bg-white px-1 rounded">http://wz5.dnip.com.br/tvgoias/tvgoias.sdp/playlist.m3u8</code> (HLS atual)</p>
                <p><code className="bg-white px-1 rounded">https://example.com/live/stream.m3u8</code> (genérico HLS)</p>
              </div>

              <div className="flex items-center justify-end mt-6">
                <button
                  onClick={handleSaveStream}
                  disabled={savingStream}
                  className="px-6 py-2.5 rounded-full bg-[#C8102E] hover:bg-[#a50d26] text-white font-bold text-sm flex items-center gap-2 transition-colors disabled:opacity-60 shadow"
                >
                  {savingStream ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {savingStream ? 'Salvando...' : 'Salvar Link'}
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
              <strong>Dica:</strong> O stream é reproduzido via HLS.js, compatível com
              Chrome, Firefox, Edge e Safari. Para transmissões ao vivo, mantenha o
              formato <code className="bg-white px-1 rounded">.m3u8</code>.
            </div>
          </div>
        )}

        {/* Tab: Sistema */}
        {tab === 'system' && (
          <div className="max-w-3xl">
            <h2 className="text-xl font-black text-black mb-2">Sistema</h2>
            <p className="text-gray-600 text-sm mb-6">
              Gerencie os dados do banco. Use para popular o banco em produção
              após o primeiro deploy.
            </p>

            {/* Status atual do banco */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h3 className="font-black text-black mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-[#C8102E]" />
                Status do Banco de Dados
              </h3>
              {seedStatus ? (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="bg-gray-50 rounded p-3 text-center">
                    <div className="text-2xl font-black text-[#C8102E]">{seedStatus.counts.users}</div>
                    <div className="text-xs text-gray-500 mt-1">Usuários</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3 text-center">
                    <div className="text-2xl font-black text-[#C8102E]">{seedStatus.counts.news}</div>
                    <div className="text-xs text-gray-500 mt-1">Notícias</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3 text-center">
                    <div className="text-2xl font-black text-[#C8102E]">{seedStatus.counts.videos}</div>
                    <div className="text-xs text-gray-500 mt-1">Vídeos</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3 text-center">
                    <div className="text-2xl font-black text-[#C8102E]">{seedStatus.counts.categories}</div>
                    <div className="text-xs text-gray-500 mt-1">Categorias</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3 text-center">
                    <div className="text-2xl font-black text-[#C8102E]">{seedStatus.counts.settings}</div>
                    <div className="text-xs text-gray-500 mt-1">Configs</div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Loader2 className="w-6 h-6 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-gray-500 text-sm mt-2">Carregando...</p>
                </div>
              )}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={loadSeedStatus}
                  className="text-xs font-bold text-gray-500 hover:text-black"
                >
                  ↻ Atualizar
                </button>
              </div>
            </div>

            {/* Popular banco */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-black text-black mb-2">Popular Banco com Dados de Demonstração</h3>
              <p className="text-gray-600 text-sm mb-4">
                Cria dados iniciais para o site funcionar: 1 usuário admin
                (admin@tvgoias.com / admin123), 25 notícias, 4 vídeos, 10
                categorias e 2 configurações (link do stream).
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-4 text-xs text-amber-800">
                <strong>⚠️ Importante:</strong> Só preenche tabelas vazias. Não
                sobrescreve nem apaga dados existentes. Seguro para usar em
                produção.
              </div>
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="px-6 py-3 rounded-full bg-[#C8102E] hover:bg-[#a50d26] text-white font-bold text-sm flex items-center gap-2 transition-colors disabled:opacity-60 shadow"
              >
                {seeding ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Populando banco...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    Popular Banco Agora
                  </>
                )}
              </button>
            </div>

            {/* Credenciais admin */}
            <div className="bg-gray-900 rounded-lg p-6 mt-6 text-white">
              <h3 className="font-black mb-3">🔑 Credenciais Admin Padrão</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <code className="bg-black/40 px-2 py-0.5 rounded">admin@tvgoias.com</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Senha:</span>
                  <code className="bg-black/40 px-2 py-0.5 rounded">admin123</code>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Troque a senha após o primeiro login. Para criar mais usuários,
                use um cliente SQLite/Postgres direto no banco.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Formulário modal */}
      {showForm && (
        <NewsForm
          slug={editingSlug}
          onClose={() => {
            setShowForm(false)
            setEditingSlug(null)
          }}
          onSaved={() => {
            setShowForm(false)
            setEditingSlug(null)
            loadData()
          }}
        />
      )}
    </div>
  )
}

// =================== Formulário de Notícia ===================
interface NewsFormProps {
  slug: string | null
  onClose: () => void
  onSaved: () => void
}

function NewsForm({ slug, onClose, onSaved }: NewsFormProps) {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [imageUrl, setImageUrl] = useState('')
  const [hoursAgo, setHoursAgo] = useState(1)
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(!!slug)
  const [success, setSuccess] = useState(false)

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

  // Carregar dados se for edição
  useEffect(() => {
    if (!slug) return
    setLoadingData(true)
    fetch(`/api/news/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        const n = d.news
        setTitle(n.title)
        setSummary(n.summary)
        setContent(n.content)
        setCategory(n.category)
        setImageUrl(n.imageUrl)
        setHoursAgo(n.hoursAgo)
      })
      .catch((e) => {
        console.error(e)
        toast.error('Erro ao carregar notícia')
        onClose()
      })
      .finally(() => setLoadingData(false))
  }, [slug, onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !summary || !category) {
      toast.error('Preencha os campos obrigatórios')
      return
    }
    setLoading(true)
    try {
      const isEdit = !!slug
      const url = isEdit ? `/api/news/${slug}` : '/api/news'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          summary,
          content,
          category,
          imageUrl,
          hoursAgo,
        }),
      })
      if (!res.ok) throw new Error('Falha ao salvar')
      setSuccess(true)
      toast.success(isEdit ? 'Notícia atualizada!' : 'Notícia cadastrada!')
      setTimeout(() => onSaved(), 1200)
    } catch (err) {
      console.error(err)
      toast.error('Erro ao salvar notícia')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 flex items-start justify-center overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl my-8 mx-4 rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#C8102E] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-black text-lg">
            {slug ? 'Editar Notícia' : 'Nova Notícia'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-white/90 hover:text-white"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {loadingData ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : success ? (
          <div className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-black font-bold text-lg">
              {slug ? 'Notícia atualizada com sucesso!' : 'Notícia cadastrada com sucesso!'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-bold text-black mb-1">Título *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Digite o título da notícia"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#C8102E]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">Resumo *</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
                rows={2}
                placeholder="Resumo curto da notícia"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#C8102E]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">Conteúdo Completo</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="Texto completo da notícia (parágrafos separados por linha em branco)"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#C8102E]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">Categoria *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#C8102E]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Há quantas horas? *</label>
                <input
                  type="number"
                  min={0}
                  value={hoursAgo}
                  onChange={(e) => setHoursAgo(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#C8102E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">
                URL da Imagem <span className="text-gray-500 font-normal text-xs">(opcional - usa padrão por categoria)</span>
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... (deixe vazio para usar imagem padrão)"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#C8102E]"
              />
              {imageUrl ? (
                <div className="mt-2 aspect-video rounded overflow-hidden bg-gray-100">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  Vai usar imagem automática para a categoria <strong>{category}</strong>.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded text-sm font-bold text-black hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded bg-[#C8102E] hover:bg-[#a50d26] text-white text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {loading ? 'Salvando...' : slug ? 'Salvar Alterações' : 'Publicar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
