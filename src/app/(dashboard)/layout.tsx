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
        <div className='w-[10%] md:w-[7%] lg:w-[10%] xl:w-[9%] bg-backmenu'>
          <div className='bg-backgrounddefault m-0 mt-0 p-2'>
            <Link href='/' className='flex items-center justify-center lg:justify-start gap-2'>
              <Image src='/logodental.png' alt='logo' width={62} height={62} />
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
