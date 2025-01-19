import { Post } from '@/app/home/_types/homeTypes';
import { fetchPosts } from '@/app/home/_utils/fetchPosts';
import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';

// fetchPosts 함수의 반환값 타입 정의
export type FetchPostsResponse = {
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
