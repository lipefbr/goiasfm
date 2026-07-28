'use client'

import { useState, useEffect, FormEvent } from 'react'
import { X, Send, CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface AdminFormProps {
  onClose: () => void
  onCreated: () => void
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

export function AdminForm({ onClose, onCreated }: AdminFormProps) {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [imageUrl, setImageUrl] = useState('')
  const [isLive, setIsLive] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const [isSecondary, setIsSecondary] = useState(false)
  const [isHighlight, setIsHighlight] = useState(true)
  const [hoursAgo, setHoursAgo] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title || !summary || !category || !imageUrl) {
      toast.error('Preencha os campos obrigatórios')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          summary,
          content,
          category,
          imageUrl,
          isLive,
          isFeatured,
          isSecondary,
          isHighlight,
          hoursAgo,
        }),
      })
      if (!res.ok) throw new Error('Falha ao cadastrar')
      setSuccess(true)
      toast.success('Notícia cadastrada com sucesso!')
      setTimeout(() => {
        onCreated()
        onClose()
      }, 1500)
    } catch (err) {
      console.error(err)
      toast.error('Erro ao cadastrar notícia')
    } finally {
      setLoading(false)
    }
  }

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
        className="bg-white w-full max-w-2xl my-8 mx-4 rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#C8102E] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-black text-lg uppercase tracking-wide">
            Cadastrar Nova Matéria
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-white/90 hover:text-white"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {success ? (
          <div className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-black font-bold text-lg">
              Notícia cadastrada com sucesso!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Título *
              </label>
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
              <label className="block text-sm font-bold text-black mb-1">
                Resumo *
              </label>
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
              <label className="block text-sm font-bold text-black mb-1">
                Conteúdo Completo
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="Texto completo da notícia (parágrafos separados por linha em branco)"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#C8102E]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Categoria *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#C8102E]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Há quantas horas? *
                </label>
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
                URL da Imagem *
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#C8102E]"
              />
              {imageUrl && (
                <div className="mt-2 aspect-video rounded overflow-hidden bg-gray-100">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <fieldset>
              <legend className="block text-sm font-bold text-black mb-2">
                Posicionamento
              </legend>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={isLive}
                    onChange={(e) => setIsLive(e.target.checked)}
                    className="accent-[#C8102E]"
                  />
                  <span className="text-sm">AO VIVO</span>
                </label>
                <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-[#C8102E]"
                  />
                  <span className="text-sm">Card Principal (Hero)</span>
                </label>
                <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={isSecondary}
                    onChange={(e) => setIsSecondary(e.target.checked)}
                    className="accent-[#C8102E]"
                  />
                  <span className="text-sm">Card Secundário (Hero)</span>
                </label>
                <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={isHighlight}
                    onChange={(e) => setIsHighlight(e.target.checked)}
                    className="accent-[#C8102E]"
                  />
                  <span className="text-sm">Destaques Sidebar</span>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Dica: marque apenas um posicionamento por vez para evitar
                sobreposição.
              </p>
            </fieldset>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
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
                  <Send className="w-4 h-4" />
                )}
                {loading ? 'Cadastrando...' : 'Publicar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}


