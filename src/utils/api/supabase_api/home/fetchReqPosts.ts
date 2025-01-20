import { supabase } from '@/utils/supabase/supabaseClient';
import { Post } from '../../tanstack/home/useReqPosts';

const PAGE_SIZE = 10; // 페이지당 불러올 항목 수
type FetchReqPostsResponse = {
  data: Post[] | null;
  nextPage: number | null;
};
export const fetchReqPosts: ({
  pageParam,
}: {
  pageParam: number;
}) => Promise<FetchReqPostsResponse> = async ({
  pageParam = 0,
}: {
  pageParam: number;
}) => {
  try {
    const from = pageParam * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    // 요청 게시물 수를 먼저 확인
    const requestCountQuery = supabase
      .from('request_posts')
      .select('*', { count: 'exact' });

    // 총 데이터 개수 가져오기
    const { count: requestCount } = await requestCountQuery.range(0, 0);
    const totalRequestCount = requestCount || 0;

    // 요청 범위가 초과되면 빈 데이터를 반환
    if (from >= totalRequestCount) {
      return {
        data: [],
        nextPage: null, // 더 이상 페이지 없음
      };
    }

    // 유효한 범위에 대해서만 데이터 요청
    const requestQuery = supabase
      .from('request_posts')
      .select('*')
      .range(from, to);

    const { data: response_posts } = await requestQuery;
    // 데이터 병합

    // 다음 페이지 확인
    const hasMore = (pageParam + 1) * PAGE_SIZE < totalRequestCount;

    return {
      data: response_posts,
      nextPage: hasMore ? pageParam + 1 : null,
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error; // 에러 재발생
  }
};
