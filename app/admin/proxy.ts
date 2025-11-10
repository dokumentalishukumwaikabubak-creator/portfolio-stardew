import { type NextRequest } from 'next/server'

export default async function handler(request: NextRequest) {
  return new Response(null, {
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-XSS-Protection': '1; mode=block',
    },
  })
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}