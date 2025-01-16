'use client';

import { handleLogin } from '@/actions/auth-actions';
import { loginSchema, LoginSchema } from '@/schemas/login-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

const LoginPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    const formData = new FormData();
    formData.append('dni', data.dni);
    formData.append('password', data.password);

    console.log(errors);

    const result = await handleLogin(formData);

    if (result.success && result.redirectTo) router.push(result.redirectTo);
  };

  return (
    <>
      <h1 className='text-center text-lg font-semibold mb-4'>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('dni')}
          type='text'
          placeholder='DNI'
          className='w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring focus:ring-gray-400'
        />
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
