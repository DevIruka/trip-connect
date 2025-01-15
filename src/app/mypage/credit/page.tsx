'use client';

import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import { useHandlePayment } from './_components/useHandlePayment';
import CreditBalance from './_components/CreditBalance';
import PaymentOptions from './_components/PaymentOptions';


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

const paymentOptions = [
  { amount: 1000, bonusRate: 0.05 },
  { amount: 5000, bonusRate: 0.05 },
  { amount: 10000, bonusRate: 0.05 },
  { amount: 20000, bonusRate: 0.1 },
  { amount: 50000, bonusRate: 0.1 },
];

const CreditPage: React.FC = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const { handlePayment, processPaymentResult } = useHandlePayment();

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

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (user?.id && credit !== undefined) {
      processPaymentResult(user.id, credit, queryParams);
    }
  }, [user?.id, credit, processPaymentResult]);

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
      <CreditBalance credit={credit} />

      {/* 충전하기 */}
      <h2 className="text-gray-600 text-lg font-medium mb-4">충전하기</h2>
      <PaymentOptions
        options={paymentOptions}
        onPayment={(amount, bonus) =>
          handlePayment(amount, bonus, user?.email || '')
        }
      />
    </div>
  );
};

export default CreditPage;
