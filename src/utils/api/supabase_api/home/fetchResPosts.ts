import { supabase } from '@/utils/supabase/supabaseClient';
import { pagination } from '@/constants/pagination';
import { Tables } from '@/types/supabase';

const PAGE_SIZE = pagination.home.posts; // 페이지당 불러올 항목 수

type FetchResPostsResponse = {
  data: Tables<'response_posts'>[] | null;
  nextPage: number | null;
};

export const fetchResPosts = async ({
  pageParam = 0,
}: {
  pageParam: number;
}): Promise<FetchResPostsResponse> => {
  try {
    const from = pageParam * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const {
      data: response_posts,
      count: totalResponseCount,
      error,
    } = await supabase
      .from('response_posts')
      .select(
        `*,
        request_posts!inner(category,credit),
        users!inner(nickname)`,
        { count: 'exact' },
      )
      .range(from, to);

    if (error) throw error;

    const hasMore = (pageParam + 1) * PAGE_SIZE < (totalResponseCount || 0);

    return {
      data: response_posts,
      nextPage: hasMore ? pageParam + 1 : null,
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};
