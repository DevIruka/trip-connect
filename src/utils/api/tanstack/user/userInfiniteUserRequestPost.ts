import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { FetchRequestPostsResult } from '@/app/search/[id]/_types/searchTypes';
import { fetchUserRequestPosts } from '../../supabase_api/user/fetchRequest';
import { ReqResPost } from '@/app/search/[id]/_components/SearchResults';
import { pagination } from '@/constants/pagination';
const PAGE_SIZE = pagination.user.posts; // 페이지 사이즈

const useInfiniteUserRequestPosts = (
  user_id: string,
  setResponseCount: React.Dispatch<React.SetStateAction<number[] | [] | null>>,
) => {
  const {
    data: userRequestPost,
    hasNextPage: requestHasNextPage,
    fetchNextPage: requestFetchNextPage,
    isFetchingNextPage: requestIsFetchingNextPage,
    isPending: responseIsPending,
  } = useInfiniteQuery<
    FetchRequestPostsResult,
    Error,
    ReqResPost[],
    QueryKey,
    number
  >({
    queryKey: ['searched request post', user_id],
    queryFn: async ({ pageParam = 1 }) => {
      const { user_request_posts, totalCount } = await fetchUserRequestPosts(
        user_id,
        pageParam,
      );
      setResponseCount(totalCount);
      return {
        data: user_request_posts,
        nextPage:
          user_request_posts.length === PAGE_SIZE ? pageParam + 1 : null,
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
    userRequestPost,
    requestHasNextPage,
    requestFetchNextPage,
    requestIsFetchingNextPage,
    responseIsPending,
  };
};

export default useInfiniteUserRequestPosts;
