import { NextRequest, NextResponse } from 'next/server'

// GET /api/stream?url=<URL_HLS>
// Proxy HLS: busca o manifesto (ou chunk) e devolve com CORS liberado.
// Necessário para contornar:
//  - Mixed content (HTTPS preview buscando stream HTTP)
//  - CORS restrictions
//  - Certificados inválidos (stream HTTPS da TV Goiás tem cert inconsistente)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const targetUrl = searchParams.get('url')

  if (!targetUrl) {
    return NextResponse.json(
      { error: 'Parâmetro url é obrigatório' },
      { status: 400 }
    )
  }

  let parsed: URL
  try {
    parsed = new URL(targetUrl)
  } catch {
    return NextResponse.json({ error: 'URL inválida' }, { status: 400 })
  }

  const isManifest = parsed.pathname.endsWith('.m3u8')
  const isChunk = parsed.pathname.endsWith('.ts')

  if (!isManifest && !isChunk) {
    return NextResponse.json(
      { error: 'Apenas arquivos .m3u8 ou .ts são permitidos' },
      { status: 400 }
    )
  }

  // Tenta a URL original primeiro; se falhar (certificado/conexão),
  // tenta a versão HTTP (que tem CORS liberado).
  const urlsToTry: string[] = [targetUrl]
  if (parsed.protocol === 'https:') {
    urlsToTry.push(targetUrl.replace('https://', 'http://'))
  }

  let upstream: Response | null = null
  let lastError: string = ''

  for (const url of urlsToTry) {
    try {
      upstream = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; TVGoiasPlayer/1.0)',
          Accept: '*/*',
        },
      })
      if (upstream.ok) break
      lastError = `HTTP ${upstream.status}`
      upstream = null
    } catch (e: unknown) {
      lastError = e instanceof Error ? e.message : String(e)
      console.warn(`[/api/stream] falhou ${url}:`, lastError)
      continue
    }
  }

  if (!upstream) {
    return NextResponse.json(
      { error: `Erro ao buscar stream: ${lastError}` },
      { status: 502 }
    )
  }

  // Para chunks .ts (binário), retorna direto como ArrayBuffer
  if (isChunk) {
    const buffer = await upstream.arrayBuffer()
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp2t',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    })
  }

  // Para .m3u8 (texto), reescreve URLs relativas para passarem pelo proxy
  const body = await upstream.text()
  const basePath = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1)
  const finalBody = body
    .split('\n')
    .map((line) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return line
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return `/api/stream?url=${encodeURIComponent(trimmed)}`
      }
      const absoluteUrl = new URL(trimmed, basePath).href
      return `/api/stream?url=${encodeURIComponent(absoluteUrl)}`
    })
    .join('\n')

  return new NextResponse(finalBody, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.apple.mpegurl',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  })
}
