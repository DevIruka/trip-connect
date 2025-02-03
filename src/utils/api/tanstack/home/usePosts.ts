import { Tables } from '@/types/supabase';
import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { fetchReqPosts } from '../../supabase_api/home/fetchReqPosts';
import { fetchResPosts } from '../../supabase_api/home/fetchResPosts';

type PostType = 'request' | 'response';

export type FetchPostsResponse = {
  data: (Tables<'request_posts'> | Tables<'response_posts'>)[] | null;
  nextPage: number | null;
};

export const usePosts = (postType: PostType) => {
  const {
    data: posts,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    FetchPostsResponse,
    Error,
    (Tables<'request_posts'> | Tables<'response_posts'>)[],
    QueryKey,
    number
  >({
    queryKey: [postType === 'request' ? 'request_posts' : 'response_posts'],
    queryFn: postType === 'request' ? fetchReqPosts : fetchResPosts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    select: (data) => data.pages.flatMap((page) => page.data || []),
    initialPageParam: 0,
  });

  return {
    posts,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
