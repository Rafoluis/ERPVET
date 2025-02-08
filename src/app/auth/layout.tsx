import Image from 'next/image'
import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <section className='flex h-screen items-center justify-center bg-backmenu'>
      <Image
        className='absolute left-4 top-4'
        src='/logodental.png'
        width={60}
        height={60}
        alt='Logo'
      />
      <div className='w-3/5 h-[650px] bg-gray-200 rounded-3xl shadow-md'>
        <div className='grid grid-cols-2 h-full'>
          <div className='relative rounded-l-3xl overflow-hidden'>
            <Image src='/dentista.avif'
              alt=''
              className='w-full h-full object-cover rounded-l-md'
              width={640}
              height={650}
            />
            <p className='absolute text-white uppercase text-4xl font-black bottom-20 left-10 w-28'>Tranformamos sonrisas, mejoramos vidas.</p>
          </div>

          <div className='m-4 rounded-3xl px-20 py-16 bg-white'>{children}</div>
        </div>
      </div>
    </section>
  )
}

export default AuthLayout
