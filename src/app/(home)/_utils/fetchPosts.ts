import { supabase } from '@/utils/supabase/supabaseClient';

const PAGE_SIZE = 5; // 페이지당 불러올 항목 수

export const fetchPosts = async ({
  pageParam = 0,
  category,
}: {
  pageParam: number;
  category?: string;
}) => {
  try {
    // 시작 인덱스와 끝 인덱스 계산
    const from = pageParam * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase.from('request_posts').select('*').range(from, to);
    const responseQuery = supabase
      .from('response_posts')
      .select('*')
      .range(from, to);

    if (category !== 'All') {
      query = query.contains('category', [category]); // 카테고리 필터
    }

    const { data: request_posts, error } = await query;
    const { data: response_posts } = await responseQuery;
    if (error) throw new Error(error.message); // 에러 처리

    return {
      data: [...request_posts, ...response_posts] || [], // 데이터 반환 (null 방지)
      nextPage: request_posts?.length === PAGE_SIZE ? pageParam + 1 : null, // 다음 페이지 여부 확인
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error; // 에러 재발생
  }
};
