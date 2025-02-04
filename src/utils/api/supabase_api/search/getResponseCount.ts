import { supabase } from '@/utils/supabase/supabaseClient';

// UUID 형식을 확인하는 정규 표현식
const isUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(str);
};

export const getResponseCount = async (requestId: string | undefined | number) => {
  // requestId가 undefined이거나 uuid 형식이 아니면 null 반환
  if (requestId === undefined || (typeof requestId === 'string' && !isUUID(requestId))) {
    return null;  // undefined 대신 null 반환
  }

  const { error, count } = await supabase
    .from('response_posts') // 테이블 이름
    .select('*', { count: 'exact' }) // 정확한 개수를 반환하도록 설정
    .eq('request_id', requestId); // 특정 조건 필터링

  if (error) {
    console.error('Error fetching comment count:', error);
    return 0; // 에러 발생 시 0 반환
  }

  return count;
};

export const getReviewCount = async (
  responseId: string | undefined | number,
) => {
  if (responseId === undefined) {
    return;
  }
  const { error, count } = await supabase
    .from('reviews') // 테이블 이름
    .select('*', { count: 'exact' }) // 정확한 개수를 반환하도록 설정
    .eq('response_id', responseId); // 특정 조건 필터링

  if (error) {
    console.error('Error fetching comment count:', error);
    return 0;
  }

  return count;
};
