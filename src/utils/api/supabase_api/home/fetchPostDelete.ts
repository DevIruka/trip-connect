import { Tables } from '@/types/supabase';
import { supabase } from '@/utils/supabase/supabaseClient';

export const fetchPostDelete = async (
  post: Tables<'request_posts'>,
  userId?: string,
) => {
  if (userId !== post.user_id) alert('작성자가 아닙니다.');
  else {
    try {
      const { error } = await supabase
        .from('request_posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;

      alert('삭제되었습니다.');
    } catch (error) {
      console.error('Error:', error);
      alert('삭제 중 문제가 발생했습니다.');
    }
  }
};
