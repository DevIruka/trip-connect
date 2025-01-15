import { fetchPosts } from '@/app/(home)/_utils/fetchPosts';
import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';

// 게시물 데이터 타입 정의
type Post = {
  created_at: string;
  id: string | number;
  title: string;
  user_id: string;

  category?: string[] | null;
  content?: string | null;
  country_city?: string | null;
  credit?: number | null;
  date_end?: string | null;
  img_url?: string | null;

  content_html?: string | null;
  free_content?: string | null;
  request_id?: string;
  request_posts?: { category: string[] } | null;
  verified_country?: string | null;
};

// fetchPosts 함수의 반환값 타입 정의
type FetchPostsResponse = {
  data: Post[];
  nextPage: number | null; // 다음 페이지 번호 (없으면 null)
};

export const usePosts = (category: string) => {
  const isAll = category === 'all'; // 'all'인지 확인
  const {
    data: allPosts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<FetchPostsResponse, Error, Post[], QueryKey, number>({
    queryKey: ['request_posts', isAll ? 'all' : category], // 'all'일 경우 특별한 캐시 키 사용
    queryFn: ({ pageParam = 0 }) =>
      fetchPosts({ pageParam, category: isAll ? '' : category }), // 'all'일 경우 category 제거
    getNextPageParam: (lastPage) => lastPage.nextPage, // 다음 페이지 번호 계산
    select: (data) => data?.pages.flatMap((page) => page.data) || [],
    initialPageParam: 0, // 여기에 초기 페이지를 지정
  });

  return {
    allPosts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
