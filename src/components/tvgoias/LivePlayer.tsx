'use client'

import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

interface LivePlayerProps {
  src: string
  className?: string
}

export function LivePlayer({ src, className }: LivePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<'loading' | 'playing' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState<string>('')

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus('loading')
    setErrorMsg('')

    let hls: Hls | null = null

    function tryNativePlay() {
      video!.src = src
      video!.play().catch(() => {
        // Autoplay bloqueado - aguarda interação
      })
    }

    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true })
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video!.play().then(() => setStatus('playing')).catch(() => {
          setStatus('playing') // Mesmo sem autoplay, o vídeo está pronto
        })
      })
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setErrorMsg('Erro de rede ao carregar o stream ao vivo.')
              setStatus('error')
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              try {
                hls?.recoverMediaError()
              } catch {
                setErrorMsg('Erro de mídia ao carregar o stream.')
                setStatus('error')
              }
              break
            default:
              setErrorMsg('Não foi possível carregar o stream ao vivo.')
              setStatus('error')
              break
          }
        }
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari/iOS suporta HLS nativamente
      tryNativePlay()
      setStatus('playing')
    } else {
      setErrorMsg('Seu navegador não suporta HLS.')
      setStatus('error')
    }

    return () => {
      if (hls) {
        hls.destroy()
      }
      video.removeAttribute('src')
      video.load()
    }
  }, [src])

  return (
    <div className={`relative overflow-hidden bg-black ${className || ''}`}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        autoPlay
        playsInline
        controls={false}
      />
      {status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
          <div className="w-12 h-12 border-4 border-white/30 border-t-[#C8102E] rounded-full animate-spin mb-3" />
          <p className="text-white text-sm">Carregando transmissão ao vivo...</p>
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#C8102E] flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5 19h14a2 2 0 001.7-3L13.7 4a2 2 0 00-3.4 0L3.3 16A2 2 0 005 19z" />
            </svg>
          </div>
          <p className="text-white text-sm font-bold mb-1">Stream indisponível</p>
          <p className="text-gray-400 text-xs max-w-md">{errorMsg}</p>
        </div>
      )}
    </div>
  )
}
