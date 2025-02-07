import { supabase } from '@/utils/supabase/supabaseClient';

export const fetchSearchRequestPosts = async (
  keyword: string | null,
  page: number,
  limit: number = 5,
) => {
  const startIndex = (page - 1) * limit;

  const query = supabase
    .from('request_posts')
    .select('*', { count: 'exact' })
    .ilike('title', `%${keyword}%`)
    .range(startIndex, startIndex + limit - 1);

  const { data: searched_request_posts, count, error } = await query;

  if (error) throw new Error(error.message);

  return { searched_request_posts, totalCount: count };
};
