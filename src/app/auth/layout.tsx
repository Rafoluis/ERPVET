import Image from 'next/image';
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className='flex h-screen items-center justify-center bg-gray-100'>
      <Image
        className='absolute left-4 top-4'
        src='/logodental.png'
        width={60}
        height={60}
        alt='Logo'
      />
      <div className='w-96 bg-gray-200 p-6 rounded shadow-md'>{children}</div>
    </div>
  );
};

export default AuthLayout;
