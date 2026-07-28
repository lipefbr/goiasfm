'use client'

import { Phone, Instagram, Megaphone } from 'lucide-react'

export function BlackBar() {
  return (
    <section className="bg-black py-5">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 md:gap-8">
          {/* WhatsApp - Esquerda */}
          <a
            href="https://wa.me/5561983437443"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 justify-center md:justify-start"
          >
            <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6 text-white" fill="white" />
            </div>
            <div className="leading-tight">
              <div className="text-white font-black text-lg">(61) 9 8343-7443</div>
              <div className="text-gray-400 text-[11px] font-semibold tracking-widest">
                ENVIE SUA NOTÍCIA
              </div>
            </div>
          </a>

          {/* Banner central - O GLOBAL NOTÍCIAS */}
          <div className="flex justify-center">
            <div className="bg-[#C8102E] px-8 py-3 text-center relative" style={{
              clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)'
            }}>
              <Megaphone className="w-5 h-5 text-white mx-auto mb-1 inline" />
              <div className="text-white font-black text-xl leading-tight">
                O GLOBAL NOTÍCIAS
              </div>
              <div className="text-white/90 text-[10px] font-semibold tracking-widest mt-0.5">
                NOTÍCIAS DO TAMANHO DA VERDADE
              </div>
            </div>
          </div>

          {/* Instagram - Direita */}
          <a
            href="https://instagram.com/tvgoiasoficial"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 justify-center md:justify-end"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F77737] via-[#E1306C] to-[#833AB4] flex items-center justify-center shrink-0">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-white font-black text-lg">@tvgoiasoficial</div>
              <div className="text-gray-400 text-[11px] font-semibold tracking-widest">
                SIGA NOSSO INSTAGRAM
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
