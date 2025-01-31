'use client';

import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import heylocal from '@/data/images/HeyLocal.svg';
import biglogo from '@/data/images/biglogo.svg';
import search from '@/data/images/ic-Search.svg';
import profile from '@/data/images/ic-Profile.svg';
import { useUserStore } from '@/store/userStore';
import { useMediaQuery } from 'react-responsive';
import { useModal } from '@/providers/ModalProvider';
import { Desktop, Mobile } from './ui/Responsive';


const Header = () => {
  const pathname = usePathname();
  const isDesktop = useMediaQuery({ minWidth: 800 });
  const router = useRouter();

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
  const { openModal } = useModal();

  return shouldHideHeader && !isDesktop ? null : (
    <>
      <div className="flex sticky top-0 h-[56px] md:h-[84px] bg-white z-50 w-full justify-between py-[13.5px] md:py-0 px-[20px] max-w-[1200px] md:px-9">
        <Link href="/" className="flex place-content-center">
          <Mobile>
            <Image
              src={heylocal}
              alt="헤이로컬 로고"
              width={115}
              height={29}
              style={{ width: 115, height: 29 }}
            />
          </Mobile>
          <Desktop>
            <Image
              src={biglogo}
              alt="헤이로컬 로고"
              width={84}
              height={84}
            />
          </Desktop>
        </Link>
        <div className="flex items-center gap-[20px]">
          <Link href="/search" className="flex place-content-center">
            <Image
              src={search}
              alt="search"
              width={24}
              height={24}
              style={{ width: 24, height: 24 }}
            />
          </Link>
          <div
            onClick={() => {
              if (user) router.push('/mypage');
              else openModal('loginModal');
            }}
            className="flex place-content-center cursor-pointer"
          >
            <Image
              src={profile}
              alt="profile"
              width={24}
              height={24}
              style={{ width: 24, height: 24 }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Header;
