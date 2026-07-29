'use client'

import { Search, Facebook, Instagram, Youtube, Menu, X } from 'lucide-react'
import { useState, FormEvent } from 'react'
import Image from 'next/image'

interface HeaderProps {
  onSearch: (q: string) => void
  onNavigate: (section: string) => void
}

const MENU_ITEMS = [
  { label: 'QUEM SOMOS', section: 'quem-somos' },
  { label: 'NOTÍCIAS', section: 'noticias' },
  { label: 'RÁDIO', section: 'radio' },
  { label: 'VÍDEOS', section: 'videos' },
  { label: 'CONTATO', section: 'contato' },
]

export function Header({ onSearch, onNavigate }: HeaderProps) {
  const [searchValue, setSearchValue] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (searchValue.trim()) {
      onSearch(searchValue.trim())
      setSearchValue('')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Barra vermelha fina no topo */}
      <div className="h-1.5 bg-[#C8102E]" />

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo TV GOIÁS */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center shrink-0"
            aria-label="TV Goiás - Página inicial"
          >
            <Image
              src="/tvgoias-logo.png"
              alt="TV Goiás"
              width={120}
              height={56}
              priority
              className="h-12 w-auto object-contain"
            />
          </button>

          {/* Menu centralizado - desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.section}
                onClick={() => onNavigate(item.section)}
                className="text-sm font-bold text-black hover:text-[#C8102E] transition-colors tracking-wide"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Lado direito: busca + sociais */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSubmit} className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Buscar notícias..."
                  className="w-48 lg:w-56 pl-4 pr-10 py-2 text-sm rounded-full bg-gray-100 border border-gray-200 focus:outline-none focus:border-[#C8102E] focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#C8102E]"
                  aria-label="Buscar"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Ícones sociais */}
            <div className="hidden sm:flex items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#C8102E] flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-white" fill="white" />
              </a>
              <a
                href="https://instagram.com/tvgoiasoficial"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#C8102E] flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#C8102E] flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4 text-white" fill="white" />
              </a>
            </div>

            {/* Botão mobile */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-black"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <nav className="lg:hidden bg-white border-t border-gray-100 px-4 py-4">
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Buscar notícias..."
                className="w-full pl-4 pr-10 py-2 text-sm rounded-full bg-gray-100 border border-gray-200 focus:outline-none focus:border-[#C8102E]"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
          <div className="flex flex-col gap-3">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.section}
                onClick={() => {
                  onNavigate(item.section)
                  setMobileOpen(false)
                }}
                className="text-left text-sm font-bold text-black hover:text-[#C8102E] py-2"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#C8102E] flex items-center justify-center">
              <Facebook className="w-4 h-4 text-white" fill="white" />
            </a>
            <a href="https://instagram.com/tvgoiasoficial" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#C8102E] flex items-center justify-center">
              <Instagram className="w-4 h-4 text-white" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#C8102E] flex items-center justify-center">
              <Youtube className="w-4 h-4 text-white" fill="white" />
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
