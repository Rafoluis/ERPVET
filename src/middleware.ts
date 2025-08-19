import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const publicRoutes = ['/', '/auth/login']

const roleBasedRoutes = {
  veterinario: [
    '/list/mascotas',
    '/list/owner',
    '/list/patients',
    '/list/employees',
    '/HistoriasClinicasR',
    '/list/ticket',
    '/list/doctors',
    '/admin',
    '/company'
  ],
  // recepcionista: [
  //   '/list/appointments',
  //   '/list/patients',
  //   '/HistoriasClinicasR',
  //   '/list/ticket',
  //   '/list/doctors'
  // ],
  // odontologo: [
  //   '/list/appointmentBooks',
  //   '/HistoriasClinicasD'
  // ]
}

const defaultRoutes = {
  veterinario: '/list/mascotas',
  // admin: '/list/appointments',
  // recepcionista: '/list/appointments',
  // odontologo: '/list/appointmentBooks',
  guest: '/auth/login'
}


export async function middleware(req: NextRequest) {

  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.cookies.get('next-auth.session-token') || !!req.cookies.get('__Secure-next-auth.session-token')
  if (pathname === '/' || pathname === '') {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }
  if (publicRoutes.includes(pathname)) {
    if (isAuthenticated && pathname === '/auth/login') {
      const token = await getToken({ req })
      const userRole = (token?.role as string || 'guest').toLowerCase()
      const roleDefaultRoute = defaultRoutes[userRole as keyof typeof defaultRoutes] || defaultRoutes.guest

      return NextResponse.redirect(new URL(roleDefaultRoute, req.url))
    }

    return NextResponse.next()
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  const token = await getToken({ req })
  const userRole = (token?.role as string || 'guest').toLowerCase()
  const roleDefaultRoute = defaultRoutes[userRole as keyof typeof defaultRoutes] || defaultRoutes.guest

  const allowedRoutes = roleBasedRoutes[userRole as keyof typeof roleBasedRoutes] || []

  const hasAccess = allowedRoutes.some(route => pathname.startsWith(route))

  if (!hasAccess) {
    return NextResponse.redirect(new URL(roleDefaultRoute, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/auth/:path*',
    '/list/:path*',
    '/doctor/:path*',
    '/receptionist/:path*',
    '/patient/:path*',
    '/admin/:path*',
    '/HistoriasClinicasR',
    '/HistoriasClinicasD',
    '/company'
  ]
}
