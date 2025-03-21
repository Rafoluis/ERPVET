import { getToken } from 'next-auth/jwt'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' }) 
  }

  const token = await getToken({ req })

  if (!token) {
    return res.json({ authenticated: false })
  }

  const userRole = (token.role as string || 'guest').toLowerCase()

  const defaultRoutes: Record<string, string> = {
    admin: '/list/appointments',
    recepcionista: '/list/appointments',
    odontologo: '/list/appointmentBooks',
    guest: '/'
  }

  return res.json({
    authenticated: true,
    role: userRole,
    defaultRoute: defaultRoutes[userRole] || defaultRoutes.guest
  })
}
