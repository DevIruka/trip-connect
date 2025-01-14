'use client';

import React, { useEffect } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { useRouter } from 'next/navigation';

const TEST_CLIENT_KEY = 'test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6';

const fetchCredit = async () => {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  console.log('세션 데이터:', sessionData); //디버깅용

  if (sessionError || !sessionData.session) {
    throw new Error('사용자 정보를 가져오지 못했습니다.');
  }

  const userId = sessionData.session.user.id;

  const { data, error } = await supabase
    .from('users')
    .select('credit')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error('크레딧을 가져오지 못했습니다.');
  }

  return data?.credit || 0;
};

const CreditPage: React.FC = () => {
  const router = useRouter();
  const {
    data: credit,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['userCredit'],
    queryFn: fetchCredit,
    retry: false,
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        router.push('/login');
      }
    };

    checkSession();
  }, [router]);

  const handlePayment = async () => {
    // 토스 결제 SDK 로드
    const tossPayments = await loadTossPayments(TEST_CLIENT_KEY);

    tossPayments
      .requestPayment('카드', {
        amount: 10000, // 결제 금액
        orderId: `order-${Date.now()}`, // 고유 주문 ID
        orderName: '10,000C 충전', // 주문 이름
        customerName: '테스트 사용자', // 사용자 이름
        successUrl: 'http://localhost:3000/payment/success', // 결제 성공 URL
        failUrl: 'http://localhost:3000/payment/fail', // 결제 실패 URL
      })
      .catch((error) => {
        // 결제 실패 시 처리
        console.error('결제 요청 중 오류 발생:', error.message);
      });
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    console.error(error);
    return <div>데이터를 가져오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <div className="p-4 bg-white h-screen">
      {/* 상단 제목 및 뒤로가기 */}
      <div className="flex items-center mb-4">
        <button className="text-gray-500">←</button>
      </div>

      {/* 보유 크레딧 */}
      <div className="mb-6">
        <h2 className="text-gray-600 text-lg font-medium mb-2">보유 크레딧</h2>
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
          <div className="w-16 h-16 bg-gray-300 rounded" />
          <p className="text-3xl font-bold">{credit?.toLocaleString()}c</p>
        </div>
      </div>

      {/* 충전하기 */}
      <h2 className="text-gray-600 text-lg font-medium mb-4">충전하기</h2>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-gray-100 rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-xl font-bold">10,000C</p>
              <p className="text-blue-500 text-sm font-medium mt-1">
                +500 추가크레딧
              </p>
            </div>
            <button
              className="bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg"
              onClick={handlePayment}
            >
              10,000원
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreditPage;
