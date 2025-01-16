'use client';

import { loginSchema, LoginSchema } from '@/schemas/login-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    const { dni, password } = data;

    const response = await signIn('credentials', {
      redirect: false,
      dni,
      password,
    });

    if (!response || !response.ok) {
      // setError(response?.error || 'Error al iniciar sesión');
      setError('Error al iniciar sesión');
      return;
    }

    router.push('/doctor');
  };

  return (
    <>
      <h1 className='text-center text-lg font-semibold mb-4'>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <p className='bg-red-500 text-lg text-white p-3 rounded mb-2'>
            {error}
          </p>
        )}

        <input
          {...register('dni')}
          type='text'
          placeholder='DNI'
          className='w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring focus:ring-gray-400'
        />
        {errors.dni && <p className='text-red-500'>{errors.dni.message}</p>}
        <input
          {...register('password')}
          type='password'
          placeholder='Contraseña'
          className='w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring focus:ring-gray-400'
        />
        <button
          type='submit'
          className='w-full bg-gray-400 text-white py-2 rounded hover:bg-gray-500'
        >
          Ingresar
        </button>
      </form>
    </>
  );
};

export default LoginPage;
