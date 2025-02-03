import { supabase } from '@/utils/supabase/supabaseClient';

//단일 게시물에 대한 답변글을 모두 가져옴
export const fetchResPosts = async (postId: string) => {
  const { data, error } = await supabase
    .from('response_posts')
    .select('*')
    .eq('request_id', postId);
  if (error) throw new Error(error.message);
  return { post: data };
};
