import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { Tables } from '@/types/supabase';
import { fetchUserReviews } from '../../supabase_api/user/fetchReview';
import { FetchReviewResult } from '@/app/search/[id]/_types/searchTypes';
const PAGE_SIZE = 5; // 페이지 사이즈

const useInfiniteUserReview = (
  user_id: string,
) => {
  const {
    data: userReviewPost,
    hasNextPage: reviewHasNextPage,
    fetchNextPage: reviewFetchNextPage,
    isFetchingNextPage: reviewIsFetchingNextPage,
    isPending: reviewIsPending,
  } = useInfiniteQuery<
    FetchReviewResult,
    Error,
    (Tables<'reviews'> & {
        response_posts: Tables<'response_posts'>;
        users: Tables<'users'>;
        purchased_user_created_at : string | null
      })[],
    QueryKey,
    number
  >({
    queryKey: ['searched review', user_id],
    queryFn: async ({ pageParam = 1 }) => {
      const { user_reviews } = await fetchUserReviews(
        user_id,
        pageParam,
      );
      return {
        data: user_reviews,
        nextPage:
        user_reviews.length === PAGE_SIZE ? pageParam + 1 : null,
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
    userReviewPost,
    reviewHasNextPage,
    reviewFetchNextPage,
    reviewIsFetchingNextPage,
    reviewIsPending,
  };
};

export default useInfiniteUserReview
