'use client'

import { LivePlayer } from './LivePlayer'

interface HeroProps {
  liveStreamUrl: string
}

export function Hero({ liveStreamUrl }: HeroProps) {
  return (
    <section className="relative bg-black">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
          <LivePlayer src={liveStreamUrl} className="w-full h-full" />

          {/* Badge AO VIVO - sobreposto no canto superior esquerdo */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#C8102E] px-3 py-1.5 rounded text-white text-xs font-bold tracking-wider shadow-lg pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            AO VIVO
          </div>

          {/* Badge TV GOIÁS - sobreposto no canto superior direito */}
          <div className="absolute top-4 right-4 z-20 bg-black/70 backdrop-blur px-3 py-1.5 rounded text-white text-xs font-bold tracking-wider shadow-lg pointer-events-none flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#C8102E] flex items-center justify-center">
              <span className="text-white font-black text-[10px]">G</span>
            </div>
            TV GOIÁS
          </div>
        </div>
      </div>
    </section>
  )
}
