import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { fetchSearchResponsePosts } from '../../supabase_api/search/fetchSearchResponsePosts';
import {
  ExtendedResponsePostData,
  FetchResponsePostsResult,
} from '@/app/search/[id]/_types/searchTypes';
import { pagination } from '@/constants/pagination';
const PAGE_SIZE = pagination.search.posts; // 페이지 사이즈

const useInfiniteSearchResponsePosts = (
  keyword: string,
  setNoResResults: Dispatch<SetStateAction<boolean>>,
  setCountReq: Dispatch<SetStateAction<number | null>>,
) => {
  const {
    data: searchedResponsePost,
    hasNextPage: responseHasNextPage,
    fetchNextPage: responseFetchNextPage,
    isFetchingNextPage: responseIsFetchingNextPage,
  } = useInfiniteQuery<
    FetchResponsePostsResult,
    Error,
    ExtendedResponsePostData[],
    QueryKey,
    number
  >({
    queryKey: ['searched response post', keyword],
    queryFn: async ({ pageParam = 1 }) => {
      const { searched_response_posts, totalCount } =
        await fetchSearchResponsePosts(keyword, pageParam);
      if (searched_response_posts?.length === 0) {
        setNoResResults(true);
      } else {
        setNoResResults(false);
        setCountReq(totalCount);
      }
      return {
        data: searched_response_posts,
        nextPage:
          searched_response_posts.length === PAGE_SIZE ? pageParam + 1 : null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    select: (data) => {
      const flattenedData = data.pages.flatMap((page) => page.data) || [];
      return flattenedData;
    },
  });
  return {
    searchedResponsePost,
    responseHasNextPage,
    responseFetchNextPage,
    responseIsFetchingNextPage,
  };
};

export default useInfiniteSearchResponsePosts;
