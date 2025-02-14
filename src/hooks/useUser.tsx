import { useSession } from 'next-auth/react'

const useUser = () => {
  const { data: session } = useSession()
  const userRole = session?.user?.role?.toLowerCase()

  return {
    user: session?.user,
    role: userRole,
  }
}

export default useUser
