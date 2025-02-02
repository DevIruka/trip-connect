import { supabase } from '@/utils/supabase/supabaseClient';

export const fetchLike = async (userId: string) => {
  const { data: like, error } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
  return like || [];
};

// 라이크 추가
export const addLike = async (postId: string | number, userId: string) => {
  const { error } = await supabase
    .from('likes')
    .insert([{ user_id: userId, request_id: postId }])
    .select();
  if (error) throw new Error(error.message);
};

// 라이크 삭제
export const deleteLike = async (
  postId: string | number,
  userId: string | undefined,
) => {
  const { error } = await supabase
    .from('likes')
    .delete()
    .match({ user_id: userId, request_id: postId });
  if (error) throw new Error(error.message);
};

//라이크 몇개인지
export const getLikeCount = async (requestId: string | undefined | number) => {
  if (requestId === undefined) {
    return;
  }
  const { error, count } = await supabase
    .from('likes') // 테이블 이름
    .select('*', { count: 'exact' }) // 정확한 개수를 반환하도록 설정
    .eq('request_id', requestId); // 특정 조건 필터링

  if (error) {
    console.error('Error fetching comment count:', error);
    return 0;
  }

  return count;
};
