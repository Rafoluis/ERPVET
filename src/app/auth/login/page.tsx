"use client"

import { useRouter } from 'next/navigation';
import React from 'react';

const LoginPage = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/doctor');
  }

  return (
    <>
      <h1 className='text-center text-lg font-semibold mb-4'>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Usuario'
          className='w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring focus:ring-gray-400'
        />
        <input
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
        <button
          type='button'
          className='w-full mt-2 bg-white text-gray-700 py-2 rounded border border-gray-400 hover:bg-gray-100'
        >
          Ingresar como doctor
        </button>
      </form>
    </>
  );
};

export default LoginPage;
