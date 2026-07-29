'use client'

import { Code2, Cloud, Smartphone, ArrowRight, Zap } from 'lucide-react'

type BannerVariant = 'full' | 'compact' | 'card'

interface LipeHostBannerProps {
  variant?: BannerVariant
  className?: string
}

const TECH_PATTERN: React.CSSProperties = {
  backgroundImage: `
    linear-gradient(90deg, transparent 0%, transparent 49%, rgba(255,255,255,0.4) 49.5%, rgba(255,255,255,0.4) 50%, transparent 50.5%, transparent 100%),
    linear-gradient(0deg, transparent 0%, transparent 49%, rgba(255,255,255,0.4) 49.5%, rgba(255,255,255,0.4) 50%, transparent 50.5%, transparent 100%)
  `,
  backgroundSize: '60px 60px, 60px 60px',
}

const DIAGONAL_PATTERN: React.CSSProperties = {
  backgroundImage:
    'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.3) 20px, rgba(255,255,255,0.3) 21px)',
}

export function LipeHostBanner({ variant = 'full', className = '' }: LipeHostBannerProps) {
  // ====== VARIANT: CARD (no meio das notícias, formato de card) ======
  if (variant === 'card') {
    return (
      <a
        href="https://lipe.host"
        target="_blank"
        rel="noopener noreferrer"
        className={`block bg-black rounded-lg overflow-hidden text-left group border border-white/10 hover:border-[#C8102E]/40 hover:shadow-lg transition-all ${className}`}
        aria-label="Lipe.Host - Criação de sistemas, apps e cloud. Clique para visitar."
      >
        {/* Topo: pattern tecnológico com ícone */}
        <div className="relative aspect-video overflow-hidden bg-black">
          <div className="absolute inset-0 opacity-25" style={TECH_PATTERN} />
          <div className="absolute inset-0 opacity-15" style={DIAGONAL_PATTERN} />
          <div className="absolute inset-0 bg-gradient-to-br from-[#C8102E]/30 via-transparent to-transparent" />
          {/* Ícones centrais */}
          <div className="absolute inset-0 flex items-center justify-center gap-3">
            <div className="w-11 h-11 rounded-lg border border-white/40 bg-white/5 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div className="w-11 h-11 rounded-lg border border-white/40 bg-white/5 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="w-11 h-11 rounded-lg border border-white/40 bg-white/5 flex items-center justify-center">
              <Cloud className="w-5 h-5 text-white" />
            </div>
          </div>
          {/* Badge "PUBLICIDADE" no canto */}
          <span className="absolute top-2 left-2 bg-white/10 text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-widest">
            PUBLICIDADE
          </span>
        </div>
        {/* Conteúdo */}
        <div className="p-4">
          <h3 className="text-white font-black text-base leading-tight mb-1">
            Lipe<span className="text-[#C8102E]">.</span>Host
          </h3>
          <p className="text-gray-300 text-xs leading-snug mb-2 line-clamp-2">
            Criação de sistemas, apps, cloud e design tecnológico.
          </p>
          <div className="flex items-center gap-1.5 text-[#C8102E] group-hover:gap-2.5 transition-all">
            <span className="font-bold text-[11px] tracking-wide uppercase">
              Visitar
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </a>
    )
  }

  // ====== VARIANT: COMPACT (embaixo do player, largura do player) ======
  if (variant === 'compact') {
    return (
      <a
        href="https://lipe.host"
        target="_blank"
        rel="noopener noreferrer"
        className={`block bg-black border border-white/10 rounded-lg overflow-hidden group ${className}`}
        aria-label="Lipe.Host - Criação de sistemas, apps e cloud. Clique para visitar."
      >
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={TECH_PATTERN} />
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={DIAGONAL_PATTERN} />
          <div className="relative flex items-center justify-between gap-3 p-3 sm:p-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                <div className="w-8 h-8 rounded border border-white/30 bg-white/5 flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-white" />
                </div>
                <div className="w-8 h-8 rounded border border-white/30 bg-white/5 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-white" />
                </div>
                <div className="w-8 h-8 rounded border border-white/30 bg-white/5 flex items-center justify-center">
                  <Cloud className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="text-white font-black text-base sm:text-lg leading-tight truncate">
                  Lipe<span className="text-[#C8102E]">.</span>Host
                </h3>
                <p className="text-gray-300 text-[11px] sm:text-xs tracking-wide truncate">
                  Sistemas · apps · cloud · design tecnológico
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 text-white">
              <span className="hidden sm:inline font-bold text-xs tracking-wide uppercase">
                Visitar
              </span>
              <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#C8102E] border border-white/30 flex items-center justify-center transition-colors">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </a>
    )
  }

  // ====== VARIANT: FULL (acima do Mais Notícias, largura total) ======
  return (
    <section className={`bg-black border-y border-white/10 ${className}`}>
      <a
        href="https://lipe.host"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full group"
        aria-label="Lipe.Host - Criação de sistemas, apps e cloud. Clique para visitar."
      >
        <div className="relative mx-auto max-w-7xl px-4 py-6 overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={TECH_PATTERN} />
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={DIAGONAL_PATTERN} />
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg border border-white/30 bg-white/5 flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 rounded-lg border border-white/30 bg-white/5 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 rounded-lg border border-white/30 bg-white/5 flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-white font-black text-xl sm:text-2xl tracking-tight">
                  Lipe<span className="text-[#C8102E]">.</span>Host
                </h2>
                <p className="text-gray-300 text-xs sm:text-sm font-medium tracking-wide">
                  Criação de sistemas · apps · cloud · design tecnológico
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white group-hover:gap-3 transition-all">
              <Zap className="w-4 h-4 text-[#C8102E]" />
              <span className="font-bold text-sm sm:text-base tracking-wide uppercase">
                Visitar
              </span>
              <div className="w-9 h-9 rounded-full bg-white/10 group-hover:bg-[#C8102E] border border-white/30 flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </a>
    </section>
  )
}
