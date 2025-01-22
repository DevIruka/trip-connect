import { ExtendedResponsePostData } from '@/app/search/[id]/_types/searchTypes';
import { supabase } from '@/utils/supabase/supabaseClient';

type FetchUserResponsePostsResult = {
  searched_response_posts: ExtendedResponsePostData[];
  totalCount: number | null;
};

export const fetchUserResponsePosts = async (
  user_id: string | null,
  page: number,
  limit: number = 5,
): Promise<FetchUserResponsePostsResult> => {
  const startIndex = (page - 1) * limit;

  const query = supabase
    .from('response_posts')
    .select(
      `
      *,
      request_posts (category, credit)
    `,
    )
    .eq('user_id', `${user_id}`)
    .range(startIndex, startIndex + limit - 1);

  const { data, error, count } = await query;

  console.log(data)

  if (error) throw new Error(error.message);

  const searched_response_posts = data?.map((post) => {
    const { request_posts, ...rest } = post;
    return {
      ...rest,
      category: request_posts?.category || null,
    };
  });

  return { searched_response_posts, totalCount: count };
};
