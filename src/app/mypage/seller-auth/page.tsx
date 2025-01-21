'use client';

import { supabase } from '@/utils/supabase/supabaseClient';
import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useRouter, useSearchParams } from 'next/navigation';
import SellerAuthCard from './_components/sellerAuthCard';
import Image from 'next/image';
const lefticon = '/images/ic-left.svg';

const SellerPage = () => {
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
          console.error('인증 상태를 가져오는 중 오류 발생:', fetchError);
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
        console.error('예기치 않은 오류 발생:', err);
      }
    };

    fetchAuthenticationStatus();
  }, [user, router, searchParams]);

  return (
    <div className="h-full w-full px-5 relative">
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

      <h1 className="w-full py-[20px] text-left text-black font-semibold text-[18px] leading-normal tracking-[-0.36px]">
        셀러 인증하기
      </h1>

      {/* 인증 섹션 */}
      <div className="mt-4 space-y-3">
        <SellerAuthCard
          isVerified={isCountryVerified}
          title={'국가'}
          content={
            '현재 거주 국가 및 지역을 인증하면 해당하는 국가와 관련된 게시글에 답변이 결제될 확률이 높아져요'
          }
          link={'country-verification'}
        />
        <SellerAuthCard
          isVerified={isIdentityVerified}
          title={'본인'}
          content={
            '본인 인증을 마치면 프로필 옆에 인증 마크가 생기고 나의 답변이 결제될 확률이 높아져요'
          }
          link={'identity-verification'}
        />
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

      {/* 알림 메시지 */}
      {showAlert && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 flex w-[335px] p-[12px] justify-center items-center gap-[4px] rounded-[8px] bg-black bg-opacity-50 z-50">
          {/* <Image
            src="/images/ic-notice.svg"
            alt="Notice"
            width={16}
            height={16}
          /> */}
          <span className="text-center text-[14px] font-semibold leading-normal tracking-[-0.28px] text-white">
            국가 인증이 완료되었습니다!
          </span>
        </div>
      )}
    </div>
  );
};

export default SellerPage;
