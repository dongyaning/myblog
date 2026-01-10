import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { verifyToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /admin/dashboard and other admin routes (except /admin login page)
  if (pathname.startsWith('/admin/dashboard') || pathname.startsWith('/api/admin/analytics')) {
    const token = request.cookies.get('admin_token')?.value

    if (!token || !(await verifyToken(token))) {
      // Redirect to login page
      if (pathname.startsWith('/admin/dashboard')) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      // Return 401 for API routes
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/dashboard/:path*', '/api/admin/analytics/:path*'],
}
