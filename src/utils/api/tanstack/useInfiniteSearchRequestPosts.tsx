import { FetchPostsResult, PostData } from '@/app/search/[id]/_types/searchTypes';
import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { fetchSearchRequestPosts } from '../supabase_api/fetchSearchRequestPosts';
const PAGE_SIZE = 12; // 페이지 사이즈

const useInfiniteSearchPosts = (
  keyword: string,
  setNoResults: Dispatch<SetStateAction<boolean>>,
) => {
  const {
    data: searchedRequestPost,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<FetchPostsResult, Error, PostData[], QueryKey, number>({
    queryKey: ['searched request post', keyword],
    queryFn: async ({ pageParam = 1 }) => {
      const posts = await fetchSearchRequestPosts(keyword, pageParam);
      if (posts?.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
      }
      return {
        data: posts,
        nextPage: posts.length === PAGE_SIZE ? pageParam + 1 : null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    select: (data) => {
      // pages 배열에서 data 속성을 평탄화하여 PostData[] 배열로 변환
      return data.pages.flatMap((page) => page.data) || [];
    },
  });

  return {
    searchedRequestPost,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
};

export default useInfiniteSearchPosts;
