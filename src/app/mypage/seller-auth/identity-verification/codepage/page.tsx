'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import BackButton from '@/app/post/_components/BackBtn';
import { useTranslation } from 'react-i18next';

const VerificationCodePage = () => {
  const { t } = useTranslation('mypage');
  const { user } = useUserStore();
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState('');

  useEffect(() => {
    if (!user?.id) {
      router.push('/login');
    }
  }, [user, router]);

  // 페이지 진입 시 6자리 랜덤 코드 생성
  useEffect(() => {
    const generateCode = () => {
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      setVerificationCode(randomCode);
    };

    generateCode();
  }, []);

  const handleSubmit = async () => {
    if (!user?.id) {
      alert(t('login_required'));
      return;
    }

    const userId = user.id;

    const { error: updateError } = await supabase
      .from('users')
      .update({ authenticated: true })
      .eq('id', userId);

    if (updateError) {
      alert(t('update_error'));
      console.error(updateError);
      return;
    }

    router.push('/mypage/seller-auth');
  };

  // 재전송 버튼
  const handleResendCode = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(newCode);
    alert(t('new_code', { code: newCode }));
  };

  return (
    <div className="h-[461px] w-full px-[36px] bg-white mx-auto max-w-[872px]">
      {/* 상단 헤더 */}
      <div className="h-14 py-2.5 place-content-center items-center flex justify-between sticky top-0 z-50 bg-white">
        <div className="md:hidden">
          <BackButton />
        </div>
        <div className="text-center text-black font-semibold md:text-[32px] text-[18px]">
          {t('identity_verification')}
        </div>
        <div className="w-6"></div>
      </div>

      {/* 안내 텍스트 */}
      <p className="mb-6 text-[#45484D] font-semibold md:text-[20px] text-[18px] leading-[160%] tracking-[-0.36px]">
        {t('enter_verification_code')}
      </p>

      {/* 인증 코드 입력 필드 */}
      <div className="mb-4">
        <label className="text-gray-600 text-sm mb-2 block">
          {t('verification_code')}
        </label>
        <input
          type="text"
          value={verificationCode}
          readOnly
          className="flex w-full h-[52px] px-[16px] py-[14px] flex-col items-start gap-[10px] self-stretch rounded-lg border border-gray-300 bg-white text-black text-sm md:w-[800px] md:h-[32px]"
        />
      </div>

      {/* 재전송 버튼 */}
      <div className="px-[20px] flex justify-end mb-[24px]">
        <button
          className="flex px-0 py-[4px] justify-center items-center gap-[10px] overflow-hidden text-[#0582FF] text-[14px] font-medium tracking-[-0.28px]"
          onClick={handleResendCode}
        >
          {t('resend')}
        </button>
      </div>

      {/* 이전 및 제출 버튼 */}
      <div className="flex justify-between mt-[315px] ">
        {/* 이전 버튼 */}
        <button
          className="flex h-[52px] px-[12px] py-[6px] justify-center items-center gap-[10px] flex-1 rounded-[12px] bg-[#F5F7FA] text-black text-[16px] font-semibold tracking-[-0.32px]"
          onClick={() => router.back()}
        >
          {t('previous')}
        </button>

        {/* 버튼 간격 */}
        <div className="w-[20px]"></div>

        {/* 제출 버튼 */}
        <button
          className="flex h-[52px] px-[12px] py-[6px] justify-center items-center gap-[10px] flex-1 rounded-[12px] bg-[#0582FF] text-white text-[16px] font-semibold tracking-[-0.32px]"
          onClick={handleSubmit}
        >
          {t('submit')}
        </button>
      </div>
    </div>
  );
};

export default VerificationCodePage;
