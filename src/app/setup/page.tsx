'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Loader2,
  Database,
  CheckCircle,
  AlertCircle,
  Lock,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface SeedStatus {
  counts: Record<string, number>
  isEmpty: boolean
  needsSetup: boolean
  setupDisabled?: boolean
}

export default function SetupPage() {
  const router = useRouter()
  const [status, setStatus] = useState<SeedStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [apiError, setApiError] = useState(false)

  useEffect(() => {
    fetch('/api/seed')
      .then(async (r) => {
        const data = await r.json()
        if (!r.ok) {
          throw new Error(data.error || `HTTP ${r.status}`)
        }
        setStatus(data)
        setLoading(false)
      })
      .catch((e) => {
        console.error('Erro ao verificar banco:', e)
        setError(
          'Erro ao conectar com o banco de dados. Isso pode acontecer se ' +
            'o banco ainda não foi inicializado no servidor. Tente ' +
            'inicializar abaixo — se não funcionar, entre em contato com ' +
            'o suporte.'
        )
        setApiError(true)
        setLoading(false)
      })
  }, [])

  // Mesmo com erro de API, permite tentar o POST /api/seed
  // (que pode funcionar se o problema for só no GET)

  async function handleSeed() {
    if (
      !confirm(
        'Vai inicializar o banco com dados de demonstração.\n\nIsso cria:\n• Usuário admin (admin@tvgoias.com / admin123)\n• 25 notícias\n• 4 vídeos\n• 10 categorias\n• Link do stream ao vivo\n\nSó preenche tabelas vazias (não sobrescreve). Continuar?'
      )
    ) {
      return
    }
    setSeeding(true)
    setError('')
    try {
      const res = await fetch('/api/seed', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Falha ao inicializar')
      setDone(true)
      setApiError(false)
      // Atualiza status
      fetch('/api/seed')
        .then((r) => r.json())
        .then(setStatus)
        .catch(() => {})
    } catch (e) {
      console.error(e)
      setError(
        e instanceof Error ? e.message : 'Erro ao inicializar banco'
      )
    } finally {
      setSeeding(false)
    }
  }

  // Estado: carregando
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0008] via-[#2a0010] to-[#0a0004]">
        <Loader2 className="w-10 h-10 border-4 border-white/30 border-t-[#C8102E] rounded-full animate-spin" />
      </div>
    )
  }

  // Estado: erro de API (banco não inicializado ou indisponível)
  if (apiError && !done) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a0008] via-[#2a0010] to-[#0a0004]">
        <header className="bg-black/30 backdrop-blur border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image
                src="/tvgoias-logo.png"
                alt="TV Goiás"
                width={100}
                height={46}
                priority
                className="h-10 w-auto object-contain"
              />
            </Link>
            <Link
              href="/"
              className="text-sm font-bold text-white/70 hover:text-white transition-colors"
            >
              ← Ver Site
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-lg">
            <div className="bg-white rounded-lg shadow-2xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-black text-black">
                  Banco não inicializado
                </h1>
                <p className="text-gray-500 text-sm mt-1">{error}</p>
              </div>

              {error && error !== 'Erro ao verificar banco de dados' && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="break-all">{error}</span>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-6 text-xs text-blue-800">
                <strong>O que isso significa?</strong> O banco de dados
                SQLite precisa ser inicializado no servidor. Clique no
                botão abaixo para tentar criar as tabelas e popular o
                banco automaticamente.
              </div>

              <button
                onClick={handleSeed}
                disabled={seeding}
                className="w-full py-3 rounded bg-[#C8102E] hover:bg-[#a50d26] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                {seeding ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Inicializando...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    Tentar Inicializar Banco
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                Se o erro persistir, verifique se a variável
                <code className="bg-gray-100 px-1 rounded mx-1">
                  DATABASE_URL
                </code>
                está configurada corretamente no servidor.
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Estado: setup desativado pelo admin
  if (status?.setupDisabled) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a0008] via-[#2a0010] to-[#0a0004] px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-black mb-2">
            Setup desativado
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            A página de configuração inicial foi desativada pelo
            administrador. Para gerenciar os dados do site, acesse o painel
            admin.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/admin"
              className="w-full py-3 rounded bg-[#C8102E] hover:bg-[#a50d26] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              Ir para o Painel Admin
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="w-full py-3 rounded text-gray-600 hover:text-black text-sm font-bold transition-colors"
            >
              Ver o site
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Estado: setup já foi feito (banco populado)
  if (status && !status.needsSetup && done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a0008] via-[#2a0010] to-[#0a0004] px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-black mb-2">
            Banco inicializado!
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            O banco foi populado com {status.counts.news} notícias,{' '}
            {status.counts.videos} vídeos e {status.counts.categories}{' '}
            categorias. Agora você pode fazer login no painel admin.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wide">
              Credenciais de acesso
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <code className="bg-white px-2 py-0.5 rounded font-mono">
                  admin@tvgoias.com
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Senha:</span>
                <code className="bg-white px-2 py-0.5 rounded font-mono">
                  admin123
                </code>
              </div>
            </div>
          </div>
          <Link
            href="/login"
            className="w-full py-3 rounded bg-[#C8102E] hover:bg-[#a50d26] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            Fazer Login
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  // Estado: setup já foi feito antes (mas o usuário acessou a página de novo)
  if (status && !status.needsSetup && !done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a0008] via-[#2a0010] to-[#0a0004] px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-black mb-2">
            Banco já configurado
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            O banco de dados já foi populado anteriormente. Conteúdo atual:
          </p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gray-50 rounded p-3">
              <div className="text-xl font-black text-[#C8102E]">
                {status.counts.news}
              </div>
              <div className="text-[10px] text-gray-500 uppercase">
                Notícias
              </div>
            </div>
            <div className="bg-gray-50 rounded p-3">
              <div className="text-xl font-black text-[#C8102E]">
                {status.counts.videos}
              </div>
              <div className="text-[10px] text-gray-500 uppercase">Vídeos</div>
            </div>
            <div className="bg-gray-50 rounded p-3">
              <div className="text-xl font-black text-[#C8102E]">
                {status.counts.categories}
              </div>
              <div className="text-[10px] text-gray-500 uppercase">
                Categorias
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-3 rounded bg-[#C8102E] hover:bg-[#a50d26] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              Fazer Login
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="w-full py-3 rounded text-gray-600 hover:text-black text-sm font-bold transition-colors"
            >
              Ver o site
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Estado: banco vazio, pronto para setup
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a0008] via-[#2a0010] to-[#0a0004]">
      <header className="bg-black/30 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/tvgoias-logo.png"
              alt="TV Goiás"
              width={100}
              height={46}
              priority
              className="h-10 w-auto object-contain"
            />
          </Link>
          <Link
            href="/"
            className="text-sm font-bold text-white/70 hover:text-white transition-colors"
          >
            ← Ver Site
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-lg shadow-2xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#C8102E] flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-black text-black">
                Configuração Inicial
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Popule o banco de dados com conteúdo de demonstração para
                começar a usar o site.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* O que será criado */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                O que será criado
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span>
                    <strong>1 usuário admin</strong> — admin@tvgoias.com /
                    admin123
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span>
                    <strong>25 notícias</strong> com imagens e categorias
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span>
                    <strong>4 vídeos</strong> com thumbnails e duração
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span>
                    <strong>10 categorias</strong> (Política, Economia, etc.)
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span>
                    <strong>Link do stream ao vivo</strong> da TV Goiás
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-6 text-xs text-amber-800">
              <strong>⚠️ Importante:</strong> depois de popular o banco,
              acesse o painel admin e <strong>desative esta página de
              setup</strong> para evitar que outras pessoas possam
              re-popular o banco.
            </div>

            <button
              onClick={handleSeed}
              disabled={seeding}
              className="w-full py-3 rounded bg-[#C8102E] hover:bg-[#a50d26] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {seeding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Inicializando banco...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  Inicializar Banco Agora
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              Só preenche tabelas vazias. Não sobrescreve nem apaga dados
              existentes.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
