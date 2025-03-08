import { useSession } from 'next-auth/react'

const useUser = () => {
  const { data: session, status } = useSession()
  const userRole = session?.user?.role?.toLowerCase()

  return {
    user: session?.user,
    role: userRole,
    status
  }
}

export default useUser
