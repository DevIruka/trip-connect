'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import Image from 'next/image';
const lefticon = '/images/ic-left.svg';

const VerificationCodePage = () => {
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
      alert('로그인이 필요합니다.');
      return;
    }

    const userId = user.id;

    const { error: updateError } = await supabase
      .from('users')
      .update({ authenticated: true })
      .eq('id', userId);

    if (updateError) {
      alert('인증 상태 업데이트 중 오류가 발생했습니다.');
      console.error(updateError);
      return;
    }

    router.push('/mypage/seller-auth');
  };

  // 재전송 버튼
  const handleResendCode = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(newCode);
    alert(`새 인증 코드가 생성되었습니다: ${newCode}`);
  };

  return (
    <div className="px-5 py-4 min-h-screen bg-white">
      {/* 상단 헤더 */}
      <div className="flex flex-row justify-between items-center h-[56px] mb-[16px] relative">
        <Image
          src={lefticon}
          width={24}
          height={24}
          alt="back"
          className="cursor-pointer absolute left-0"
          onClick={() => {
            router.back();
          }}
        />
        <h1
          style={{
            color: '#000',
            textAlign: 'center',
            fontFamily: 'Pretendard',
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: 'normal',
            letterSpacing: '-0.36px',
          }}
          className="w-full flex justify-center"
        >
          본인 인증
        </h1>
      </div>

      {/* 안내 텍스트 */}
      <p
        style={{
          color: 'var(--Grayscale-Gray-1, #45484D)',
          fontFamily: 'Pretendard',
          fontSize: '18px',
          fontStyle: 'normal',
          fontWeight: 700,
          lineHeight: '160%',
          letterSpacing: '-0.36px',
        }}
        className="flex items-start gap-[10px] self-stretch py-[16px] mb-6 h-[56px]"
      >
        인증 코드를 입력해 주세요.
      </p>

      {/* 인증 코드 입력 필드 */}
      <div className="mb-4">
        <label className="text-gray-600 text-sm mb-2 block">인증 코드</label>
        <input
          type="text"
          value={verificationCode}
          readOnly
          className="flex w-[315px] h-[52px] px-[16px] py-[14px] flex-col items-start gap-[10px] self-stretch rounded-lg border border-gray-300 bg-white text-black text-sm"
        />
      </div>

      {/* 재전송 버튼 */}
      <div className="px-[20px] flex justify-end mb-[24px]">
        <button
          className="flex px-0 py-[4px] justify-center items-center gap-[10px] overflow-hidden text-[#0582FF] text-[14px] font-medium tracking-[-0.28px]"
          onClick={handleResendCode}
        >
          재전송
        </button>
      </div>

      {/* 이전 및 제출 버튼 */}
      <div className="flex justify-between mt-[315px]">
        {/* 이전 버튼 */}
        <button
          className="flex h-[52px] px-[12px] py-[6px] justify-center items-center gap-[10px] flex-1 rounded-[12px] bg-[#F5F7FA] text-black text-[16px] font-semibold tracking-[-0.32px]"
          onClick={() => router.back()}
        >
          이전
        </button>

        {/* 버튼 간격 */}
        <div className="w-[20px]"></div>

        {/* 제출 버튼 */}
        <button
          className="flex h-[52px] px-[12px] py-[6px] justify-center items-center gap-[10px] flex-1 rounded-[12px] bg-[#0582FF] text-white text-[16px] font-semibold tracking-[-0.32px]"
          onClick={handleSubmit}
        >
          제출
        </button>
      </div>
    </div>
  );
};

export default VerificationCodePage;
