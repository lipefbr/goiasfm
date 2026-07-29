'use client'

import { Play } from 'lucide-react'

interface VideoItem {
  id: string
  title: string
  duration: string
  imageUrl: string
  youtubeId: string | null
  date: string | Date
}

interface VideosSectionProps {
  videos: VideoItem[]
}

function formatDate(date: string | Date) {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function VideosSection({ videos }: VideosSectionProps) {
  return (
    <div className="py-8">
      <h2 className="text-[#C8102E] font-black text-2xl uppercase tracking-tight mb-6 flex items-center gap-3">
        <span className="w-1.5 h-7 bg-[#C8102E]" />
        Vídeos
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {videos.slice(0, 4).map((v) => (
          <a
            key={v.id}
            href={v.youtubeId ? `https://www.youtube.com/watch?v=${v.youtubeId}` : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
              <img
                src={v.imageUrl}
                alt={v.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const img = e.currentTarget
                  if (!img.dataset.fallback) {
                    img.dataset.fallback = '1'
                    img.src = 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&q=80'
                  }
                }}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

              {/* Botão play */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-[#C8102E]/90 group-hover:bg-[#C8102E] flex items-center justify-center transition-all group-hover:scale-110 shadow-lg">
                  <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                </div>
              </div>

              {/* Badge de duração */}
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-2 py-0.5 rounded">
                {v.duration}
              </div>
            </div>
            <h3 className="text-black font-bold text-sm leading-snug mt-3 line-clamp-2 group-hover:text-[#C8102E] transition-colors">
              {v.title}
            </h3>
            <span className="text-gray-500 text-xs">{formatDate(v.date)}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
