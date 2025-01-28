import { Tables } from '@/types/supabase';
import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { fetchResPosts } from '../../supabase_api/home/fetchResPosts';
import { Post } from '@/app/home/_types/homeTypes';

export type FetchResPostsResponse = {
  data: Post[] | null;
  nextPage: number | null;
};

export const useResPosts = () => {
  const {
    data: response_posts,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<FetchResPostsResponse, Error, Post[], QueryKey, number>({
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
