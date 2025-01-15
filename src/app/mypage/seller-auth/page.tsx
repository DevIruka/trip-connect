'use client';

import { supabase } from '@/utils/supabase/supabaseClient';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';

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
    <div className="px-5">
      <h1 className="text-black text-lg font-bold mb-6">셀러 인증하기</h1>

      {/* 인증 섹션 */}
      <div className="space-y-4">
        {/* 국가 인증 */}
        <div className="p-4 border border-[#D9D9D9] rounded-lg bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold mb-2">국가 인증</h3>
              {/* 완료 상태 박스 */}
              {isCountryVerified && (
                <div
                  className="flex items-center justify-center px-1.5 py-0.5 gap-1 text-white text-xs font-medium rounded"
                  style={{
                    background: '#575757',
                    borderRadius: '4px',
                  }}
                >
                  완료
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4 leading-[1.4]">
            현재 거주 국가 및 지역을 인증하면 해당하는 국가와 관련된 게시물에
            답변이 필터링 확률이 높아져요
          </p>
          <Link href="/mypage/seller-auth/country-verification">
            <button className="w-full py-3 text-center rounded-[4px] bg-[#D9D9D9] text-black font-medium">
              국가 인증하기
            </button>
          </Link>
        </div>

        {/* 본인 인증 */}
        <div className="p-4 border border-[#D9D9D9] rounded-lg bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold mb-2">본인 인증</h3>
              {/* 완료 상태 박스 */}
              {isIdentityVerified && (
                <div
                  className="flex items-center justify-center px-1.5 py-0.5 gap-1 text-white text-xs font-medium rounded"
                  style={{
                    background: '#575757',
                    borderRadius: '4px',
                  }}
                >
                  완료
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4 leading-[1.4]">
            본인 인증을 마치면 프로필 옆에 인증 마크가 생기고 나의 답변이 검증된
            답변으로 표시돼요
          </p>
          <Link href="/mypage/seller-auth/identity-verification">
            <button className="w-full py-3 text-center rounded-[4px] bg-[#D9D9D9] text-black font-medium">
              {isIdentityVerified ? '다시 인증하기' : '본인 인증하기'}
            </button>
          </Link>
        </div>

        {/* 계좌 인증 */}
        <div className="p-4 border border-[#D9D9D9] rounded-lg bg-white h-[172.8px] flex flex-col justify-between">
          <h3 className="text-lg font-bold text-[#D9D9D9] mb-2">계좌 인증</h3>
          <div className="flex-grow flex items-center justify-center">
            <p className="text-sm text-gray-600 text-center leading-[1.4]">
              수익금 출금을 위한 계좌 인증은 준비 중이에요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerPage;
