import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const publicRoutes = ['/', '/auth/login']

const roleBasedRoutes = {
  admin: [
    '/list/appointments',
    '/list/patients',
    '/list/service',
    '/HistoriasClinicasR',
    '/list/ticket',
    '/list/doctors',
    '/admin',
    '/company'
  ],
  recepcionista: [
    '/list/appointments',
    '/list/patients',
    '/HistoriasClinicasR',
    '/list/ticket',
    '/list/doctors'
  ],
  doctor: [
    '/HistoriasClinicasD'
  ],
  odontologo: [
    '/HistoriasClinicasD'
  ]
}

const protectedRoutes = Object.values(roleBasedRoutes).flat()

const validRoutes = [...publicRoutes, ...protectedRoutes]

const defaultRoute = '/list/appointments'

export default withAuth(
  async function middleware(req: NextRequest) {
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

    const token = await getToken({ req })
    let userRole = token?.role as string || 'guest'
    userRole = userRole.toLowerCase()

    const isValidRoute = validRoutes.some(route => pathname.startsWith(route))
    if (!isValidRoute) {
      return NextResponse.redirect(new URL(defaultRoute, req.url))
    }

    const hasAccess = Object.entries(roleBasedRoutes).some(([role, routes]) => {
      if (role === userRole) {
        return routes.some(route => pathname.startsWith(route))
      }
      return false
    })

    if (!hasAccess) {
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
    '/admin/:path*',
    '/HistoriasClinicasR',
    '/HistoriasClinicasD',
    '/company'
  ],
}