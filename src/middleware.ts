import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'

const publicRoutes = ['/', '/auth/login']

const protectedRoutes = [
  '/list/appointments',
  '/doctor',
  '/receptionist',
  '/patient',
  '/admin'
]

const validRoutes = [...publicRoutes, ...protectedRoutes]

const defaultRoute = '/list/appointments'

export default withAuth(
  function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    const isAuthenticated = !!req.cookies.get('next-auth.session-token') || !!req.cookies.get('__Secure-next-auth.session-token')

    if (publicRoutes.includes(pathname)) {
      if (isAuthenticated && pathname === '/auth/login') {
        return NextResponse.redirect(new URL(defaultRoute, req.url))
      }

      if (pathname === '/') {
        return NextResponse.redirect(
          new URL(isAuthenticated ? defaultRoute : '/auth/login', req.url)
        )
      }

      return NextResponse.next()
    }

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    const isValidRoute = validRoutes.some(route => pathname.startsWith(route))
    if (!isValidRoute) {
      return NextResponse.redirect(new URL(defaultRoute, req.url))
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
    '/auth/login',
    '/list/:path*',
    '/doctor/:path*',
    '/receptionist/:path*',
    '/patient/:path*',
    '/admin/:path*'
  ],
}