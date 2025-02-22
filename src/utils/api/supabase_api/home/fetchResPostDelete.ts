import { Tables } from '@/types/supabase';
import { supabase } from '@/utils/supabase/supabaseClient';

export const fetchResPostDelete = async (
  post: Tables<'response_posts'>,
  userId?: string,
) => {
  if (userId !== post.user_id) alert('작성자가 아닙니다.');
  else {
    try {
      const { error } = await supabase
        .from('response_posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;
      window.location.href = '/'; // 삭제 후 홈으로 리다이렉트
    } catch (error) {
      console.error('Error:', error);
      alert('삭제 중 문제가 발생했습니다.');
    }
  }
};
