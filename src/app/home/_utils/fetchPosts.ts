import { supabase } from '@/utils/supabase/supabaseClient';

const PAGE_SIZE = 10; // 페이지당 불러올 항목 수

export const fetchPosts = async ({
  pageParam = 0,
  category,
}: {
  pageParam: number;
  category?: string;
}) => {
  try {
    const from = pageParam * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    // 요청 게시물 수를 먼저 확인
    let requestCountQuery = supabase
      .from('request_posts')
      .select('*', { count: 'exact' });

    let responseCountQuery = supabase.from('response_posts').select(
      `
        *,
        request_posts!inner(category)
      `,
      { count: 'exact' },
    );

    if (category !== 'All') {
      requestCountQuery = requestCountQuery.contains('category', [category]);
      responseCountQuery = responseCountQuery.contains(
        'request_posts.category',
        [category],
      );
    }

    // 총 데이터 개수 가져오기
    const { count: requestCount } = await requestCountQuery.range(0, 0);
    const { count: responseCount } = await responseCountQuery.range(0, 0);
    const totalRequestCount = requestCount || 0;
    const totalResponseCount = responseCount || 0;
    const totalPosts = totalRequestCount + totalResponseCount;

    // 요청 범위가 초과되면 빈 데이터를 반환
    if (from >= totalPosts) {
      return {
        data: [],
        nextPage: null, // 더 이상 페이지 없음
      };
    }

    // 유효한 범위에 대해서만 데이터 요청
    let requestQuery = supabase
      .from('request_posts')
      .select('*')
      .range(from, to);

    let responseQuery = supabase
      .from('response_posts')
      .select(
        `
        *,
        request_posts!inner(category)
      `,
      )
      .range(from, to);

    if (category !== 'All') {
      requestQuery = requestQuery.contains('category', [category]);
      responseQuery = responseQuery.contains('request_posts.category', [
        category,
      ]);
    }

    const { data: request_posts } = await requestQuery;
    const { data: response_posts } = await responseQuery;
    // 데이터 병합
    const combinedPosts = [...(request_posts || []), ...(response_posts || [])];

    // 다음 페이지 확인
    const hasMore = (pageParam + 1) * PAGE_SIZE < totalPosts;

    return {
      data: combinedPosts,
      nextPage: hasMore ? pageParam + 1 : null,
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error; // 에러 재발생
  }
};
