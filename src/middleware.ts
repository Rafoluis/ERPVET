import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'

export default withAuth(
  function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    const isAuthenticated = !!req.cookies.get('next-auth.session-token')


    if (isAuthenticated && pathname === '/auth/login') {
      return NextResponse.redirect(new URL('/list/appointments', req.url))
    }

    if (pathname === '/') {
      return NextResponse.redirect(
        new URL(isAuthenticated ? '/list/appointments' : '/auth/login', req.url)
      )
    }

    if (!isAuthenticated) {
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
    '/auth/:path', 
  ],
}
