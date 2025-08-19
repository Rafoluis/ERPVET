import Image from 'next/image'
import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <section className='flex min-h-screen items-center justify-center bg-gray-100 p-4 md:p-8'>
      <div className='relative flex w-full max-w-6xl bg-white rounded-3xl shadow-lg overflow-hidden'>
        <div className='hidden md:flex md:w-1/2 relative'>
          <Image
            src='/veterinariof.png'
            alt='Dentista'
            className='w-full h-full object-cover'
            width={1200}
            height={1200}
          />

          <p className='absolute text-white uppercase text-2xl md:text-3xl font-bold bottom-10 left-6 md:left-8 w-3/4 drop-shadow-lg'>
            Tu confianza, su bienestar. Nuestro compromiso diario
          </p>
        </div>

        <div className='w-full md:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 py-12 sm:py-16'>
          <Image
            className='mb-6'
            src='/logovet.png'
            width={80}
            height={80}
            alt='Logo'
          />
          
          {children}
        </div>
      </div>
    </section>
  )
}

export default AuthLayout
