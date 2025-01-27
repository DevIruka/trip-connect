'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import heylocal from '@/data/images/HeyLocal.svg';
import search from '@/data/images/ic-Search.svg';
import profile from '@/data/images/ic-Profile.svg';
import { useUserStore } from '@/store/userStore';
import { useMediaQuery } from 'react-responsive';

const Header = () => {
  const pathname = usePathname();
  const isDesktop = useMediaQuery({ minWidth: 800 });

  const excludedPaths = [
    '/login',
    '/signup',
    '/search',
    '/mypage',
    '/mypage/credit',
    '/post',
    '/response-list',
    '/request',
    '/response',
    '/response-edit',
    '/request-edit',
    '/review',
    '/mypage/seller-auth',
    '/auth',
    '/user',
  ];
  const shouldHideHeader = excludedPaths.some((path) =>
    pathname.startsWith(path),
  );
  const { user } = useUserStore();
  return shouldHideHeader && !isDesktop ? (
    <></>
  ) : (
    <>
      <div className="flex sticky top-0 h-[56px] bg-white z-50 w-full justify-between py-[13.5px] px-[20px] max-w-[1200px] md:px-9">
        <Link href="/" className="flex place-content-center">
          <Image
            src={heylocal}
            alt="헤이로컬 로고"
            width={115}
            height={29}
            style={{ width: 115, height: 29 }}
          />
        </Link>
        <div className="flex gap-[20px]">
          <Link href="/search" className="flex place-content-center">
            <Image
              src={search}
              alt="search"
              width={24}
              height={24}
              style={{ width: 24, height: 24 }}
            />
          </Link>
          <Link href="/mypage" className="flex place-content-center">
            <Image
              src={profile}
              alt="profile"
              width={24}
              height={24}
              style={{ width: 24, height: 24 }}
            />
          </Link>
        </div>
      </div>
    </>
  );
};
export default Header;
