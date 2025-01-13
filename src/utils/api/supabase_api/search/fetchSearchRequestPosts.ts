import { supabase } from '@/utils/supabase/supabaseClient';

export const fetchSearchRequestPosts = async (
  keyword: string | null,
  page: number,
  limit: number = 12,
) => {
  const startIndex = (page - 1) * limit;

  const query = supabase
    .from('request_posts')
    .select('*')
    .ilike('title', `%${keyword}%`)
    .range(startIndex, startIndex + limit - 1);

  const { data: searched_request_posts, error } = await query;

  if (error) throw new Error(error.message);

  return searched_request_posts;
};
