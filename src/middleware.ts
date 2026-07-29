export { default } from 'next-auth/middleware'

export const config = {
  // Protege apenas rotas /admin (não protege /login nem /api)
  matcher: ['/admin/:path*'],
}
