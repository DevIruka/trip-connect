import { Tables } from '@/types/supabase';
import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { fetchResPosts } from '../../supabase_api/home/fetchResPosts';

export type FetchResPostsResponse = {
  data: Tables<'response_posts'>[] | null;
  nextPage: number | null;
};

export const useResPosts = () => {
  const {
    data: response_posts,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    FetchResPostsResponse,
    Error,
    Tables<'response_posts'>[],
    QueryKey,
    number
  >({
    queryKey: ['response_posts'],
    queryFn: fetchResPosts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    select: (data) => data.pages.flatMap((page) => page.data || []),
    initialPageParam: 0, // 여기에 초기 페이지를 지정
  });

  return {
    response_posts,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
