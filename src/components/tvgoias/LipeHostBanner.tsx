'use client'

import { Code2, Cloud, Smartphone, ArrowRight } from 'lucide-react'

export function LipeHostBanner() {
  return (
    <section className="bg-black border-y border-white/10">
      <a
        href="https://lipe.host"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full group"
        aria-label="Lipe.Host - Criação de sistemas, apps e cloud. Clique para visitar."
      >
        {/* Container com pattern de linhas brancas (design tecnológico) */}
        <div className="relative mx-auto max-w-7xl px-4 py-6 overflow-hidden">
          {/* Linhas decorativas de fundo (pattern tecnológico) */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(90deg, transparent 0%, transparent 49%, rgba(255,255,255,0.4) 49.5%, rgba(255,255,255,0.4) 50%, transparent 50.5%, transparent 100%),
                linear-gradient(0deg, transparent 0%, transparent 49%, rgba(255,255,255,0.4) 49.5%, rgba(255,255,255,0.4) 50%, transparent 50.5%, transparent 100%)
              `,
              backgroundSize: '60px 60px, 60px 60px',
            }}
          />
          {/* Linhas diagonais sutis */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.3) 20px, rgba(255,255,255,0.3) 21px)',
            }}
          />

          {/* Conteúdo */}
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Lado esquerdo: ícones + texto principal */}
            <div className="flex items-center gap-4">
              {/* Ícones tecnológicos agrupados */}
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

            {/* Lado direito: CTA */}
            <div className="flex items-center gap-2 text-white group-hover:gap-3 transition-all">
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
