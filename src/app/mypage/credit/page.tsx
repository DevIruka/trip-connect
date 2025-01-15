'use client';

import React, { useEffect } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

const TEST_CLIENT_KEY = 'test_ck_mBZ1gQ4YVXWzABpg7g6a3l2KPoqN';

const fetchCredit = async (userId: string) => {
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
  const { user } = useUserStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const {
    data: credit,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['userCredit', user?.id],
    queryFn: () => fetchCredit(user?.id || ''),
    enabled: !!user,
  });

  const paymentOptions = [
    { amount: 1000, bonusRate: 0.05 },
    { amount: 5000, bonusRate: 0.05 },
    { amount: 10000, bonusRate: 0.05 },
    { amount: 20000, bonusRate: 0.1 },
    { amount: 50000, bonusRate: 0.1 },
  ];

  const handlePayment = async (amount: number, bonus: number) => {
    try {
      // 토스 결제 SDK 로드
      const tossPayments = await loadTossPayments(TEST_CLIENT_KEY);

      tossPayments.requestPayment('카드', {
        amount, // 결제 금액
        orderId: `order-${Date.now()}`, // 고유 주문 ID
        orderName: `${amount.toLocaleString()}C 충전`, // 주문 이름
        customerName: user?.email, // 사용자 이름
        successUrl: `${window.location.origin}/mypage/credit?status=success&amount=${amount}&bonus=${bonus}`, // 결제 성공 URL
        failUrl: `${window.location.origin}/mypage/credit?status=fail`, // 결제 실패 URL
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error('결제 요청 중 오류 발생:', error.message);
      } else {
        console.error('결제 요청 중 알 수 없는 오류 발생:', error);
      }
    }
  };

  useEffect(() => {
    const handlePaymentResult = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const status = urlParams.get('status');
      const amount = Number(urlParams.get('amount')) || 0;
      const bonus = Number(urlParams.get('bonus')) || 0;

      if (status === 'success' && user?.id) {
        try {
          const { error } = await supabase
            .from('users')
            .update({
              credit: (credit || 0) + amount + bonus,
            })
            .eq('id', user.id);

          if (error) {
            console.error('크레딧 업데이트 중 오류 발생:', error.message);
          } else {
            alert(`${amount.toLocaleString()}C 충전이 완료되었습니다!`);
          }
        } catch (error) {
          console.error('결제 성공 처리 중 오류 발생:', error);
        }
      } else if (status === 'fail') {
        alert('결제가 실패했습니다. 다시 시도해주세요.');
      }

      router.push('/mypage/credit');
    };

    handlePaymentResult();
  }, [user?.id, credit, router]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError || !user) {
    return <div>데이터를 가져오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <div className="p-4 bg-white h-screen">
      {/* 상단 제목 및 뒤로가기 */}
      <div className="flex items-center mb-4">
        <button className="text-gray-500" onClick={() => router.back()}>
          ←
        </button>
      </div>

      {/* 보유 크레딧 */}
      <div className="mb-6">
        <h2 className="text-gray-600 text-lg font-medium mb-2">보유 크레딧</h2>
        <div className="bg-gray-100 rounded-lg p-4 flex items-center">
          <div className="w-16 h-16 bg-gray-300 rounded mr-4" />
          <p className="text-3xl font-bold">{credit?.toLocaleString()}c</p>
        </div>
      </div>

      {/* 충전하기 */}
      <h2 className="text-gray-600 text-lg font-medium mb-4">충전하기</h2>
      <div className="space-y-4">
        {paymentOptions.map(({ amount, bonusRate }) => {
          const bonus = Math.floor(amount * bonusRate);
          return (
            <div
              key={amount}
              className="bg-gray-100 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-xl font-bold">{amount.toLocaleString()}C</p>
                <p className="text-blue-500 text-sm font-medium mt-1">
                  +{bonus.toLocaleString()} 추가 크레딧
                </p>
              </div>
              <button
                className="bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg"
                onClick={() => handlePayment(amount, bonus)}
              >
                {amount.toLocaleString()}원
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreditPage;
