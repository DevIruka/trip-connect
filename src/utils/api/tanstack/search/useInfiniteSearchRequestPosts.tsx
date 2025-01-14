import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { fetchSearchRequestPosts } from '../../supabase_api/search/fetchSearchRequestPosts';
import {
  FetchRequestPostsResult,
} from '@/app/search/[id]/_types/searchTypes';
import { ReqResPost } from '@/app/search/_components/SearchResults';
const PAGE_SIZE = 5; // 페이지 사이즈

const useInfiniteSearchRequestPosts = (
  keyword: string,
  setNoReqResults: Dispatch<SetStateAction<boolean>>,
) => {
  const {
    data: searchedRequestPost,
    hasNextPage: requestHasNextPage,
    fetchNextPage: requestFetchNextPage,
    isFetchingNextPage: requestIsFetchingNextPage,
  } = useInfiniteQuery<
    FetchRequestPostsResult,
    Error,
    ReqResPost[],
    QueryKey,
    number
  >({
    queryKey: ['searched request post', keyword],
    queryFn: async ({ pageParam = 1 }) => {
      const posts = await fetchSearchRequestPosts(keyword, pageParam);
      if (posts?.length === 0) {
        setNoReqResults(true);
      } else {
        setNoReqResults(false);
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
      const flattenedData = data.pages.flatMap((page) => page.data) || [];
      return flattenedData;
    },
  });
  return {
    searchedRequestPost,
    requestHasNextPage,
    requestFetchNextPage,
    requestIsFetchingNextPage,
  };
};

export default useInfiniteSearchRequestPosts;
