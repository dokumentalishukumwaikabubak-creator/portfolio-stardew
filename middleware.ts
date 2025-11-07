import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add security headers for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('X-XSS-Protection', '1; mode=block')
  }

  // Note: Full authentication check is handled client-side in each admin page
  // Server-side auth check requires @supabase/ssr package
  // For now, we rely on client-side checks + RLS policies in database

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}

