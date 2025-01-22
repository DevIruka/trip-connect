import { ExtendedResponsePostData } from '@/app/[locale]/search/[id]/_types/searchTypes';
import { supabase } from '@/utils/supabase/supabaseClient';

interface FetchSearchResponsePostsResult {
  searched_response_posts: ExtendedResponsePostData[];
  totalCount: number | null;
}

export const fetchSearchResponsePosts = async (
  keyword: string | null,
  page: number,
  limit: number = 5,
): Promise<FetchSearchResponsePostsResult> => {
  const startIndex = (page - 1) * limit;

  const query = supabase
    .from('response_posts')
    .select(
      `
      *,
      request_posts (category)
    `,
      { count: 'exact' },
    )
    .ilike('title', `%${keyword}%`)
    .range(startIndex, startIndex + limit - 1);

  const { data, error, count } = await query;

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
