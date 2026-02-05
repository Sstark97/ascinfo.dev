import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { hostname } = request.nextUrl
  
  // Redirect www to non-www
  if (hostname === 'www.ascinfo.dev') {
    const url = request.nextUrl.clone()
    url.hostname = 'ascinfo.dev'
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
}
