import { supabase } from '@/utils/supabase/supabaseClient';

export const getResponseCount = async (requestId: string | undefined) => {
  if (requestId === undefined) {
    return;
  }
  const { data, error, count } = await supabase
    .from('response_posts') // 테이블 이름
    .select('*', { count: 'exact' }) // 정확한 개수를 반환하도록 설정
    .eq('request_id', requestId); // 특정 조건 필터링

  if (error) {
    console.error('Error fetching comment count:', error);
    return 0;
  }

  return count;
};
