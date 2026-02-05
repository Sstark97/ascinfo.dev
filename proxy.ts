import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const CANONICAL_HOST = 'ascinfo.dev'

export function proxy(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') ?? ''

  // Redirect www to non-www (301 permanent)
  if (hostname.startsWith('www.')) {
    const redirectUrl = new URL(request.url)
    redirectUrl.host = CANONICAL_HOST
    return NextResponse.redirect(redirectUrl, 301)
  }

  // Force lowercase URLs
  if (url.pathname !== url.pathname.toLowerCase()) {
    url.pathname = url.pathname.toLowerCase()
    return NextResponse.redirect(url, 301)
  }

  // Remove trailing slashes (except root)
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1)
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
}
