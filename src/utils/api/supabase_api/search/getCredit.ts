import { supabase } from '@/utils/supabase/supabaseClient';

export const getCredit = async (requestId: string | undefined) => {
  if (requestId === undefined) {
    return;
  }
  const {
    data: credit,
    error,
  } = await supabase
    .from('request_posts') // 테이블 이름
    .select('credit') // 정확한 개수를 반환하도록 설정
    .eq('id', requestId); // 특정 조건 필터링

  if (error) {
    console.error('Error fetching comment count:', error);
    return 0;
  }

  return credit;
};
