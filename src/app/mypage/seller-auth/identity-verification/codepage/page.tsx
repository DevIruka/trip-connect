'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore'; 

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
      <h1 className="text-black text-xl font-bold mb-6">본인 인증</h1>
      <p className="text-gray-600 text-sm mb-6">인증 코드를 입력해 주세요</p>

      {/* 인증 코드 입력 필드 */}
      <div className="mb-4">
        <label className="text-gray-600 text-sm mb-2 block">인증 코드</label>
        <input
          type="text"
          value={verificationCode}
          readOnly // 사용자가 수정하지 못하도록 설정
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* 재전송 버튼 */}
      <button
        className="text-sm text-black font-medium underline mb-6"
        onClick={handleResendCode}
      >
        재전송
      </button>

      {/* 이전 및 제출 버튼 */}
      <div className="flex justify-between">
        <button
          className="w-[48%] py-3 text-center bg-gray-200 text-black rounded-lg text-lg font-medium"
          onClick={() => router.back()}
        >
          이전
        </button>
        <button
          className="w-[48%] py-3 text-center bg-black text-white rounded-lg text-lg font-medium"
          onClick={handleSubmit}
        >
          제출
        </button>
      </div>
    </div>
  );
};

export default VerificationCodePage;
