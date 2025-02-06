import { supabase } from '@/utils/supabase/supabaseClient';

// 단일 게시물을 가져오는 커스텀 훅
export const fetchReqPost = async (postId: string) => {
  const { data, error } = await supabase
    .from('request_posts')
    .select(
      `*,
        users!inner(country)`,
    )
    .eq('id', postId)
    .single(); // 단일 게시물 조회

  if (error) {
    console.error('게시물 불러오기 실패:', error.message);
    return { post: null, error };
  }

  return { post: data, error: null };
};
