'use client';

import Image from 'next/image';
import { GrSearch } from 'react-icons/gr';
import { LuBell } from 'react-icons/lu';
import { FiUser } from 'react-icons/fi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const logoImage = '/images/logo.png';

const Header = () => {
  const pathname = usePathname();
  return pathname === '/login' || pathname === '/signup' ? (
    <></>
  ) : (
    <>
      <div className="flex flex-row sticky top-0 h-10 bg-white z-50 w-full justify-between">
        <Link href="/" className="flex ml-3 mt-2">
          <Image
            src={logoImage}
            alt="트립 커넥트 로고."
            width={150}
            height={50}
          />
        </Link>
        <div className="flex flex-row items-center justify-center gap-4 mr-2">
          <LuBell size={25} />
          <GrSearch size={25} />
          <Link href="mypage">
            <FiUser size={25} />
          </Link>
        </div>
      </div>
    </>
  );
};
export default Header;
