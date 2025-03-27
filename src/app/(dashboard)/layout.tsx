"use client"

import Image from 'next/image';
import Link from 'next/link';
import { SessionProvider } from 'next-auth/react';
import Navbar from '@/components/navbar';
import Menu from '@/components/menu';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <SessionProvider>
      <div className='h-screen flex'>
        <div className='w-[16%] md:w-[11%] lg:w-[13%] xl:w-[12%] bg-backmenu'>
          <div className='bg-backgrounddefault m-0 mt-0 p-2'>
            <Link href='/' className='flex items-center justify-center gap-2'>
              <Image src='/logodental.png' alt='logo' width={60} height={60} />
              <span className='hidden lg:block font-bold'>ERPCD</span>
            </Link>
          </div>
          <div className=' flex-1 justify-between p-4'>
            <Menu />
          </div>
        </div>
        <div className='w-[90%] md:w-[93%] lg:w-[90%] xl:w-[91%] bg-backpage overflow-scroll'>
          <Navbar />
          {children}
        </div>
      </div>
    </SessionProvider >
  );
}
