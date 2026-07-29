'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, LogIn, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError('Email ou senha incorretos')
        setLoading(false)
      } else if (res?.ok) {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      setError('Erro ao fazer login. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a0008] via-[#2a0010] to-[#0a0004]">
      <header className="bg-black/30 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#C8102E] flex items-center justify-center">
              <span className="text-white font-black text-lg">G</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-white/70 tracking-wider block leading-none">TV</span>
              <span className="text-lg font-black text-white tracking-tight leading-none">GOIÁS</span>
            </div>
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
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-2xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#C8102E] flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-black text-black">Painel Administrativo</h1>
              <p className="text-gray-500 text-sm mt-1">
                Faça login para gerenciar notícias e o stream ao vivo
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                  placeholder="admin@tvgoias.com"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded bg-[#C8102E] hover:bg-[#a50d26] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Entrar
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                Credenciais padrão: <code className="bg-gray-100 px-1.5 py-0.5 rounded">admin@tvgoias.com</code> /{' '}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded">admin123</code>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Troque a senha após o primeiro acesso.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
