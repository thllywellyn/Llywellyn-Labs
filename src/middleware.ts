import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  // Check if the user is trying to access protected routes
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      // Redirect to home with a search parameter to open the login modal
      return NextResponse.redirect(new URL('/?auth=login', request.url))
    }

    // Additional check for admin routes
    if (request.nextUrl.pathname.startsWith('/admin') && token.role !== 'ADMIN') {
      // Redirect non-admin users to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*']
}
