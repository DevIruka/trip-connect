import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPosts } from '../_utils/fetchPosts';

// 게시물 데이터 타입 정의
type Post = {
  id: string;
  title: string;
  content: string;
  credit: number;
  date_end: string;
  category: string;
};

// fetchPosts 함수의 반환값 타입 정의
type FetchPostsResponse = {
  data: Post[];
  nextPage: number | null; // 다음 페이지 번호 (없으면 null)
};

export const usePosts = (category: string) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<FetchPostsResponse, Error, any, [string, string], number>({
      queryKey: ['request_posts', category], // 카테고리 기반 캐시 키
      queryFn: ({ pageParam = 0 }) => fetchPosts({ pageParam, category }),
      getNextPageParam: (lastPage) => lastPage.nextPage, // 다음 페이지 번호 계산
    });

  // 모든 게시물 데이터를 평탄화(flatten)하여 반환
  const allPosts = data?.pages.flatMap((page) => page.data) || [];

  return {
    allPosts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
