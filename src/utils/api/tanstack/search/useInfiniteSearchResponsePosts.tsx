import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { fetchSearchResponsePosts } from '../../supabase_api/search/fetchSearchResponsePosts';
import {
  ExtendedResponsePostData,
  FetchResponsePostsResult,
} from '@/app/search/[id]/_types/searchTypes';
const PAGE_SIZE = 12; // 페이지 사이즈

const useInfiniteSearchResponsePosts = (
  keyword: string,
  setNoResults: Dispatch<SetStateAction<boolean>>,
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
      const posts = await fetchSearchResponsePosts(keyword, pageParam);
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
    searchedResponsePost,
    responseHasNextPage,
    responseFetchNextPage,
    responseIsFetchingNextPage,
  };
};

export default useInfiniteSearchResponsePosts;
