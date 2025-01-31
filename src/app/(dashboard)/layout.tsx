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
        <div className='w-[12%] md:w-[8%] lg:w-[14%] xl:w-[12%] p-4 bg-backmenu'>
          <Link href='/' className='flex items-center justify-center lg:justify-start gap-2 bg-backgrounddefault'>
            <Image src='/logodental.png' alt='logo' width={62} height={62} />
            <span className='hidden lg:block font-bold'>ERPCD</span>
          </Link>
          <div className=' flex-1 justify-between p-2'>
            <Menu />
          </div>
        </div>
        <div className='w-[88%] md:w-[92%] lg:w-[86%] xl:w-[88%]  bg-backpage overflow-scroll'>
          <Navbar />
          {children}
        </div>
      </div>
    </SessionProvider >
  );
}
