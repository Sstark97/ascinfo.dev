import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const CANONICAL_HOST = 'ascinfo.dev'

export function proxy(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') ?? ''
  let hasRedirect = false

  // Redirect www to non-www (301 permanent)
  if (hostname.startsWith('www.')) {
    url.host = CANONICAL_HOST
    hasRedirect = true
  }

  // Force lowercase URLs (only for paths, not query strings)
  const lowercasePath = url.pathname.toLowerCase()
  if (url.pathname !== lowercasePath) {
    url.pathname = lowercasePath
    hasRedirect = true
  }

  // Apply redirect if needed
  if (hasRedirect) {
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
}
