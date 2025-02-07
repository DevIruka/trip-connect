'use client';

import { supabase } from '@/utils/supabase/supabaseClient';
import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '@/store/userStore';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

const lefticon = '/images/ic-left.svg';

const Button = React.memo(function Button({
  isVerified,
  link,
}: {
  isVerified: boolean;
  link: string;
}) {
  const { t } = useTranslation('mypage');
  return (
    <Link href={`/mypage/seller-auth/${link}`}>
      <button className="h-8 px-3 py-1.5 bg-[#0582ff] rounded-md justify-center items-center gap-2.5 inline-flex text-white text-sm font-semibold">
        {isVerified ? t('re_verify') : t('verify')}
      </button>
    </Link>
  );
});

const SellerAuthCard = React.memo(function SellerAuthCard({
  isVerified,
  title,
  content,
  link,
  className,
}: {
  isVerified: boolean;
  title: string;
  content: string;
  link: string;
  className?: string;
}) {
  const { t } = useTranslation('mypage');
  return (
    <div
      className={`h-auto p-4 rounded-xl border border-[#dee1e5] grid gap-3 md:h-[174px] md:w-[800px] md:p-[24px] ${className}`}
    >
      <div className="grid gap-2">
        <div className="flex space-x-1.5">
          <h3 className="text-black text-base font-semibold leading-snug text-[16px] md:text-[20px]">
            {title} {t('verify')}
          </h3>
          {isVerified && (
            <div className="h-[22px] px-1.5 py-[5px] bg-[#eaf4ff] rounded justify-start items-center inline-flex text-center text-[#0079f2] text-xs font-medium">
              {t('completed')}
            </div>
          )}
        </div>
        <p className="text-[#797c80] text-sm font-medium text-[14px] md:text-[16px]">
          {content}
        </p>
      </div>
      <div className="flex justify-start mt-[22px]">
        <Button isVerified={isVerified} link={link} />
      </div>
    </div>
  );
});

const SellerPage = () => {
  const { t } = useTranslation('mypage');
  const { user } = useUserStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const [isCountryVerified, setIsCountryVerified] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const fetchAuthenticationStatus = useCallback(async () => {
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
  }, [user?.id, router, searchParams, t]);

  useEffect(() => {
    fetchAuthenticationStatus();
  }, [fetchAuthenticationStatus]);

  return (
    <div className="h-full w-full max-w-[872px] px-5 md:px-[36px] lg:px-[36px] mx-auto">
      <div className="h-14 py-2.5 flex flex-row justify-between items-center md:hidden">
        <button
          onClick={() => router.push('/mypage')}
          className="flex items-center justify-center"
        >
          <Image src={lefticon} width={24} height={24} alt="back" />
        </button>
      </div>

      <div className="w-full py-[20px] md:mt-[40px] text-left text-black font-semibold text-[20px] leading-normal tracking-[-0.36px] md:text-[32px] md:py-[10px] md:h-[71px]">
        {t('seller_verification')}
      </div>

      <div className="mt-2 space-y-3 md:mt-[28px]">
        <SellerAuthCard
          isVerified={isCountryVerified}
          title={t('country')}
          content={t('verify_country_region')}
          link={'country-verification'}
          className="text-[16px] md:text-[20px]"
        />
        <SellerAuthCard
          isVerified={isIdentityVerified}
          title={t('identity')}
          content={t('profile_verification')}
          link={'identity-verification'}
          className="text-[16px] md:text-[20px]"
        />
        <div className="h-[140px] p-4 rounded-xl grid gap-3">
          <div className="grid gap-3">
            <div className="flex space-x-2">
              <p className="text-[#a9a9a9] text-base font-semibold leading-snug">
                {t('account_verification')}
              </p>
            </div>
            <p className="text-center text-[#797c80] text-xs font-medium leading-none md:text-[16px]">
              {t('account_verification_description')}
            </p>
          </div>
        </div>
      </div>

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
