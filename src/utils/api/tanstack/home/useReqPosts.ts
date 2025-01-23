import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { fetchReqPosts } from '../../supabase_api/home/fetchReqPosts';

// fetchPosts 함수의 반환값 타입 정의
export type FetchReqPostsResponse = {
  data: Post[] | null;
  nextPage: number | null;
};

export type Post = {
  category: string[];
  content: string;
  country_city: string;
  created_at: string;
  credit: number;
  date_end: string | undefined;
  id: string;
  img_url: string | null;
  title: string;
  user_id: string;
};

export const useReqPosts = () => {
  const {
    data: ReqPosts,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    FetchReqPostsResponse,
    Error,
    (Post | null)[],
    QueryKey,
    number
  >({
    queryKey: ['request_posts'], // 'all'일 경우 특별한 캐시 키 사용
    queryFn: ({ pageParam = 0 }) => fetchReqPosts({ pageParam }), // 'all'일 경우 category 제거
    getNextPageParam: (lastPage) => lastPage.nextPage, // 다음 페이지 번호 계산
    select: (data) => data?.pages.flatMap((page) => page.data) || [],
    initialPageParam: 0, // 여기에 초기 페이지를 지정
  });

  return {
    ReqPosts,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
