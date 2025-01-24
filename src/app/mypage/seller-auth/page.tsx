'use client';

import { supabase } from '@/utils/supabase/supabaseClient';
import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

const lefticon = '/images/ic-left.svg';

const Button = ({
  isVerified,
  link,
}: {
  isVerified: boolean;
  text: string;
  link: string;
}) => {
  const { t } = useTranslation('mypage'); // i18n 추가
  return (
    <Link href={`/mypage/seller-auth/${link}`}>
      <button className="h-8 px-3 py-1.5 bg-[#0582ff] rounded-md justify-center items-center gap-2.5 inline-flex text-white text-sm font-semibold">
        {isVerified ? t('re_verify') : t('verify')}
      </button>
    </Link>
  );
};
const SellerAuthCard = ({
  isVerified,
  title,
  content,
  link,
}: {
  isVerified: boolean;
  title: string;
  content: string;
  link: string;
}) => {
  return (
    <div className="h-auto p-4 rounded-xl border border-[#dee1e5] grid gap-3">
      <div className="grid gap-2">
        <div className="flex space-x-1.5">
          <h3 className="text-black text-base font-semibold leading-snug">
            {title} 인증
          </h3>
          {/* 완료 상태 박스 */}
          {isVerified && (
            <div className="h-[22px] px-1.5 py-[5px] bg-[#eaf4ff] rounded justify-start items-center inline-flex text-center text-[#0079f2] text-xs font-medium">
              완료
            </div>
          )}
        </div>
        <p className="text-[#797c80] text-sm font-medium">{content}</p>
      </div>
      <Button isVerified={isVerified} text={title} link={link} />
    </div>
  );
};

const SellerPage = () => {
  const { t } = useTranslation('mypage');
  const { user } = useUserStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const [isCountryVerified, setIsCountryVerified] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchAuthenticationStatus = async () => {
      if (!user?.id) {
        router.push('/login');
        return;
      }

      try {
        const { data: userRecord, error: fetchError } = await supabase
          .from('users')
          .select('authenticated, country_verified')
          .eq('id', user.id)
          .single();

        if (fetchError) {
          console.error(t('verification_error'), fetchError);
          return;
        }

        setIsIdentityVerified(userRecord?.authenticated || false);
        setIsCountryVerified(userRecord?.country_verified || false);

        if (searchParams.get('newlyVerified') === 'true') {
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 2000);
          const url = new URL(window.location.href);
          url.searchParams.delete('newlyVerified');
          window.history.replaceState({}, '', url.toString());
        }
      } catch (err) {
        console.error(t('verification_error'), err);
      }
    };

    fetchAuthenticationStatus();
  }, [user, router, searchParams, t]);

  return (
    <div className="h-full w-full px-5 relative">
      {/* 헤더 섹션 */}
      <div
        className="flex flex-row justify-between items-center"
        style={{
          height: '56px',
        }}
      >
        <button
          onClick={() => router.push('/mypage')}
          className="flex items-center justify-center"
        >
          <Image src={lefticon} width={24} height={24} alt="back" />
        </button>
      </div>

      <div className="w-full py-[20px] text-left text-black font-semibold text-[18px] leading-normal tracking-[-0.36px]">
        {t('seller_verification')}
      </div>

      {/* 인증 섹션 */}
      <div className="mt-4 space-y-3">
        <SellerAuthCard
          isVerified={isCountryVerified}
          title={t('country')}
          content={t('verify_country_region')}
          link={'country-verification'}
        />
        <SellerAuthCard
          isVerified={isIdentityVerified}
          title={t('identity')}
          content={t('profile_verification')}
          link={'identity-verification'}
        />
        <div className="h-[140px] p-4 rounded-xl grid gap-3">
          <div className="grid gap-2">
            <div className="flex space-x-1.5">
              <h3 className="text-[#a9a9a9] text-base font-semibold leading-snug">
                {t('account_verification')}
              </h3>
            </div>
            <p className="text-center text-[#797c80] text-xs font-medium leading-none">
              {t('account_verification_description')}
            </p>
          </div>
        </div>
      </div>

      {/* 알림 메시지 */}
      {showAlert && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 flex w-[335px] p-[12px] justify-center items-center gap-[4px] rounded-[8px] bg-black bg-opacity-50 z-50">
          <span className="text-center text-[14px] font-semibold leading-normal tracking-[-0.28px] text-white">
            {t('country_verification_completed')}
          </span>
        </div>
      )}
    </div>
  );
};

export default SellerPage;
