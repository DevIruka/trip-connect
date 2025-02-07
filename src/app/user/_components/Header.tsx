'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Desktop, Mobile } from '@/components/ui/Responsive';

const Header: React.FC = () => {
  const { t } = useTranslation('user');
  const router = useRouter();
  return (
    <>
      <Mobile>
        <div className="flex items-center px-5 py-2.5 bg-white">
          <button
            onClick={() => router.back()}
            className="w-6 h-6 flex items-center justify-center"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 19L8 12L15 5"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="flex-grow text-lg font-semibold text-black text-center">
            {t('profile')}
          </div>
        </div>
      </Mobile>
      <Desktop>
        <div className="flex items-start px-5">
          <div className="flex-grow text-[32px] font-semibold text-black leading-[51.20px]">
            {t('profile')}
          </div>
        </div>
      </Desktop>
    </>
  );
};

export default Header;
