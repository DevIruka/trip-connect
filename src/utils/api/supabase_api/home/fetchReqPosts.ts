import { supabase } from '@/utils/supabase/supabaseClient';
import { FetchReqPostsResponse } from '../../tanstack/home/useReqPosts';
import { pagination } from '@/constants/pagination';

const PAGE_SIZE = pagination.home.posts; // 페이지당 불러올 항목 수

export const fetchReqPosts = async ({
  pageParam = 0,
}: {
  pageParam: number;
}): Promise<FetchReqPostsResponse> => {
  try {
    const from = pageParam * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const {
      data: request_posts,
      count: totalRequestCount,
      error,
    } = await supabase
      .from('request_posts')
      .select('*', { count: 'exact' })
      .range(from, to);

    if (error) throw error;

    const hasMore = (pageParam + 1) * PAGE_SIZE < (totalRequestCount || 0);

    return {
      data: request_posts,
      nextPage: hasMore ? pageParam + 1 : null,
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error; // 에러 재발생
  }
};
