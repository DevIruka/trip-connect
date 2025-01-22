import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import {
  ExtendedResponsePostData,
  FetchResponsePostsResult,
} from '@/app/search/[id]/_types/searchTypes';
import { fetchUserResponsePosts } from '../../supabase_api/user/fetchResponse';
const PAGE_SIZE = 5; // 페이지 사이즈

const useInfiniteUserResponsePosts = (
  user_id: string,
  setReviewCount: React.Dispatch<React.SetStateAction<number[] | [] | null>>,
) => {
  const {
    data: userResponsePost,
    hasNextPage: responseHasNextPage,
    fetchNextPage: responseFetchNextPage,
    isFetchingNextPage: responseIsFetchingNextPage,
    isPending,
  } = useInfiniteQuery<
    FetchResponsePostsResult,
    Error,
    ExtendedResponsePostData[],
    QueryKey,
    number
  >({
    queryKey: ['searched response post', user_id],
    queryFn: async ({ pageParam = 1 }) => {
      const { user_response_posts, totalCount } = await fetchUserResponsePosts(
        user_id,
        pageParam,
      );
      setReviewCount(totalCount);
      return {
        data: user_response_posts,
        nextPage:
          user_response_posts.length === PAGE_SIZE ? pageParam + 1 : null,
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
    userResponsePost,
    responseHasNextPage,
    responseFetchNextPage,
    responseIsFetchingNextPage,
    isPending,
  };
};

export default useInfiniteUserResponsePosts;
