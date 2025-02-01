'use client'

import { loginSchema, LoginSchema } from '@/schemas/login-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

const LoginPage = () => {
  const router = useRouter()
  const [error, setError] = useState<string>()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    const { dni, password } = data

    const response = await signIn('credentials', {
      redirect: false,
      dni,
      password,
    })

    if (!response || !response.ok) {
      setError(response?.error || 'Error al iniciar sesión')
      return
    }

    router.push('/admin')
  }

  return (
    <>
      <div className='flex justify-center mb-4'>
        <Image
          src='/logodental.png'
          alt='Logo'
          className='w-16'
          width={16}
          height={16}
        />
      </div>

      <h2 className='text-2xl font-bold text-center'>¡Bienvenido!</h2>
      <p className='text-gray-500 text-center mb-6'>Ingresa tus datos</p>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
        {error && (
          <p className='bg-red-500 text-white p-3 rounded mb-2 text-center'>
            {error}
          </p>
        )}

        <div className='mb-4'>
          <input
            {...register('dni')}
            type='text'
            className='w-full px-3 py-2 border-b border-gray-400 outline-none focus:border-red-500'
            placeholder='DNI'
          />
          {errors.dni && (
            <p className='text-red-500 text-sm'>{errors.dni.message}</p>
          )}
        </div>

        {/* Contraseña */}
        <div className='mb-4'>
          <input
            {...register('password')}
            type='password'
            className='w-full px-3 py-2 border-b border-gray-400 outline-none focus:border-red-500'
            placeholder='Contraseña'
          />
          {errors.password && (
            <p className='text-red-500 text-sm'>{errors.password.message}</p>
          )}
        </div>

        <div className='flex justify-between items-center text-sm mb-6'>
          <label className='flex items-center'>
            <input type='checkbox' className='mr-2' />
            Recordar
          </label>
          <a href='#' className='text-red-500 hover:underline'>
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <button
          type='submit'
          className='w-full bg-red-500 text-white py-2 rounded-3xl text-lg font-semibold hover:bg-red-600 transition-all'
        >
          Ingresar
        </button>
      </form>
    </>
  )
}

export default LoginPage
