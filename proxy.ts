import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const CANONICAL_HOST = 'ascinfo.dev'

export function proxy(request: NextRequest): NextResponse {
  const { nextUrl } = request
  const hostname = request.headers.get('host') ?? ''
  
  // Only redirect www to non-www
  if (hostname.startsWith('www.')) {
    const url = nextUrl.clone()
    url.host = CANONICAL_HOST
    return NextResponse.redirect(url, 301)
  }

  // Continue without redirecting
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
