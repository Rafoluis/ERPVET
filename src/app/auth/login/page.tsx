'use client'

import Button from '@/components/Button'
import { loginSchema, LoginSchema } from '@/schemas/login-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

const LoginPage = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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

    if (!response?.ok) {
      console.log(response)
      const errorMessage = response?.error?.includes('No user found')
        ? 'El usuario no existe. Por favor, verifica tus credenciales.'
        : 'DNI o contraseña incorrectos. Inténtalo de nuevo.';   
      setError(errorMessage);
      return;
    }
    

    router.push('/list/appointments')
  }

  return (
    <>
      <h2 className='text-2xl font-bold text-center'>¡Bienvenido!</h2>
      <p className='text-gray-500 text-center mb-6'>Ingresa tus credenciales para continuar</p>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 w-80'>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm mb-2'>DNI</label>
          <input
            {...register('dni')}
            type='text'
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400'
            placeholder='Ingrese su DNI'
          />
          {errors.dni && (
            <p className='text-red-500 text-xs mt-1'>{errors.dni.message}</p>
          )}
        </div>

        <div className='mb-4'>
          <label className='block text-gray-700 text-sm mb-2'>Contraseña</label>
          <input
            {...register('password')}
            type='password'
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400'
            placeholder='Ingrese su contraseña'
          />
          {errors.password && (
            <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p>
          )}
        </div>

        <div className='flex justify-between items-center text-sm mb-6'>
          <label className='flex items-center text-gray-600'>
            <input type='checkbox' className='mr-2' />
            Recordar sesión
          </label>
          <a href='#' className='text-red-500 hover:underline'>
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        {error && (
          <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded text-sm text-center'>
            {error}
          </div>
        )}

        <Button type='submit' className='bg-red-500' loading={isSubmitting}>
          Ingresar
        </Button>
      </form>
    </>
  )
}

export default LoginPage
