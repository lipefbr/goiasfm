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
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus('loading')
    setErrorMsg('')

    let hls: Hls | null = null

    // Quando o vídeo começa a tocar de fato (tem frames visíveis), marca como playing
    function onPlaying() {
      setStatus('playing')
    }
    function onWaiting() {
      // Volta para loading se ficar buffering (mas só se ainda não estiver em error)
      setStatus((s) => (s === 'error' ? s : 'loading'))
    }

    video.addEventListener('playing', onPlaying)
    video.addEventListener('canplay', onPlaying)
    video.addEventListener('waiting', onWaiting)

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        // Configurações para stream ao vivo mais estável
        liveDurationInfinity: true,
        liveBackBufferLength: 0,
      })
      hls.loadSource(src)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Tenta dar play; se bloquear por autoplay, o usuário vê o loading
        // e o clique no player resolve
        video
          .play()
          .then(() => setStatus('playing'))
          .catch((err) => {
            console.warn('Autoplay bloqueado:', err)
            // Não marca como erro - o usuário pode clicar para tocar
            setStatus('playing')
          })
      })

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          console.error('HLS fatal error:', data)
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // Tenta recuperar erro de rede
              try {
                hls?.startLoad()
              } catch {
                setErrorMsg(
                  'Erro de rede ao carregar o stream ao vivo. Verifique sua conexão.'
                )
                setStatus('error')
              }
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
      video.src = src
      video
        .play()
        .then(() => setStatus('playing'))
        .catch(() => setStatus('playing'))
    } else {
      setErrorMsg('Seu navegador não suporta HLS.')
      setStatus('error')
    }

    return () => {
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('canplay', onPlaying)
      video.removeEventListener('waiting', onWaiting)
      if (hls) {
        hls.destroy()
      }
      video.removeAttribute('src')
      video.load()
    }
  }, [src])

  function handleClick() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().catch(() => {})
    } else {
      // Toggle mute no clique
      const newMuted = !isMuted
      setIsMuted(newMuted)
      video.muted = newMuted
    }
  }

  return (
    <div
      className={`relative overflow-hidden bg-black cursor-pointer ${className || ''}`}
      onClick={handleClick}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted={isMuted}
        autoPlay
        playsInline
        controls={false}
      />
      {status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 pointer-events-none">
          <div className="w-12 h-12 border-4 border-white/30 border-t-[#C8102E] rounded-full animate-spin mb-3" />
          <p className="text-white text-sm">Carregando transmissão ao vivo...</p>
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#C8102E] flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M5 19h14a2 2 0 001.7-3L13.7 4a2 2 0 00-3.4 0L3.3 16A2 2 0 005 19z"
              />
            </svg>
          </div>
          <p className="text-white text-sm font-bold mb-1">Stream indisponível</p>
          <p className="text-gray-400 text-xs max-w-md">{errorMsg}</p>
        </div>
      )}
      {/* Indicador mute - só quando tocando */}
      {status === 'playing' && isMuted && (
        <div className="absolute bottom-3 right-3 z-20 bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 pointer-events-none">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth="2" />
          </svg>
          Clique para ativar som
        </div>
      )}
    </div>
  )
}
