import { loadTossPayments } from '@tosspayments/payment-sdk';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabaseClient';

const TEST_CLIENT_KEY = 'test_ck_mBZ1gQ4YVXWzABpg7g6a3l2KPoqN';

export const useHandlePayment = () => {
  const router = useRouter();

  const handlePayment = async (amount: number, bonus: number, customerName: string) => {
    try {
      // 토스 결제 SDK 로드
      const tossPayments = await loadTossPayments(TEST_CLIENT_KEY);

      // 결제 요청
      await tossPayments.requestPayment('카드', {
        amount, // 결제 금액
        orderId: `order-${Date.now()}`, // 고유 주문 ID
        orderName: `${amount.toLocaleString()}C 충전`, // 주문 이름
        customerName, // 사용자 이름
        successUrl: `${window.location.origin}/mypage/credit?status=success&amount=${amount}&bonus=${bonus}`, // 결제 성공 URL
        failUrl: `${window.location.origin}/mypage/credit?status=fail`, // 결제 실패 URL
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error('결제 요청 중 오류 발생:', error.message);
        alert('결제 요청 중 문제가 발생했습니다. 다시 시도해주세요.');
      } else {
        console.error('결제 요청 중 알 수 없는 오류 발생:', error);
        alert('결제 요청 중 알 수 없는 문제가 발생했습니다.');
      }
    }
  };

  const processPaymentResult = async (
    userId: string,
    currentCredit: number,
    queryParams: URLSearchParams
  ) => {
    const status = queryParams.get('status');
    const amount = Number(queryParams.get('amount')) || 0;
    const bonus = Number(queryParams.get('bonus')) || 0;

    if (status === 'success') {
      try {
        // 크레딧 업데이트
        const { error } = await supabase
          .from('users')
          .update({
            credit: currentCredit + amount + bonus,
          })
          .eq('id', userId);

        if (error) {
          console.error('크레딧 업데이트 중 오류 발생:', error.message);
          alert('크레딧 업데이트에 실패했습니다.');
        } else {
          alert(`${amount.toLocaleString()}C 충전이 완료되었습니다!`);
        }
      } catch (error) {
        console.error('결제 성공 처리 중 오류 발생:', error);
        alert('결제 성공 처리 중 문제가 발생했습니다.');
      }
    } else if (status === 'fail') {
      alert('결제가 실패했습니다. 다시 시도해주세요.');
    }

    // 페이지 이동
    router.push('/mypage/credit');
  };

  return { handlePayment, processPaymentResult };
};
