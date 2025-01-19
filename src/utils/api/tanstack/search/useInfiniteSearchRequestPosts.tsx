import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { fetchSearchRequestPosts } from '../../supabase_api/search/fetchSearchRequestPosts';
import {
  FetchRequestPostsResult,
} from '@/app/search/[id]/_types/searchTypes';
import { ReqResPost } from '@/app/search/[id]/_components/SearchResults';
const PAGE_SIZE = 5; // 페이지 사이즈

const useInfiniteSearchRequestPosts = (
  keyword: string,
  setNoReqResults: Dispatch<SetStateAction<boolean>>,
  setCountReq : Dispatch<SetStateAction<number | null>>
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
      const { searched_request_posts, totalCount: count } = await fetchSearchRequestPosts(keyword, pageParam);
      if (searched_request_posts?.length === 0) {
        setNoReqResults(true);
      } else {
        setNoReqResults(false);
        setCountReq(count)
      }
      return {
        data: searched_request_posts,
        nextPage: searched_request_posts.length === PAGE_SIZE ? pageParam + 1 : null,
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
