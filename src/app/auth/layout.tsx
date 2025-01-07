import React from "react"

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="absolute top-4 right-4">
        <button className="px-4 py-2 bg-gray-300 text-black rounded">
          Registrarse
        </button>
      </div>
      <div className="w-96 bg-gray-200 p-6 rounded shadow-md">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout