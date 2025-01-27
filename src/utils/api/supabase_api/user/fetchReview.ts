import { Tables } from '@/types/supabase';
import { supabase } from '@/utils/supabase/supabaseClient';

export type FetchUserReviewsResult = {
  user_reviews: (Tables<'reviews'> & {
    response_posts: Tables<'response_posts'>;
    users: Tables<'users'>;
    purchased_user_created_at : string | null
  })[],
};

export const fetchUserReviews = async (
  user_id: string | null,
  page: number,
  limit: number = 5,
): Promise<FetchUserReviewsResult> => {
  const startIndex = (page - 1) * limit;

  const { data, error } = await supabase
    .from('reviews') // ✅ 'reviews' 테이블을 기준으로 조회
    .select(
      `
      *,
      response_posts(*),
      users(*)
    `,
    )
    .eq('response_posts.user_id', user_id) // ✅ response_posts의 user_id로 필터링
    .range(startIndex, startIndex + limit - 1);

  if (error) throw new Error(error.message);
  const user_ids = data?.map((review) => review.users.id); // 첫 번째 쿼리에서 가져온 user_id들

  if (!user_ids || user_ids.length === 0) return { user_reviews: [] };

  // purchased_users에서 해당 user_id들의 created_at 값을 가져오기
  const { data: purchasedUsersData, error: purchasedUsersError } =
    await supabase
      .from('purchased_users')
      .select('user_id, created_at')
      .in('user_id', user_ids);

  if (purchasedUsersError) throw new Error(purchasedUsersError.message);

  // 3. 두 쿼리 결과 결합: 리뷰에 purchased_users의 created_at 추가
  const user_reviews =
    data?.map((review) => {
      const purchasedUser = purchasedUsersData?.find(
        (user) => user.user_id === review.users.id,
      );

      return {
        ...review,
        purchased_user_created_at: purchasedUser?.created_at || null,
      };
    }) ?? [];

  return { user_reviews };
};
