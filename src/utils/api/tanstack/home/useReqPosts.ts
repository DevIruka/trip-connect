import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { fetchReqPosts } from '../../supabase_api/home/fetchReqPosts';
import { Tables } from '@/types/supabase';
import { Post } from '@/app/home/_types/homeTypes';

// fetchPosts 함수의 반환값 타입 정의
export type FetchReqPostsResponse = {
  data: Post[] | null;
  nextPage: number | null;
};

export const useReqPosts = () => {
  const {
    data: request_posts,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<FetchReqPostsResponse, Error, Post[], QueryKey, number>({
    queryKey: ['request_posts'],
    queryFn: fetchReqPosts,
    getNextPageParam: (lastPage) => lastPage.nextPage, // 다음 페이지 번호 계산
    select: (data) => data?.pages.flatMap((page) => page.data || []),
    initialPageParam: 0, // 여기에 초기 페이지를 지정
  });

  return {
    request_posts,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
