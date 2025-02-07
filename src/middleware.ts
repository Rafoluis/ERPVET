import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'

export default withAuth(
  function middleware(req: NextRequest) {
    if (req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    return NextResponse.next()
  },
  {
    pages: {
      signIn: '/auth/login',
    },
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/',
    '/doctor/:path*',
    '/list/:path*',
    '/receptionist/:path*',
    '/patient/:path*',
    '/admin/:path*',
  ],
}
