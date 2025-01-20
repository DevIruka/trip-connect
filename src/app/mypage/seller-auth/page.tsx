'use client';

import { supabase } from '@/utils/supabase/supabaseClient';
import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import SellerAuthCard from './_components/sellerAuthCard';
import Image from 'next/image';
const lefticon = '/images/ic-left.svg';

const SellerPage = () => {
  const { user } = useUserStore();
  const router = useRouter();
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const [isCountryVerified, setIsCountryVerified] = useState(false);

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
          console.error('인증 상태를 가져오는 중 오류 발생:', fetchError);
          return;
        }

        setIsIdentityVerified(userRecord?.authenticated || false);
        setIsCountryVerified(userRecord?.country_verified || false);
      } catch (err) {
        console.error('예기치 않은 오류 발생:', err);
      }
    };

    fetchAuthenticationStatus();
  }, [user, router]);

  return (
    <div className="h-full w-full px-5">
      {/* 헤더 섹션 */}
      <div
        className="flex flex-row justify-between items-center"
        style={{
          height: '56px',
          padding: '10px',
        }}
      >
        <button
          onClick={() => router.push('/mypage')}
          className="flex items-center justify-center"
        >
          <Image src={lefticon} width={24} height={24} alt="back" />
        </button>
      </div>

      <h1 className="w-full py-[20px]  text-left text-black font-semibold text-[18px] leading-normal tracking-[-0.36px]">
        셀러 인증하기
      </h1>

      {/* 인증 섹션 */}
      <div className="mt-4 space-y-3">
        {/* 국가 인증 */}
        <SellerAuthCard
          isVerified={isCountryVerified}
          title={'국가'}
          content={
            '현재 거주 국가 및 지역을 인증하면 해당하는 국가와 관련된 게시글에 답변이 결제될 확률이 높아져요'
          }
          link={'country-verification'}
        />

        {/* 본인 인증 */}
        <SellerAuthCard
          isVerified={isIdentityVerified}
          title={'본인'}
          content={
            '본인 인증을 마치면 프로필 옆에 인증 마크가 생기고 나의 답변이 결제될 확률이 높아져요'
          }
          link={'identity-verification'}
        />

        {/* 계좌 인증 */}
        <div className="h-[140px] p-4 rounded-xl grid gap-3">
          <div className="grid gap-2">
            <div className="flex space-x-1.5">
              <h3 className="text-[#a9a9a9] text-base font-semibold leading-snug">
                계좌 인증
              </h3>
            </div>
            <p className="text-center text-[#797c80] text-xs font-medium leading-none">
              크레딧 출금을 위한 계좌 인증은 준비 중이에요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerPage;
