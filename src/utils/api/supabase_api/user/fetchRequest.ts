import { ReqResPost } from '@/app/search/[id]/_components/SearchResults';
import { supabase } from '@/utils/supabase/supabaseClient';

type FetchUserRequestPostsResult = {
  user_request_posts: ReqResPost[];
  totalCount: number[];
};

export const fetchUserRequestPosts = async (
  user_id: string | null,
  page: number,
  limit: number = 5,
): Promise<FetchUserRequestPostsResult> => {
  if (!user_id) throw new Error('User ID is required');

  const startIndex = (page - 1) * limit;

  const { data, error } = await supabase
    .from('request_posts')
    .select(
      `*, 
      response_posts(count)`,
    )
    .eq('user_id', user_id)
    .range(startIndex, startIndex + limit - 1);

  if (error) throw new Error(error.message);

  // `response_count` 값을 따로 추출해서 `totalCount` 배열로 저장
  const user_request_posts = data?.map((post) => {
    const { response_posts, ...rest } = post;
    return rest;
  });

  const totalCount = data?.map((post) => post.response_posts?.[0]?.count || 0) ?? [];

  return { user_request_posts, totalCount };
};
