import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Middleware de autenticação para proteger /admin
// Usa getToken do next-auth/jwt para verificar o token JWT diretamente
// (mais robusto que depender do default export de next-auth/middleware)
export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || 'tvgoias-dev-secret-change-in-production',
  })

  // Se não tem token, redireciona para login
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Protege apenas rotas /admin (não protege /login nem /api)
  matcher: ['/admin/:path*'],
}
