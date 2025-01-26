import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import Dropdown from './dropdown/Dropdown';

const Navbar = () => {
  const { data: session } = useSession();
  const nameComplete = session?.user?.firstName.concat(
    ' ',
    session?.user?.lastName
  );

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    window.location.href = '/auth/login';
  };

  return (
    <div className='flex items-center justify-between p-4'>
      {/* USER */}
      <div className='flex items-center gap-6 justify-end w-full'>
        <div className='flex flex-col'>
          <span className='text-xs leading-3 font-medium'>{nameComplete}</span>
          <span className='text-[10px] text-gray-500 text-right'>
            {session?.user?.role}
          </span>
        </div>

        <Dropdown>
          <Dropdown.Toggle>
            <Image
              src='/avatar.png'
              alt=''
              width={36}
              height={36}
              className='rounded-full'
            />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item>
              <Link href='/profile'>
                <span>Perfil</span>
              </Link>
            </Dropdown.Item>

            <Dropdown.Item onClick={handleSignOut}>
              <span>Cerrar sesion</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default Navbar;
