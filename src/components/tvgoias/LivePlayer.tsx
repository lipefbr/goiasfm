'use client'

import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

interface LivePlayerProps {
  src: string
  className?: string
}

/**
 * Decide a URL inicial do stream:
 * - Se a página está em HTTPS (preview externo, iframe), usa o proxy interno
 *   para evitar mixed content e problemas de certificado.
 * - Se a página está em HTTP (dev local), usa a URL direta.
 */
function getInitialUrl(src: string): { url: string; isProxy: boolean } {
  if (!src) return { url: src, isProxy: false }
  if (
    typeof window !== 'undefined' &&
    window.location.protocol === 'https:'
  ) {
    // Sempre usa o proxy em produção (HTTPS) para evitar:
    // - mixed content (HTTP stream em página HTTPS)
    // - certificado inválido do stream HTTPS
    // - CORS
    return { url: `/api/stream?url=${encodeURIComponent(src)}`, isProxy: true }
  }
  return { url: src, isProxy: false }
}

export function LivePlayer({ src, className }: LivePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [status, setStatus] = useState<'loading' | 'playing' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    setStatus('loading')
    setErrorMsg('')

    let destroyed = false
    let recoverAttempts = 0
    const MAX_RECOVER_ATTEMPTS = 5

    function onPlaying() {
      if (!destroyed) setStatus('playing')
    }
    function onCanPlay() {
      if (!destroyed) setStatus('playing')
    }

    video.addEventListener('playing', onPlaying)
    video.addEventListener('canplay', onCanPlay)

    // Determina URL inicial: proxy se HTTPS, direta se HTTP
    const { url: initialUrl, isProxy: initialIsProxy } = getInitialUrl(src)
    const fallbackUrl =
      initialUrl === src
        ? `/api/stream?url=${encodeURIComponent(src)}`
        : src // se começou no proxy, fallback é a URL direta

    let currentUrl = initialUrl
    let currentIsProxy = initialIsProxy

    function createHls(url: string, isProxy: boolean) {
      if (destroyed) return
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        liveDurationInfinity: true,
        liveBackBufferLength: 0,
        stretchShortVideoTrack: true,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        liveSyncDurationCount: 3,
        manifestLoadingMaxRetry: 4,
        manifestLoadingRetryDelay: 1000,
        levelLoadingMaxRetry: 4,
        levelLoadingRetryDelay: 1000,
        fragLoadingMaxRetry: 6,
        fragLoadingRetryDelay: 500,
        fragLoadingMaxRetryTimeout: 8000,
        maxSeekHole: 2,
      })
      hlsRef.current = hls

      hls.loadSource(url)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (destroyed) return
        video
          .play()
          .then(() => {
            if (!destroyed) setStatus('playing')
          })
          .catch((err) => {
            console.warn('Autoplay bloqueado:', err)
            if (!destroyed) setStatus('playing')
          })
      })

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (destroyed) return

        if (data.fatal) {
          console.warn('HLS fatal error:', data.type, data.details, { url, isProxy })

          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // Se não está no proxy, tenta o proxy
              if (!isProxy && currentUrl !== fallbackUrl) {
                console.log('Caindo para o proxy HLS...')
                currentUrl = fallbackUrl
                currentIsProxy = true
                try {
                  hls.destroy()
                } catch {}
                setTimeout(() => {
                  if (!destroyed) createHls(fallbackUrl, true)
                }, 500)
                return
              }
              // Já está no proxy, tenta recuperar
              if (recoverAttempts < MAX_RECOVER_ATTEMPTS) {
                recoverAttempts++
                console.log(`Recuperando rede (${recoverAttempts}/${MAX_RECOVER_ATTEMPTS})...`)
                setTimeout(() => {
                  if (!destroyed) hls.startLoad()
                }, 1000)
              } else {
                setErrorMsg('Stream temporariamente indisponível. Atualize a página.')
                setStatus('error')
              }
              break

            case Hls.ErrorTypes.MEDIA_ERROR:
              if (recoverAttempts < MAX_RECOVER_ATTEMPTS) {
                recoverAttempts++
                console.log(`Recuperando mídia (${recoverAttempts}/${MAX_RECOVER_ATTEMPTS})...`)
                setTimeout(() => {
                  if (!destroyed) {
                    try {
                      hls.recoverMediaError()
                    } catch (e) {
                      console.error('Falha ao recuperar mídia:', e)
                    }
                  }
                }, 500)
              } else {
                setErrorMsg('Erro de mídia no stream. Atualize a página.')
                setStatus('error')
              }
              break

            default:
              if (!isProxy && currentUrl !== fallbackUrl) {
                console.log('Caindo para o proxy HLS após erro fatal...')
                currentUrl = fallbackUrl
                currentIsProxy = true
                try {
                  hls.destroy()
                } catch {}
                setTimeout(() => {
                  if (!destroyed) createHls(fallbackUrl, true)
                }, 500)
                return
              }
              setErrorMsg('Não foi possível carregar o stream ao vivo.')
              setStatus('error')
              break
          }
        } else {
          console.debug('HLS non-fatal error:', data.details)
        }
      })
    }

    if (Hls.isSupported()) {
      createHls(initialUrl, initialIsProxy)
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari/iOS suporta HLS nativamente
      video.src = initialUrl
      video
        .play()
        .then(() => {
          if (!destroyed) setStatus('playing')
        })
        .catch(() => {
          if (!destroyed) setStatus('playing')
        })
    } else {
      setErrorMsg('Seu navegador não suporta HLS.')
      setStatus('error')
    }

    return () => {
      destroyed = true
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('canplay', onCanPlay)
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
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
      const newMuted = !isMuted
      setIsMuted(newMuted)
      video.muted = newMuted
    }
  }

  function handleManualRetry() {
    if (typeof window !== 'undefined') {
      window.location.reload()
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
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 p-6 text-center pointer-events-auto">
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
          <p className="text-gray-400 text-xs max-w-md mb-3">{errorMsg}</p>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleManualRetry()
            }}
            className="bg-[#C8102E] hover:bg-[#a50d26] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
          >
            Tentar novamente
          </button>
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
