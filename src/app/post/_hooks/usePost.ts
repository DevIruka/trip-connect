import { supabase } from '@/utils/supabase/supabaseClient';
import { useQuery } from '@tanstack/react-query';

// 단일 게시물을 가져오는 커스텀 훅
export const usePost = (postId: string) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('request_posts')
        .select('*')
        .eq('id', postId)
        .single(); // 단일 게시물 조회

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!postId, // postId가 유효한 경우에만 실행
  });
};
